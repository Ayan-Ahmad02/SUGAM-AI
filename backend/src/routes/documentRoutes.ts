import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../db';
import { parseOcrText } from '../services/ocrService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Get all uploaded documents and checklist
router.get('/', (_req, res) => {
  const docs = db.prepare('SELECT * FROM documents ORDER BY uploaded_at DESC').all();

  const formattedDocs = docs.map((d: any) => ({
    id: d.id,
    filename: d.filename,
    file_type: d.file_type,
    file_size: d.file_size,
    status: d.status,
    extracted_fields: JSON.parse(d.extracted_fields_json || '{}'),
    uploaded_at: d.uploaded_at
  }));

  // Checklist items based on standard requirements
  const checklist = [
    {
      id: 'chk-1',
      title: 'Raw Material Mill Test Certificate (SS 304/316)',
      status: 'RECEIVED',
      mandatory: true,
      reason: 'Mill test certificate verified with 18.4% Chromium, 8.2% Nickel.'
    },
    {
      id: 'chk-2',
      title: 'Factory Layout & Machinery List',
      status: 'RECEIVED',
      mandatory: true,
      reason: 'Vacuum furnace and hydro-forming press machines documented.'
    },
    {
      id: 'chk-3',
      title: 'Scheme of Inspection & Testing (SIT)',
      status: 'RECEIVED',
      mandatory: true,
      reason: 'Quality assurance routine sampling protocol matches BIS guidelines.'
    },
    {
      id: 'chk-4',
      title: 'Product Label Artwork with ISI Marking',
      status: 'NEEDS_REVIEW',
      mandatory: true,
      reason: 'Artwork font size of CM/L licence number must be at least 2.5 mm.'
    },
    {
      id: 'chk-5',
      title: 'Calibration Certificates for Gauges & Thermocouples',
      status: 'PENDING',
      mandatory: true,
      reason: 'NABL calibration certificate expires within 30 days. Renewal needed.'
    },
    {
      id: 'chk-6',
      title: 'MSME Udyam Registration Certificate',
      status: 'RECEIVED',
      mandatory: false,
      reason: 'Eligible for 50% marking fee concession.'
    }
  ];

  return res.json({
    documents: formattedDocs,
    checklist
  });
});

// Upload document
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { filename, originalname, mimetype, size } = req.file;
  const docId = `doc-${Date.now()}`;

  // Run mock/pre-analysis
  const simulatedText = `IS 17526:2021 Stainless Steel Water Bottle Specification CM/L-71020123 AquaSafe Steelware`;
  const parsed = parseOcrText(simulatedText);

  db.prepare(`
    INSERT INTO documents (id, user_id, filename, file_type, file_size, status, extracted_fields_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    docId,
    'usr-afnan-001',
    originalname || filename,
    mimetype,
    size,
    'analyzed',
    JSON.stringify(parsed)
  );

  return res.status(201).json({
    id: docId,
    filename: originalname || filename,
    file_type: mimetype,
    file_size: size,
    status: 'analyzed',
    extracted_fields: parsed
  });
});

// Delete document
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM documents WHERE id = ?').run(id);
  return res.json({ success: true });
});

export default router;
