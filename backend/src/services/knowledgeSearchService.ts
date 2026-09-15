import { db } from '../db';

export interface MatchedStandardResult {
  standard: any;
  confidence: number;
  matchReason: string;
  keyRequirements: string[];
  clauses: any[];
  tests: any[];
  documents: any[];
}

export function searchStandards(query: string, filters?: { category?: string; status?: string; mandatory?: number }) {
  let sql = `SELECT * FROM standards WHERE 1=1`;
  const params: any[] = [];

  if (query && query.trim() !== '') {
    const q = `%${query.trim()}%`;
    sql += ` AND (is_code LIKE ? OR title LIKE ? OR category LIKE ? OR industry LIKE ? OR scope LIKE ? OR applicability LIKE ?)`;
    params.push(q, q, q, q, q, q);
  }

  if (filters?.category && filters.category !== 'All' && filters.category !== 'All Categories') {
    sql += ` AND category = ?`;
    params.push(filters.category);
  }

  if (filters?.status && filters.status !== 'All' && filters.status !== 'Active') {
    sql += ` AND status = ?`;
    params.push(filters.status);
  }

  if (filters?.mandatory !== undefined && filters.mandatory !== -1) {
    sql += ` AND mandatory = ?`;
    params.push(filters.mandatory);
  }

  sql += ` ORDER BY mandatory DESC, revision_year DESC`;

  const standards = db.prepare(sql).all(...params);
  return standards;
}

export function getStandardDetails(idOrCode: string) {
  const std = db.prepare(`SELECT * FROM standards WHERE id = ? OR is_code = ?`).get(idOrCode, idOrCode) as any;
  if (!std) return null;

  const clauses = db.prepare(`SELECT * FROM standard_clauses WHERE standard_id = ? ORDER BY clause_number ASC`).all(std.id);
  const tests = db.prepare(`SELECT * FROM standard_tests WHERE standard_id = ? ORDER BY estimated_cost_inr DESC`).all(std.id);
  const documents = db.prepare(`SELECT * FROM standard_documents WHERE standard_id = ? ORDER BY mandatory DESC`).all(std.id);

  return {
    ...std,
    clauses,
    tests,
    documents
  };
}

export function matchProductToStandard(productData: {
  productName?: string;
  category?: string;
  material?: string;
  intendedUse?: string;
  capacity?: string;
  voltage?: string;
  isDomestic?: boolean;
}): MatchedStandardResult | null {
  const name = (productData.productName || '').toLowerCase();
  const material = (productData.material || '').toLowerCase();
  const cat = (productData.category || '').toLowerCase();
  const use = (productData.intendedUse || '').toLowerCase();

  let targetCode = 'IS 17526:2021';
  let confidence = 0.92;
  let matchReason = 'Your product falls under stainless steel food-grade containers used for potable water and beverage storage.';

  if (name.includes('bottle') || name.includes('flask') || material.includes('steel') || name.includes('thermos')) {
    targetCode = 'IS 17526:2021';
    confidence = 0.92;
    matchReason = 'Your product falls under stainless steel food grade containers used for potable water, which is covered under IS 17526:2021.';
  } else if (name.includes('microwave') || name.includes('oven') || cat.includes('appliance')) {
    targetCode = 'IS 302-2-25:2014';
    confidence = 0.95;
    matchReason = 'Applies specifically to electrical heating and microwave radiation safety for countertop and built-in cooking appliances.';
  } else if (name.includes('cable') || name.includes('wire') || material.includes('pvc')) {
    targetCode = 'IS 694:2010';
    confidence = 0.90;
    matchReason = 'Governs PVC insulated single and multi-core conductors for building wiring and working voltages up to 1100V.';
  } else if (name.includes('water') && (cat.includes('beverage') || use.includes('drink') || name.includes('packaged'))) {
    targetCode = 'IS 14543:2016';
    confidence = 0.94;
    matchReason = 'Packaged drinking water for commercial packaging and human consumption requires mandatory ISI certification.';
  } else if (name.includes('helmet') || cat.includes('safety') || cat.includes('auto')) {
    targetCode = 'IS 4151:2015';
    confidence = 0.96;
    matchReason = 'Mandatory Quality Control Order requires all two-wheeler protective helmets to comply with IS 4151:2015.';
  } else if (name.includes('meter') || name.includes('energy')) {
    targetCode = 'IS 14697:2017';
    confidence = 0.88;
    matchReason = 'Static transformer operated energy meters for commercial and substation distribution grids.';
  } else if (name.includes('charger') || name.includes('ev')) {
    targetCode = 'IS 17017:2018';
    confidence = 0.91;
    matchReason = 'Mandatory general safety and conductive connection protocol for electric vehicle charging equipment in India.';
  } else if (name.includes('battery') || name.includes('cell') || material.includes('lithium')) {
    targetCode = 'IS 16046 (Part 2):2018';
    confidence = 0.93;
    matchReason = 'Covers secondary lithium-ion cells and battery packs under the Compulsory Registration Scheme (CRS).';
  }

  const details = getStandardDetails(targetCode);
  if (!details) return null;

  return {
    standard: details,
    confidence,
    matchReason,
    keyRequirements: details.clauses.map((c: any) => `${c.title} (${c.clause_number})`),
    clauses: details.clauses,
    tests: details.tests,
    documents: details.documents
  };
}
