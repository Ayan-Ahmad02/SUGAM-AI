import { Router } from 'express';
import { db } from '../db';
import { searchStandards, getStandardDetails } from '../services/knowledgeSearchService';

const router = Router();

// Search and filter standards
router.get('/', (req, res) => {
  const { q, category, status, mandatory } = req.query;

  const filters: any = {};
  if (category) filters.category = String(category);
  if (status) filters.status = String(status);
  if (mandatory !== undefined && mandatory !== '') {
    filters.mandatory = parseInt(String(mandatory), 10);
  }

  const results = searchStandards(String(q || ''), filters);
  return res.json(results);
});

// Get single standard details
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const details = getStandardDetails(id);
  if (!details) {
    return res.status(404).json({ error: 'Standard not found' });
  }
  return res.json(details);
});

// Compare 2-3 standards
router.post('/compare', (req, res) => {
  const { standardIds } = req.body;
  if (!Array.isArray(standardIds) || standardIds.length < 2) {
    return res.status(400).json({ error: 'Please provide at least 2 standard IDs to compare' });
  }

  const comparisonData = standardIds.map(id => getStandardDetails(id)).filter(Boolean);
  return res.json(comparisonData);
});

// Save standard to saved workspace
router.post('/:id/save', (req, res) => {
  const { id } = req.params;
  const std = getStandardDetails(id);
  if (!std) return res.status(404).json({ error: 'Standard not found' });

  const existing = db.prepare(`SELECT * FROM saved_items WHERE item_type = 'standard' AND item_id = ?`).get(std.id);
  if (!existing) {
    db.prepare(`
      INSERT INTO saved_items (id, user_id, item_type, title, item_id, metadata_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      `save-${Date.now()}`,
      'usr-afnan-001',
      'standard',
      `${std.is_code} (${std.title})`,
      std.id,
      JSON.stringify({ category: std.category, mandatory: std.mandatory })
    );
  }

  return res.json({ success: true, saved: true });
});

// Unsave standard
router.delete('/:id/save', (req, res) => {
  const { id } = req.params;
  db.prepare(`DELETE FROM saved_items WHERE item_type = 'standard' AND (item_id = ? OR id = ?)`).run(id, id);
  return res.json({ success: true, saved: false });
});

export default router;
