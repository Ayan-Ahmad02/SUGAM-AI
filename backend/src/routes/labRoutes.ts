import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Get and search laboratories
router.get('/', (req, res) => {
  const { city, state, standard, capability, q } = req.query;

  let sql = 'SELECT * FROM laboratories WHERE 1=1';
  const params: any[] = [];

  if (city && city !== 'All') {
    sql += ' AND city LIKE ?';
    params.push(`%${city}%`);
  }

  if (state && state !== 'All') {
    sql += ' AND state LIKE ?';
    params.push(`%${state}%`);
  }

  if (standard && standard !== 'All') {
    sql += ' AND supported_standards_json LIKE ?';
    params.push(`%${standard}%`);
  }

  if (capability && capability !== 'All') {
    sql += ' AND capabilities_json LIKE ?';
    params.push(`%${capability}%`);
  }

  if (q) {
    sql += ' AND (name LIKE ? OR city LIKE ? OR address LIKE ?)';
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const labs = db.prepare(sql).all(...params);

  const formatted = labs.map((l: any) => ({
    id: l.id,
    name: l.name,
    city: l.city,
    state: l.state,
    recognition_status: l.recognition_status,
    supported_standards: JSON.parse(l.supported_standards_json || '[]'),
    capabilities: JSON.parse(l.capabilities_json || '[]'),
    address: l.address,
    contact_phone: l.contact_phone,
    contact_email: l.contact_email,
    shortlisted: Boolean(l.shortlisted)
  }));

  return res.json(formatted);
});

// Toggle shortlist lab
router.post('/:id/shortlist', (req, res) => {
  const { id } = req.params;
  const lab = db.prepare('SELECT shortlisted FROM laboratories WHERE id = ?').get(id) as any;
  if (!lab) return res.status(404).json({ error: 'Laboratory not found' });

  const newStatus = lab.shortlisted ? 0 : 1;
  db.prepare('UPDATE laboratories SET shortlisted = ? WHERE id = ?').run(newStatus, id);

  return res.json({ id, shortlisted: Boolean(newStatus) });
});

export default router;
