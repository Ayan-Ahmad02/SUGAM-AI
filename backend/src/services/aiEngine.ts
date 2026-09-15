import { detectIntent } from './intentService';
import { extractProductInfo, ExtractedProductInfo } from './productExtractionService';
import { checkClarificationNeed } from './clarificationEngine';
import { matchProductToStandard, getStandardDetails } from './knowledgeSearchService';
import { db } from '../db';

export interface ChatResponsePayload {
  messageId: string;
  conversationId: string;
  sender: 'assistant';
  content: string;
  confidenceScore: number;
  isClarification?: boolean;
  clarificationData?: any;
  structuredData?: {
    is_code?: string;
    title?: string;
    confidence?: number;
    mandatory?: boolean;
    category?: string;
    why_applies?: string;
    key_requirements?: string[];
    clauses?: string[];
    tests?: string[];
    documents?: string[];
    next_action?: string;
  };
  productContext?: any;
}

export async function processChatMessage(
  userId: string,
  conversationId: string,
  userQuery: string,
  currentProductContext?: any
): Promise<ChatResponsePayload> {
  const intent = detectIntent(userQuery);
  const extracted = extractProductInfo(userQuery);
  
  // Merge current product context with newly extracted attributes
  const mergedInfo: ExtractedProductInfo = {
    ...currentProductContext,
    ...extracted
  };

  // Ensure conversation exists in DB
  const existingConv = db.prepare('SELECT id FROM chat_conversations WHERE id = ?').get(conversationId);
  if (!existingConv) {
    db.prepare(`
      INSERT INTO chat_conversations (id, user_id, title, product_context_json)
      VALUES (?, ?, ?, ?)
    `).run(conversationId, userId, userQuery.slice(0, 50), JSON.stringify(currentProductContext || {}));
  }

  // 1. Clarification Check: If product query is too ambiguous
  const clarification = checkClarificationNeed(userQuery, mergedInfo);
  if (clarification.needsClarification) {
    const msgId = `msg-${Date.now()}`;
    const clarificationContent = `### More information required
To identify the applicable Indian Standard more accurately, I need a few details:

${clarification.questions?.map((q, i) => `${i + 1}. **${q}**`).join('\n')}

---
**Why am I asking?**  
${clarification.reason}

*Please reply with these details or select one of the suggested options below to proceed with accurate standard mapping.*`;

    // Save user message and assistant reply to DB
    saveMessageToDb(conversationId, 'user', userQuery, 1.0, {});
    saveMessageToDb(conversationId, 'assistant', clarificationContent, 0.65, {
      needsClarification: true,
      questions: clarification.questions,
      suggestedAnswers: clarification.suggestedAnswers
    });

    return {
      messageId: msgId,
      conversationId,
      sender: 'assistant',
      content: clarificationContent,
      confidenceScore: 0.65,
      isClarification: true,
      clarificationData: clarification,
      productContext: mergedInfo
    };
  }

  // 2. Perform Knowledge Matching
  const matchResult = matchProductToStandard(mergedInfo);
  const standard = matchResult?.standard || getStandardDetails('IS 17526:2021');

  // Check if real AI API key is configured (Gemini or OpenAI)
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  let responseContent = '';
  const confidence = matchResult ? matchResult.confidence : 0.88;

  if (geminiKey) {
    try {
      // Real Gemini API Call if user provides key
      const prompt = `You are SUGAM-AI, a senior BIS compliance intelligence assistant.
User Question: "${userQuery}"
Product Context: ${JSON.stringify(mergedInfo)}
Applicable Standard: ${standard.is_code} (${standard.title})
Clauses: ${JSON.stringify(standard.clauses.map((c: any) => `${c.clause_number}: ${c.title}`))}
Required Tests: ${JSON.stringify(standard.tests.map((t: any) => t.test_name))}
Required Documents: ${JSON.stringify(standard.documents.map((d: any) => d.document_name))}

Provide a structured, professional, grounded response following this exact format:
Applicable Standard, Why it applies, Key requirements, Required tests, Required documents, Next action, Confidence, and Source citation.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseContent = data.candidates[0].content.parts[0].text;
      }
    } catch (e) {
      console.warn('[AI] External API call failed, falling back to local engine:', e);
    }
  }

  // 3. High-Precision Local BIS Knowledge Engine (Standard Fallback or Primary)
  if (!responseContent) {
    if (intent === 'CHECK_TESTS') {
      responseContent = `### Required Tests for ${standard.is_code}
For **${standard.title}**, the following laboratory tests are mandatory under the BIS Scheme of Inspection and Testing (SIT):

${standard.tests.map((t: any, i: number) => `${i + 1}. **${t.test_name}** (${t.clause_ref})\n   - Sampling: ${t.sampling_size} | Duration: ~${t.duration_days} days | Est. Cost: ₹${t.estimated_cost_inr.toLocaleString('en-IN')}`).join('\n\n')}

---
**Next Step:** You can shortlist recognized BIS test laboratories (e.g., National Test House) from the Laboratory Finder to initiate pre-certification testing.`;
    } else if (intent === 'CHECK_DOCUMENTS') {
      responseContent = `### Required Documents for ${standard.is_code}
To file your application for BIS Grant of Licence under **${standard.is_code}**, compile the following checklist:

${standard.documents.map((d: any, i: number) => `${i + 1}. **${d.document_name}** [${d.mandatory ? 'Mandatory' : 'Optional'}]\n   - *${d.description}*`).join('\n\n')}

---
**Next Step:** You can upload and analyze these documents in the **Document Checker** to verify readiness against BIS scrutiny.`;
    } else if (intent === 'COMPLIANCE_ROADMAP') {
      responseContent = `### BIS Certification Roadmap for ${standard.is_code}
Here is the step-by-step compliance pathway from standard identification to ISI mark grant:

1. **Product Profile Setup:** Define technical specs, capacity, and materials (SS 304/316).
2. **Applicable Standard:** Conforms to **${standard.is_code}** (${standard.mandatory ? 'Mandatory QCO' : 'Voluntary'}).
3. **Certification Scheme:** Apply under **ISI Mark Scheme-I (Domestic Manufacturers)**.
4. **Mandatory Lab Testing:** Complete ${standard.tests.length} tests at in-house or recognized NABL lab.
5. **Documentation:** Assemble ${standard.documents.length} required quality & legal dossiers.
6. **Laboratory Selection:** Submit factory sample to recognized referral laboratory.
7. **Online Application:** File Form V on ManakOnline portal with prescribed fees.
8. **Factory Inspection:** Host BIS inspecting officer for verification of testing facilities.
9. **Sample Verification:** Counter-testing of sealed production samples.
10. **Grant of Licence:** Receive CM/L licence number and ISI mark rights.

Estimated Timeline: **${standard.timeline_days} days** | Estimated Testing/Fee Range: **₹${standard.estimated_cost_inr.toLocaleString('en-IN')}**`;
    } else {
      // General / Standard Matching query (matching screenshot 1 & 2)
      responseContent = `Here's what I found for your product:

### Applicable Standard
**${standard.is_code}** — *${standard.title}*

**Status:** ${standard.mandatory ? 'Mandatory (QCO Enforced)' : 'Voluntary'}  
**Confidence:** ${Math.round(confidence * 100)}%

---

### Why it applies:
${matchResult?.matchReason || 'Your product falls under the standardized product category regulated under this Indian Standard.'}

### Key requirements:
- **Material Compliance:** ${standard.clauses?.[0]?.description?.slice(0, 95) || 'Must comply with prescribed raw material grade'}...
- **Performance Thresholds:** ${standard.clauses?.[1]?.description?.slice(0, 95) || 'Meets rigorous thermal and pressure safety criteria'}...
- **Marking & Traceability:** Permanent indelible marking of CM/L licence number, batch identification, and BIS Standard Mark.

### Required tests:
${standard.tests.slice(0, 4).map((t: any, i: number) => `${i + 1}. ${t.test_name} (${t.clause_ref})`).join('\n')}

### Required documents:
${standard.documents.slice(0, 4).map((d: any, i: number) => `- ${d.document_name}`).join('\n')}

### Next action:
Verify your raw material mill certificates and initialize the **Compliance Navigator** to track testing progress.

**Source:** BIS Knowledge Base (Demonstration Record) | ${standard.clauses?.[0]?.clause_number || 'Clause 4.2'}, ${standard.clauses?.[1]?.clause_number || 'Clause 5.1'}  
*Disclaimer: Demo data for prototype demonstration. Confirm current specifications with official BIS gazette.*`;
    }
  }

  const structuredData = {
    is_code: standard.is_code,
    title: standard.title,
    confidence: Math.round(confidence * 100),
    mandatory: Boolean(standard.mandatory),
    category: standard.category,
    why_applies: matchResult?.matchReason,
    key_requirements: standard.clauses.map((c: any) => `${c.clause_number}: ${c.title}`),
    clauses: standard.clauses.map((c: any) => `${c.clause_number} ${c.title}`),
    tests: standard.tests.map((t: any) => t.test_name),
    documents: standard.documents.map((d: any) => d.document_name),
    next_action: 'Start Compliance Journey'
  };

  // Persist messages to DB
  saveMessageToDb(conversationId, 'user', userQuery, 1.0, {});
  const msgId = saveMessageToDb(conversationId, 'assistant', responseContent, confidence, structuredData);

  // Update conversation product context
  const updatedContext = {
    ...mergedInfo,
    is_code: standard.is_code,
    title: standard.title,
    confidence: Math.round(confidence * 100)
  };

  db.prepare(`UPDATE chat_conversations SET product_context_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .run(JSON.stringify(updatedContext), conversationId);

  return {
    messageId: msgId,
    conversationId,
    sender: 'assistant',
    content: responseContent,
    confidenceScore: confidence,
    structuredData,
    productContext: updatedContext
  };
}

function saveMessageToDb(conversationId: string, sender: string, content: string, confidence: number, structuredData: any): string {
  const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  db.prepare(`
    INSERT INTO chat_messages (id, conversation_id, sender, content, structured_data_json, confidence_score)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(msgId, conversationId, sender, content, JSON.stringify(structuredData), confidence);
  return msgId;
}
