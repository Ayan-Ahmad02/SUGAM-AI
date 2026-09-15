import { Router } from 'express';
import { verifyBisMark } from '../services/verificationService';
import { db } from '../db';

const router = Router();

// Verify BIS Mark via OCR / text input
router.post('/mark', (req, res) => {
  const { licenceNumber, isCode, rawText } = req.body;
  const result = verifyBisMark({ licenceNumber, isCode, rawText });

  // Record audit log
  db.prepare(`
    INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    `aud-${Date.now()}`,
    'Afnan Ahmad',
    'VERIFY_MARK',
    'Licence',
    result.licenceNumber,
    `Verified BIS Mark: Status ${result.status}, Risk ${result.riskLevel}`
  );

  return res.json(result);
});

// Verify QR Code
router.post('/qr', (req, res) => {
  const { qrPayload } = req.body;
  if (!qrPayload) {
    return res.status(400).json({ error: 'QR code payload is required' });
  }

  const result = verifyBisMark({ qrPayload });
  return res.json(result);
});

// Direct Licence lookup
router.get('/licence/:licenceNumber', (req, res) => {
  const { licenceNumber } = req.params;
  const result = verifyBisMark({ licenceNumber });
  return res.json(result);
});

export default router;
