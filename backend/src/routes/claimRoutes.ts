import { Router } from 'express';
import { analyzeProductClaims } from '../services/claimCheckerService';
import { db } from '../db';

const router = Router();

router.post('/check', (req, res) => {
  const { listingText, productUrl } = req.body;
  if (!listingText && !productUrl) {
    return res.status(400).json({ error: 'Listing text or product description is required' });
  }

  const analysis = analyzeProductClaims(listingText || productUrl);

  // Save to claim checks table
  const checkId = `chk-${Date.now()}`;
  db.prepare(`
    INSERT INTO claim_checks (id, user_id, input_text, claimed_mark, extracted_claims_json, verification_status, risk_level, evidence_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    checkId,
    'usr-afnan-001',
    (listingText || productUrl).slice(0, 500),
    analysis.detectedStandard || 'BIS Mark',
    JSON.stringify(analysis.claims),
    analysis.overallStatus,
    analysis.riskLevel,
    JSON.stringify(analysis.recommendations)
  );

  return res.json({
    id: checkId,
    ...analysis
  });
});

export default router;
