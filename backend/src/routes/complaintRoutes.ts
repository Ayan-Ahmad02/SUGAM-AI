import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Frequently Asked Questions
const faqs = [
  {
    question: 'How do I find the applicable BIS standard for my product?',
    answer: 'Use the "Find Standards" or "AI Assistant" module in SUGAM-AI. Simply describe your product (material, application, voltage/capacity), and our semantic engine will retrieve the exact IS code, relevant clauses, and certification scheme.'
  },
  {
    question: 'What are the essential documents needed for an ISI mark licence?',
    answer: 'Key documents include: 1) Factory layout plan and machinery inventory, 2) Raw material mill test certificates (e.g. SS 304 for flasks), 3) Scheme of Inspection and Testing (SIT), 4) Calibration certificates for gauges/meters, 5) MSME Udyam registration (for 50% concession), and 6) Product label artwork.'
  },
  {
    question: 'How can I verify if an ISI mark on a market product is genuine?',
    answer: 'Use the "BIS Verification" module. Upload a photo or scan the QR code printed near the ISI logo. Check that the 7 or 8 digit CM/L licence number or R-number matches the official manufacturer in the BIS database.'
  },
  {
    question: 'What is a Quality Control Order (QCO)?',
    answer: 'A QCO is an official gazette notification issued by the Government of India (e.g. Ministry of Commerce & Industry) making compliance with specific Indian Standards mandatory. Once a QCO is effective, non-compliant products cannot be manufactured, imported, or sold in India.'
  },
  {
    question: 'Are MSMEs entitled to concessions under BIS schemes?',
    answer: 'Yes, micro and small enterprises registered under Udyam receive up to 50% concession on application and annual minimum marking fees.'
  }
];

// Get complaints and FAQs
router.get('/', (_req, res) => {
  const complaints = db.prepare('SELECT * FROM complaints ORDER BY created_at DESC').all();
  return res.json({
    complaints,
    faqs
  });
});

// Submit a new complaint
router.post('/', (req, res) => {
  const { category, subject, productName, description, contactInfo } = req.body;

  if (!category || !subject || !description) {
    return res.status(400).json({ error: 'Category, subject, and description are required' });
  }

  const id = `cmp-${Date.now()}`;
  db.prepare(`
    INSERT INTO complaints (id, user_id, category, subject, product_name, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    'usr-afnan-001',
    category,
    subject,
    productName || 'Unspecified Product',
    `${description} (Contact: ${contactInfo || 'N/A'})`,
    'Submitted'
  );

  return res.status(201).json({
    id,
    status: 'Submitted',
    message: 'Your complaint/inquiry has been registered. Reference ID: ' + id
  });
});

export default router;
