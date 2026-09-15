import { Router } from 'express';
import { db } from '../db';
import { processChatMessage } from '../services/aiEngine';

const router = Router();

// Get all conversations
router.get('/conversations', (_req, res) => {
  const convs = db.prepare(`
    SELECT * FROM chat_conversations 
    ORDER BY updated_at DESC
  `).all();

  const formatted = convs.map((c: any) => ({
    ...c,
    product_context: JSON.parse(c.product_context_json || '{}')
  }));

  return res.json(formatted);
});

// Create new conversation
router.post('/conversations', (req, res) => {
  const { title, productContext } = req.body;
  const id = `conv-${Date.now()}`;
  const convTitle = title || 'New Compliance Inquiry';
  const ctx = JSON.stringify(productContext || {});

  db.prepare(`
    INSERT INTO chat_conversations (id, user_id, title, product_context_json)
    VALUES (?, ?, ?, ?)
  `).run(id, 'usr-afnan-001', convTitle, ctx);

  return res.status(201).json({
    id,
    user_id: 'usr-afnan-001',
    title: convTitle,
    product_context: productContext || {}
  });
});

// Rename conversation
router.patch('/conversations/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  db.prepare('UPDATE chat_conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(title, id);

  return res.json({ id, title });
});

// Delete conversation
router.delete('/conversations/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM chat_conversations WHERE id = ?').run(id);
  return res.json({ success: true });
});

// Get messages for a conversation
router.get('/conversations/:id/messages', (req, res) => {
  const { id } = req.params;
  const messages = db.prepare(`
    SELECT * FROM chat_messages 
    WHERE conversation_id = ? 
    ORDER BY created_at ASC
  `).all(id);

  const formatted = messages.map((m: any) => ({
    id: m.id,
    conversation_id: m.conversation_id,
    sender: m.sender,
    content: m.content,
    structured_data: JSON.parse(m.structured_data_json || '{}'),
    confidence_score: m.confidence_score,
    created_at: m.created_at
  }));

  return res.json(formatted);
});

// Post chat message and get AI response
router.post('/', async (req, res) => {
  try {
    const { message, conversationId, productContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    let activeConvId = conversationId;
    if (!activeConvId) {
      activeConvId = `conv-${Date.now()}`;
      db.prepare(`
        INSERT INTO chat_conversations (id, user_id, title, product_context_json)
        VALUES (?, ?, ?, ?)
      `).run(activeConvId, 'usr-afnan-001', message.slice(0, 45) + '...', JSON.stringify(productContext || {}));
    }

    const aiResult = await processChatMessage('usr-afnan-001', activeConvId, message, productContext);
    return res.json(aiResult);
  } catch (error: any) {
    console.error('[API/CHAT] Error processing chat message:', error);
    return res.status(500).json({ error: 'Failed to process AI response', details: error.message });
  }
});

export default router;
