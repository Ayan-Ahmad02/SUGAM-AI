import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { initDatabase } from './db';
import { seedDatabase } from './db/seed';

import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import chatRoutes from './routes/chatRoutes';
import standardsRoutes from './routes/standardsRoutes';
import productRoutes from './routes/productRoutes';
import complianceRoutes from './routes/complianceRoutes';
import documentRoutes from './routes/documentRoutes';
import ocrRoutes from './routes/ocrRoutes';
import verificationRoutes from './routes/verificationRoutes';
import claimRoutes from './routes/claimRoutes';
import labRoutes from './routes/labRoutes';
import officeRoutes from './routes/officeRoutes';
import alertRoutes from './routes/alertRoutes';
import savedRoutes from './routes/savedRoutes';
import complaintRoutes from './routes/complaintRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize and seed SQLite database
initDatabase();
seedDatabase();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

// Health Check
app.get('/api/health', (_req, res) => {
  return res.json({
    status: 'ok',
    app: 'SUGAM-AI',
    tagline: 'BIS Compliance Intelligence Assistant',
    version: '1.0.0',
    mode: process.env.GEMINI_API_KEY ? 'Real AI (Gemini)' : 'Local Knowledge & Rules Engine',
    timestamp: new Date().toISOString()
  });
});

// App configuration info
app.get('/api/config', (_req, res) => {
  return res.json({
    appName: 'SUGAM-AI',
    hasRealAiKey: Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY),
    googleAuthAvailable: Boolean(process.env.GOOGLE_CLIENT_ID),
    version: '1.0.0'
  });
});

// Register Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/standards', standardsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/offices', officeRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

export default app;

// Vercel imports the app as a serverless handler; local development still
// starts the Express listener through `npm run server`.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SUGAM-AI Express Server active on http://localhost:${PORT}`);
    console.log(`REST API endpoints mounted under /api/*`);
  });
}
