import { Router } from 'express';
import { db } from '../db';
import { getStandardDetails } from '../services/knowledgeSearchService';

const router = Router();

// Get current compliance plan and 10-step wizard
router.get('/', (_req, res) => {
  const plan = db.prepare(`
    SELECT cp.*, s.is_code, s.title as standard_title, s.category, s.timeline_days, s.estimated_cost_inr
    FROM compliance_plans cp
    JOIN standards s ON cp.standard_id = s.id
    ORDER BY cp.updated_at DESC LIMIT 1
  `).get() as any;

  if (!plan) {
    return res.status(404).json({ error: 'No active compliance plan found' });
  }

  const steps = db.prepare('SELECT * FROM compliance_step_items WHERE plan_id = ? ORDER BY step_number ASC').all(plan.id);

  return res.json({
    plan: {
      id: plan.id,
      product_name: plan.product_name,
      is_code: plan.is_code,
      standard_title: plan.standard_title,
      category: plan.category,
      current_step: plan.current_step,
      overall_progress_pct: plan.overall_progress_pct,
      timeline_days: plan.timeline_days,
      estimated_cost_inr: plan.estimated_cost_inr,
      steps
    }
  });
});

// Update compliance step status
router.patch('/plans/:id/steps/:stepNumber', (req, res) => {
  const { id, stepNumber } = req.params;
  const { status, notes } = req.body; // status: 'completed', 'current', 'pending', 'blocked'

  db.prepare(`
    UPDATE compliance_step_items 
    SET status = ?, notes = COALESCE(?, notes)
    WHERE plan_id = ? AND step_number = ?
  `).run(status, notes, id, stepNumber);

  // Recalculate progress
  const steps = db.prepare('SELECT status FROM compliance_step_items WHERE plan_id = ?').all(id) as any[];
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPct = Math.min(100, Math.round((completedCount / steps.length) * 100));

  db.prepare(`
    UPDATE compliance_plans 
    SET overall_progress_pct = ?, current_step = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(progressPct, parseInt(stepNumber, 10), id);

  // Record audit log
  db.prepare(`
    INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    `aud-${Date.now()}`,
    'Afnan Ahmad',
    'UPDATE_STEP',
    'CompliancePlan',
    id,
    `Updated Step ${stepNumber} to ${status}`
  );

  return res.json({ success: true, progressPct });
});

// Create new compliance plan
router.post('/plans', (req, res) => {
  const { productName, standardId } = req.body;
  const id = `plan-${Date.now()}`;
  const std = getStandardDetails(standardId || 'std-is-17526');

  db.prepare(`
    INSERT INTO compliance_plans (id, user_id, product_name, standard_id, current_step, overall_progress_pct)
    VALUES (?, ?, ?, ?, 1, 10)
  `).run(id, 'usr-afnan-001', productName || 'New Product Profile', std.id);

  const defaultSteps = [
    'Product Profile & Specifications',
    `Applicable Standard Identification (${std.is_code})`,
    'Certification Scheme Determination (Scheme-I)',
    `Mandatory Laboratory Testing (${std.tests.length} tests)`,
    `Statutory Documentation (${std.documents.length} dossiers)`,
    'Recognized Laboratory Selection',
    'Online Form V Application Filing',
    'Factory Audit & Inspection Coordination',
    'Sealed Sample Verification & Testing',
    'Grant of Licence (CM/L Number) & ISI Mark'
  ];

  const insertStep = db.prepare(`
    INSERT INTO compliance_step_items (id, plan_id, step_number, step_title, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  defaultSteps.forEach((title, idx) => {
    insertStep.run(
      `stp-${Date.now()}-${idx}`,
      id,
      idx + 1,
      title,
      idx === 0 ? 'completed' : (idx === 1 ? 'current' : 'pending'),
      ''
    );
  });

  return res.status(201).json({ id, success: true });
});

// Cost and timeline estimate planner
router.get('/planner', (_req, res) => {
  return res.json({
    product: 'Stainless Steel Water Bottle (750ml Vacuum Insulated)',
    standard: 'IS 17526:2021',
    timeline: {
      testing_duration_days: 18,
      documentation_duration_days: 12,
      application_review_days: 15,
      inspection_and_grant_days: 15,
      total_estimated_duration_days: 60
    },
    costs: {
      laboratory_testing_estimate_inr: 45000,
      bis_application_fee_inr: 1000,
      inspection_charges_inr: 7000,
      annual_licence_and_marking_fee_inr: 19000,
      total_estimated_cost_inr: 72000
    },
    msme_benefit: '50% concession on BIS application and annual licence fee for registered Udyam MSMEs.',
    disclaimer: 'Estimated / demo values — not an official BIS quotation. Actual fees governed by official BIS schedule.'
  });
});

export default router;
