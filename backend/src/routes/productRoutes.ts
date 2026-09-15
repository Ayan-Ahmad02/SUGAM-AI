import { Router } from 'express';
import { matchProductToStandard, getStandardDetails, searchStandards } from '../services/knowledgeSearchService';
import { db } from '../db';

const router = Router();

router.post('/match', (req, res) => {
  const {
    productName,
    category,
    description,
    material,
    intendedUse,
    capacity,
    voltage,
    size,
    rating,
    domesticOrIndustrial,
    manufacturingLocation,
    targetMarket
  } = req.body;

  if (!productName && !description) {
    return res.status(400).json({ error: 'Product name or description is required' });
  }

  const isDomestic = domesticOrIndustrial === 'Domestic' || domesticOrIndustrial === true;

  const match = matchProductToStandard({
    productName: productName || description,
    category,
    material,
    intendedUse: intendedUse || description,
    capacity,
    voltage,
    isDomestic
  });

  if (!match) {
    return res.status(404).json({ error: 'No matching Indian Standard identified in local knowledge base' });
  }

  // Find alternative matches in the same category
  const alternatives = searchStandards('', { category: match.standard.category })
    .filter((s: any) => s.id !== match.standard.id)
    .slice(0, 2);

  return res.json({
    bestMatch: match.standard,
    confidence: Math.round(match.confidence * 100),
    matchReason: match.matchReason,
    keyRequirements: match.keyRequirements,
    clauses: match.clauses,
    tests: match.tests,
    documents: match.documents,
    alternativeMatches: alternatives,
    productDetails: {
      productName,
      category: category || match.standard.category,
      material: material || 'Stainless Steel (SS 304)',
      intendedUse: intendedUse || 'Drinking Water Storage',
      capacity,
      voltage,
      domesticOrIndustrial: isDomestic ? 'Domestic' : 'Industrial',
      manufacturingLocation: manufacturingLocation || 'India',
      targetMarket: targetMarket || 'Pan-India Domestic Market'
    }
  });
});

// Save product profile to saved workspace
router.post('/save', (req, res) => {
  const { productName, details } = req.body;
  const id = `prod-${Date.now()}`;

  db.prepare(`
    INSERT INTO saved_items (id, user_id, item_type, title, item_id, metadata_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    `save-${Date.now()}`,
    'usr-afnan-001',
    'product',
    productName || 'Product Profile',
    id,
    JSON.stringify(details || {})
  );

  return res.json({ success: true, id });
});

export default router;
