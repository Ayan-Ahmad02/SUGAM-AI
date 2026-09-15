import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (req, res) => {
  const { category, priority } = req.query;

  let sql = 'SELECT * FROM alerts WHERE 1=1';
  const params: any[] = [];

  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (priority && priority !== 'All') {
    sql += ' AND priority = ?';
    params.push(priority);
  }

  sql += ' ORDER BY is_read ASC, date_published DESC';

  const alerts = db.prepare(sql).all(...params);
  return res.json(alerts.map((a: any) => ({ ...a, is_read: Boolean(a.is_read) })));
});

router.patch('/:id/read', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE alerts SET is_read = 1 WHERE id = ?').run(id);
  return res.json({ success: true });
});

export default router;
