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

function buildLiveSearchPrompt(userQuery: string, productContext: any, localStandard: any): string {
  return `You are SUGAM-AI, a senior Bureau of Indian Standards (BIS) compliance intelligence assistant used by Indian manufacturers, MSMEs and compliance teams.

Use your real-time web search tool to look up current, accurate information from official and authoritative sources (bis.gov.in, services.bis.gov.in, egazette.gov.in, PIB, ministry notifications, official BIS Quality Control Orders) before answering. Do not answer purely from memory — verify IS numbers, clause references, mandatory/voluntary status and fees against what you find online, since BIS standards, QCOs and fees are revised periodically.

User Question: "${userQuery}"
Product Context (as understood so far): ${JSON.stringify(productContext)}

A local reference lookup (may be outdated, use only as a rough starting hint) suggested: ${localStandard?.is_code || 'none'} — ${localStandard?.title || 'n/a'}.

Respond in this structured format (use Markdown headings):
### Applicable Standard
IS number + title, and whether it is Mandatory (QCO enforced) or Voluntary.

### Why it applies
Brief, specific reasoning tied to the product described.

### Key requirements
Bullet points of the main clauses/requirements.

### Required tests
Bullet list of mandatory tests.

### Required documents
Bullet list of documents needed for BIS licence application.

### Next action
One concrete next step for the user.

### Sources
List the specific web sources (with URLs) you used to verify this answer.

If you are not fully certain about a detail (e.g. exact clause number or current fee), say so plainly instead of guessing, and recommend the user cross-check on the official BIS portal (bis.gov.in / manakonline.bis.gov.in). Keep the tone professional and concise. Answer in the same language the user asked in (Hindi/Hinglish/English).`;
}

async function callGeminiWithSearch(prompt: string, apiKey: string): Promise<string> {
  const model = process.env.AI_MODEL || 'gemini-2.5-flash';
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], tools: [{ google_search: {} }] })
    });
    if (!res.ok) {
      console.warn(`[AI] Gemini API error (${res.status}):`, await res.text());
      return '';
    }
    const data = await res.json();
    const candidate = data.candidates?.[0];
    let text: string = candidate?.content?.parts?.map((part: any) => part.text).filter(Boolean).join('\n') || '';
    const chunks = candidate?.groundingMetadata?.groundingChunks;
    if (text && chunks?.length && !/### Sources/i.test(text)) {
      const links = chunks
        .map((chunk: any) => chunk.web?.uri && chunk.web?.title ? `- [${chunk.web.title}](${chunk.web.uri})` : null)
        .filter(Boolean)
        .slice(0, 6);
      if (links.length) text += `\n\n### Sources\n${links.join('\n')}`;
    }
    return text;
  } catch (error) {
    console.warn('[AI] Gemini live search call failed, falling back:', error);
    return '';
  }
}

async function callOpenAIWithSearch(prompt: string, apiKey: string): Promise<string> {
  const model = process.env.AI_MODEL || 'gpt-4.1-mini';
  try {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model, input: prompt, tools: [{ type: 'web_search' }] })
    });
    if (!res.ok) {
      console.warn(`[AI] OpenAI API error (${res.status}):`, await res.text());
      return '';
    }
    const data = await res.json();
    if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text;
    const messageItem = data.output?.find((item: any) => item.type === 'message');
    return messageItem?.content?.map((content: any) => content.text).filter(Boolean).join('\n') || '';
  } catch (error) {
    console.warn('[AI] OpenAI live search call failed, falling back:', error);
    return '';
  }
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
  let confidence = matchResult ? matchResult.confidence : 0.88;

  const liveSearchPrompt = buildLiveSearchPrompt(userQuery, mergedInfo, standard);

  if (geminiKey) {
    responseContent = await callGeminiWithSearch(liveSearchPrompt, geminiKey);
  }

  if (!responseContent && openaiKey) {
    responseContent = await callOpenAIWithSearch(liveSearchPrompt, openaiKey);
  }

  if (responseContent) {
    confidence = Math.max(confidence, 0.9);
    responseContent += `\n\n---\n*⚡ Answered using live web search (real-time lookup), not static demo data. Always cross-verify critical filings on the official [BIS portal](https://www.bis.gov.in).*`;
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

**Source:** Local BIS Reference Engine | ${standard.clauses?.[0]?.clause_number || 'Clause 4.2'}, ${standard.clauses?.[1]?.clause_number || 'Clause 5.1'}
*⚠️ No live AI key configured (GEMINI_API_KEY / OPENAI_API_KEY), so this answer comes from a static local reference, not real-time search. Add a key in your .env to enable live-verified answers. Always confirm current specifications on the official [BIS portal](https://www.bis.gov.in).*`;
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
