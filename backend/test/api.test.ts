import { searchStandards, getStandardDetails, matchProductToStandard } from '../src/services/knowledgeSearchService';
import { detectIntent } from '../src/services/intentService';
import { extractProductInfo } from '../src/services/productExtractionService';
import { checkClarificationNeed } from '../src/services/clarificationEngine';
import { processChatMessage } from '../src/services/aiEngine';
import { parseOcrText } from '../src/services/ocrService';
import { verifyBisMark } from '../src/services/verificationService';
import { analyzeProductClaims } from '../src/services/claimCheckerService';
import { initDatabase } from '../src/db';
import { seedDatabase } from '../src/db/seed';

async function runTests() {
  console.log('==================================================');
  console.log('🧪 RUNNING SUGAM-AI AUTOMATED COMPLIANCE TEST SUITE');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Initialize DB
  initDatabase();
  seedDatabase();

  // Test 1: Standard Search
  const results = searchStandards('bottle');
  assert(results.length > 0 && results.some((s: any) => s.is_code === 'IS 17526:2021'), 'Standards Search filters by keyword "bottle"');

  const elecResults = searchStandards('', { category: 'Electrical & Electronics' });
  assert(elecResults.length > 0 && elecResults.some((s: any) => s.is_code === 'IS 302-2-25:2014'), 'Category filtering for Electrical & Electronics');

  // Test 2: Standard Details
  const details = getStandardDetails('IS 17526:2021');
  assert(details !== null && details.clauses.length >= 4 && details.tests.length >= 3, 'Standard details retrieves clauses, tests, and documents');

  // Test 3: Product Matching Algorithm
  const match = matchProductToStandard({
    productName: 'Stainless Steel Water Bottle',
    category: 'Food & Beverages',
    material: 'Stainless Steel (SS 304)',
    intendedUse: 'Drinking Water Storage'
  });
  assert(match !== null && match.standard.is_code === 'IS 17526:2021' && match.confidence >= 0.9, 'Product matching maps water bottle to IS 17526:2021 with ≥90% confidence');

  // Test 4: AI Clarification Engine
  const genericClarif = checkClarificationNeed('electric appliance', {});
  assert(genericClarif.needsClarification === true && (genericClarif.questions?.length || 0) > 0, 'Clarification engine triggers on ambiguous "electric appliance"');

  const specificClarif = checkClarificationNeed('IS 17526:2021 stainless steel insulated bottle 750ml', {});
  assert(specificClarif.needsClarification === false, 'Clarification engine allows specific technical descriptions without unnecessary interrogation');

  // Test 5: Intent Classification
  assert(detectIntent('What tests are required for microwave ovens?') === 'CHECK_TESTS', 'Intent detection: CHECK_TESTS');
  assert(detectIntent('What documents do I need to submit?') === 'CHECK_DOCUMENTS', 'Intent detection: CHECK_DOCUMENTS');
  assert(detectIntent('Show me compliance roadmap') === 'COMPLIANCE_ROADMAP', 'Intent detection: COMPLIANCE_ROADMAP');

  // Test 6: AI Chat Processing Engine
  const chatResponse = await processChatMessage('usr-afnan-001', 'conv-test-001', 'What BIS standard applies to my stainless steel water bottle?');
  assert(chatResponse.structuredData?.is_code === 'IS 17526:2021' && chatResponse.confidenceScore >= 0.9, 'AI Chat returns grounded IS 17526:2021 response with confidence score');

  // Test 7: OCR Text Parser
  const ocr = parseOcrText('IS 302-2-25:2014 R-71020123 Water Bottle Stainless Steel AquaSafe Steelware');
  assert(ocr.isNumber === 'IS 302-2-25:2014' && ocr.licenceNumber === 'R-71020123', 'OCR parser extracts IS standard number and licence registration number');

  // Test 8: BIS Mark Verification Engine
  const verifiedMark = verifyBisMark({ licenceNumber: 'CM/L-71020123' });
  assert(verifiedMark.status === 'VERIFIED' && verifiedMark.riskLevel === 'Low', 'BIS verification validates active licence CM/L-71020123 as VERIFIED with Low risk');

  const suspiciousMark = verifyBisMark({ licenceNumber: 'CM/L-99999999' });
  assert(suspiciousMark.status === 'SUSPICIOUS' && suspiciousMark.riskLevel === 'High', 'BIS verification flags revoked licence CM/L-99999999 as SUSPICIOUS with High risk');

  // Test 9: Claim Checker
  const validClaim = analyzeProductClaims('Stainless Steel Bottle - BIS Certified ISI mark conforming to IS 17526:2021 with CM/L-71020123');
  assert(validClaim.overallStatus === 'VERIFIED' && validClaim.riskLevel === 'Low', 'Claim checker validates listing with standard and licence number');

  const deceptiveClaim = analyzeProductClaims('Stainless Steel Bottle - 100% ISI Mark and BIS Approved without registration');
  assert(deceptiveClaim.overallStatus === 'SUSPICIOUS' || deceptiveClaim.riskLevel === 'High', 'Claim checker detects missing licence on ISI claim as Suspicious');

  console.log('\n==================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
