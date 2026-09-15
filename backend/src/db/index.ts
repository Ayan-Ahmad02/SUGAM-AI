import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'sugam.db');
export const db = new Database(dbPath);

// Enable WAL mode and foreign keys for high performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  console.log(`[DB] Initializing SQLite database at ${dbPath}`);

  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Manufacturer',
      company TEXT DEFAULT 'Hindustan Quality Products Ltd',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Standards master table
    CREATE TABLE IF NOT EXISTS standards (
      id TEXT PRIMARY KEY,
      is_code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      industry TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      mandatory INTEGER NOT NULL DEFAULT 1,
      revision_year INTEGER NOT NULL,
      scope TEXT NOT NULL,
      applicability TEXT NOT NULL,
      timeline_days INTEGER NOT NULL DEFAULT 45,
      estimated_cost_inr INTEGER NOT NULL DEFAULT 75000,
      source_url TEXT DEFAULT 'https://www.services.bis.gov.in',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Standard Clauses
    CREATE TABLE IF NOT EXISTS standard_clauses (
      id TEXT PRIMARY KEY,
      standard_id TEXT NOT NULL,
      clause_number TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      mandatory INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (standard_id) REFERENCES standards(id) ON DELETE CASCADE
    );

    -- Standard Tests
    CREATE TABLE IF NOT EXISTS standard_tests (
      id TEXT PRIMARY KEY,
      standard_id TEXT NOT NULL,
      test_name TEXT NOT NULL,
      clause_ref TEXT NOT NULL,
      sampling_size TEXT DEFAULT '3 units',
      duration_days INTEGER DEFAULT 7,
      estimated_cost_inr INTEGER DEFAULT 12000,
      FOREIGN KEY (standard_id) REFERENCES standards(id) ON DELETE CASCADE
    );

    -- Standard Documents
    CREATE TABLE IF NOT EXISTS standard_documents (
      id TEXT PRIMARY KEY,
      standard_id TEXT NOT NULL,
      document_name TEXT NOT NULL,
      document_type TEXT NOT NULL,
      mandatory INTEGER DEFAULT 1,
      description TEXT,
      FOREIGN KEY (standard_id) REFERENCES standards(id) ON DELETE CASCADE
    );

    -- Compliance Plans
    CREATE TABLE IF NOT EXISTS compliance_plans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      standard_id TEXT NOT NULL,
      current_step INTEGER NOT NULL DEFAULT 3,
      overall_progress_pct INTEGER NOT NULL DEFAULT 40,
      status TEXT NOT NULL DEFAULT 'Active',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (standard_id) REFERENCES standards(id) ON DELETE CASCADE
    );

    -- Compliance Step Items
    CREATE TABLE IF NOT EXISTS compliance_step_items (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      step_title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- 'completed', 'current', 'pending', 'blocked'
      notes TEXT,
      FOREIGN KEY (plan_id) REFERENCES compliance_plans(id) ON DELETE CASCADE
    );

    -- Uploaded Documents & Verification Checklist
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- 'analyzed', 'pending', 'needs_review', 'missing'
      extracted_fields_json TEXT DEFAULT '{}',
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- BIS / ISI Mark Verifications
    CREATE TABLE IF NOT EXISTS verifications (
      id TEXT PRIMARY KEY,
      licence_number TEXT NOT NULL,
      is_code TEXT NOT NULL,
      product_name TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      status TEXT NOT NULL, -- 'VERIFIED', 'WARNING', 'SUSPICIOUS', 'UNABLE_TO_VERIFY'
      risk_level TEXT NOT NULL, -- 'Low', 'Medium', 'High'
      evidence_json TEXT NOT NULL DEFAULT '[]',
      valid_till TEXT,
      factory_location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Product Claim Checks
    CREATE TABLE IF NOT EXISTS claim_checks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      input_text TEXT NOT NULL,
      claimed_mark TEXT,
      extracted_claims_json TEXT NOT NULL DEFAULT '[]',
      verification_status TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      evidence_json TEXT NOT NULL DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Laboratories
    CREATE TABLE IF NOT EXISTS laboratories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      recognition_status TEXT NOT NULL DEFAULT 'Recognized',
      supported_standards_json TEXT NOT NULL DEFAULT '[]',
      capabilities_json TEXT NOT NULL DEFAULT '[]',
      address TEXT NOT NULL,
      contact_phone TEXT,
      contact_email TEXT,
      shortlisted INTEGER DEFAULT 0
    );

    -- BIS Offices
    CREATE TABLE IF NOT EXISTS offices (
      id TEXT PRIMARY KEY,
      office_name TEXT NOT NULL,
      region TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      working_hours TEXT DEFAULT '9:00 AM - 5:30 PM (Mon-Fri)',
      services_json TEXT NOT NULL DEFAULT '[]',
      coordinates_json TEXT NOT NULL DEFAULT '{"lat":28.6139,"lng":77.2090}'
    );

    -- Regulatory Alerts & Updates
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- 'QCO', 'Amendment', 'Draft', 'Deadline', 'Lab'
      description TEXT NOT NULL,
      is_code_ref TEXT,
      priority TEXT NOT NULL DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
      date_published TEXT NOT NULL,
      is_read INTEGER DEFAULT 0
    );

    -- Saved Workspace Items
    CREATE TABLE IF NOT EXISTS saved_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_type TEXT NOT NULL, -- 'standard', 'comparison', 'product', 'conversation', 'plan'
      item_id TEXT NOT NULL,
      title TEXT NOT NULL,
      metadata_json TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Complaints & Support
    CREATE TABLE IF NOT EXISTS complaints (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL,
      subject TEXT NOT NULL,
      product_name TEXT,
      description TEXT NOT NULL,
      evidence_filename TEXT,
      status TEXT NOT NULL DEFAULT 'Submitted', -- 'Submitted', 'Under Review', 'Resolved'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Chat Conversations
    CREATE TABLE IF NOT EXISTS chat_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      product_context_json TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Chat Messages
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender TEXT NOT NULL, -- 'user' or 'assistant'
      content TEXT NOT NULL,
      structured_data_json TEXT DEFAULT '{}',
      confidence_score REAL DEFAULT 0.90,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
    );

    -- Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('[DB] Database tables verified successfully.');
}
