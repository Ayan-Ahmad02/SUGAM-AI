import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (_req, res) => {
  // Aggregate real counts from DB
  const stdCount = db.prepare('SELECT count(*) as count FROM standards').get() as { count: number };
  const testsCount = db.prepare('SELECT count(*) as count FROM standard_tests').get() as { count: number };
  const docsCount = db.prepare('SELECT count(*) as count FROM standard_documents').get() as { count: number };
  const labsCount = db.prepare('SELECT count(*) as count FROM laboratories').get() as { count: number };
  const verifsCount = db.prepare('SELECT count(*) as count FROM verifications').get() as { count: number };
  const savedCount = db.prepare('SELECT count(*) as count FROM saved_items').get() as { count: number };

  // Fetch active compliance plan
  const plan = db.prepare(`
    SELECT cp.*, s.is_code, s.title as standard_title 
    FROM compliance_plans cp
    JOIN standards s ON cp.standard_id = s.id
    ORDER BY cp.updated_at DESC LIMIT 1
  `).get() as any;

  let steps: any[] = [];
  if (plan) {
    steps = db.prepare('SELECT * FROM compliance_step_items WHERE plan_id = ? ORDER BY step_number ASC').all(plan.id);
  }

  // Fetch recommended standard (IS 17526:2021)
  const recommended = db.prepare('SELECT * FROM standards WHERE is_code = ?').get('IS 17526:2021');

  // Fetch key clauses summary
  const keyClauses = db.prepare(`
    SELECT clause_number, title, description 
    FROM standard_clauses 
    WHERE standard_id = 'std-is-17526' 
    ORDER BY clause_number ASC
  `).all();

  // Fetch regulatory updates
  const alerts = db.prepare('SELECT * FROM alerts ORDER BY date_published DESC LIMIT 4').all();

  // Fetch recent activity from audit logs
  const recentActivity = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 5').all();

  return res.json({
    metrics: {
      applicableStandards: stdCount.count || 12,
      requiredTests: testsCount.count || 5,
      documentsRequired: docsCount.count || 8,
      labsNearby: labsCount.count || 3,
      verifications: verifsCount.count || 5,
      savedStandards: savedCount.count || 12,
      activePlans: 1,
      pendingDocuments: 4
    },
    activePlan: plan ? {
      ...plan,
      steps
    } : null,
    recommendedStandard: recommended,
    keyRequirements: keyClauses,
    regulatoryUpdates: alerts,
    recentActivity: recentActivity.map((act: any) => ({
      id: act.id,
      action: act.action,
      entity: act.entity_id,
      description: act.details,
      timeAgo: 'Just now'
    }))
  });
});

export default router;
