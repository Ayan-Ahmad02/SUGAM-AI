import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (req, res) => {
  const { type } = req.query;

  let sql = 'SELECT * FROM saved_items WHERE 1=1';
  const params: any[] = [];

  if (type && type !== 'All') {
    sql += ' AND item_type = ?';
    params.push(type);
  }

  sql += ' ORDER BY created_at DESC';

  const items = db.prepare(sql).all(...params);

  const formatted = items.map((item: any) => ({
    id: item.id,
    user_id: item.user_id,
    item_type: item.item_type,
    title: item.title,
    item_id: item.item_id,
    metadata: JSON.parse(item.metadata_json || '{}'),
    created_at: item.created_at
  }));

  return res.json(formatted);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM saved_items WHERE id = ?').run(id);
  return res.json({ success: true });
});

export default router;
