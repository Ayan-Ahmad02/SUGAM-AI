import { db } from './index';

export function seedDatabase() {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    console.log('[DB] Database already contains seed data.');
    return;
  }

  console.log('[DB] Seeding database with realistic demonstration BIS compliance data...');

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, company)
    VALUES (@id, @name, @email, @password_hash, @role, @company)
  `);

  // 1. Seed Users (Demo Manufacturer & Demo Admin)
  insertUser.run({
    id: 'usr-afnan-001',
    name: 'Afnan Ahmad',
    email: 'demo@sugam.ai',
    password_hash: 'password123', // Demo plain/simple hash
    role: 'Manufacturer',
    company: 'Bharat EcoWare Solutions Pvt. Ltd.'
  });

  insertUser.run({
    id: 'usr-admin-001',
    name: 'Dr. R. K. Sharma',
    email: 'admin@sugam.ai',
    password_hash: 'admin123',
    role: 'Admin',
    company: 'SUGAM Compliance Directorate'
  });

  // 2. Seed Standards
  const insertStd = db.prepare(`
    INSERT INTO standards (id, is_code, title, category, industry, status, mandatory, revision_year, scope, applicability, timeline_days, estimated_cost_inr, source_url)
    VALUES (@id, @is_code, @title, @category, @industry, @status, @mandatory, @revision_year, @scope, @applicability, @timeline_days, @estimated_cost_inr, @source_url)
  `);

  const standardsData = [
    {
      id: 'std-is-17526',
      is_code: 'IS 17526:2021',
      title: 'Stainless Steel Vacuum Insulated Flasks and Bottles — Specification',
      category: 'Food & Beverages',
      industry: 'Consumer Goods / Kitchenware',
      status: 'Active',
      mandatory: 1,
      revision_year: 2021,
      scope: 'Covers stainless steel vacuum insulated flasks and bottles used for storing and transporting potable water and beverages.',
      applicability: 'Domestic and commercial use containers with capacity from 200 ml up to 2000 ml.',
      timeline_days: 45,
      estimated_cost_inr: 72000,
      source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/17526'
    },
    {
      id: 'std-is-302-2-25',
      is_code: 'IS 302-2-25:2014',
      title: 'Safety of Household and Similar Electrical Appliances — Particular Requirements for Microwave Ovens',
      category: 'Electrical & Electronics',
      industry: 'Household Appliances',
      status: 'Active',
      mandatory: 1,
      revision_year: 2014,
      scope: 'Deals with the safety of microwave ovens for household and commercial catering use with rated voltage up to 250V.',
      applicability: 'All countertop and built-in microwave and convection heating ovens.',
      timeline_days: 60,
      estimated_cost_inr: 95000,
      source_url: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/302-2-25'
    },
    {
      id: 'std-is-694',
      is_code: 'IS 694:2010',
      title: 'Polyvinyl Chloride (PVC) Insulated Cables for Working Voltages up to and Including 1100 V',
      category: 'Electrical & Cables',
      industry: 'Power Transmission & Wiring',
      status: 'Active',
      mandatory: 1,
      revision_year: 2010,
      scope: 'Requirements for single and multicore PVC insulated unsheathed and sheathed cables for electric power and lighting.',
      applicability: 'Industrial wiring, domestic building wiring, electrical panel connections.',
      timeline_days: 40,
      estimated_cost_inr: 58000,
      source_url: 'https://www.services.bis.gov.in'
    },
    {
      id: 'std-is-14697',
      is_code: 'IS 14697:2017',
      title: 'AC Static Transformer Operated Watthour and VAR-Hour Meters — Specification',
      category: 'Energy & Power Equipment',
      industry: 'Power Distribution',
      status: 'Active',
      mandatory: 0,
      revision_year: 2017,
      scope: 'Specifies requirements and tests for static electrical meters for CT and PT operated metering.',
      applicability: 'Electricity transmission substations, industrial energy monitoring panels.',
      timeline_days: 50,
      estimated_cost_inr: 88000,
      source_url: 'https://www.services.bis.gov.in'
    },
    {
      id: 'std-is-14543',
      is_code: 'IS 14543:2016',
      title: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water) — Specification',
      category: 'Food & Beverages',
      industry: 'Packaged Beverages',
      status: 'Active',
      mandatory: 1,
      revision_year: 2016,
      scope: 'Prescribes requirements and methods of sampling and test for packaged drinking water filled in sealed containers.',
      applicability: 'Bottled water manufacturers, 20-litre jar plants, pouch packaging units.',
      timeline_days: 60,
      estimated_cost_inr: 110000,
      source_url: 'https://www.services.bis.gov.in'
    },
    {
      id: 'std-is-4151',
      is_code: 'IS 4151:2015',
      title: 'Protective Helmets for Two Wheeler Riders — Specification',
      category: 'Automotive & Safety',
      industry: 'Personal Protective Equipment',
      status: 'Active',
      mandatory: 1,
      revision_year: 2015,
      scope: 'Covers the requirements regarding materials, construction, finish, and test methods for protective helmets.',
      applicability: 'Full face, open face, and flip-up crash helmets for riders.',
      timeline_days: 50,
      estimated_cost_inr: 85000,
      source_url: 'https://www.services.bis.gov.in'
    },
    {
      id: 'std-is-17017',
      is_code: 'IS 17017:2018',
      title: 'Electric Vehicle Conductive Charging System — General Requirements',
      category: 'E-Mobility & Automotive',
      industry: 'Electric Vehicles Infrastructure',
      status: 'Active',
      mandatory: 1,
      revision_year: 2018,
      scope: 'Applies to EV supply equipment for charging electric road vehicles at standard AC and DC voltages.',
      applicability: 'AC Slow chargers (Type 2 / Bharat AC001) and DC Fast chargers (CCS2 / CHAdeMO).',
      timeline_days: 65,
      estimated_cost_inr: 135000,
      source_url: 'https://www.services.bis.gov.in'
    },
    {
      id: 'std-is-16046',
      is_code: 'IS 16046 (Part 2):2018',
      title: 'Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes (Lithium-ion Cells)',
      category: 'Electrical & Electronics',
      industry: 'Consumer Electronics & Energy',
      status: 'Active',
      mandatory: 1,
      revision_year: 2018,
      scope: 'Safety requirements for portable sealed secondary lithium cells and batteries for use in portable applications.',
      applicability: 'Smartphone batteries, power banks, laptop battery packs, portable instruments.',
      timeline_days: 45,
      estimated_cost_inr: 92000,
      source_url: 'https://www.services.bis.gov.in'
    }
  ];

  for (const std of standardsData) {
    insertStd.run(std);
  }

  // 3. Seed Clauses for IS 17526:2021
  const insertClause = db.prepare(`
    INSERT INTO standard_clauses (id, standard_id, clause_number, title, description, mandatory)
    VALUES (@id, @standard_id, @clause_number, @title, @description, @mandatory)
  `);

  const is17526Clauses = [
    {
      id: 'cl-17526-42',
      standard_id: 'std-is-17526',
      clause_number: 'Clause 4.2',
      title: 'Material Requirements',
      description: 'Inner container must be manufactured from food-grade Stainless Steel conforming to Grade SS 304 (X04Cr19Ni9) or Grade SS 316. Outer shell may be SS 201 or SS 304 with non-toxic powder coating.',
      mandatory: 1
    },
    {
      id: 'cl-17526-51',
      standard_id: 'std-is-17526',
      clause_number: 'Clause 5.1',
      title: 'Performance & Thermal Insulation',
      description: 'The hot liquid temperature after 6 hours must not drop below 70°C when initially filled at 95°C. Cold retention must keep water below 10°C after 6 hours from initial 4°C.',
      mandatory: 1
    },
    {
      id: 'cl-17526-52',
      standard_id: 'std-is-17526',
      clause_number: 'Clause 5.2',
      title: 'Leakage Resistance',
      description: 'When filled to nominal capacity, sealed with stopper, inverted and held for 10 minutes at ambient pressure, no droplet or seepage is permissible.',
      mandatory: 1
    },
    {
      id: 'cl-17526-6',
      standard_id: 'std-is-17526',
      clause_number: 'Clause 6',
      title: 'Testing Methods & Sampling',
      description: 'Specifies destructive and non-destructive protocols including hydrostatic pressure, drop impact from 1 meter height, and acid exposure corrosion tests.',
      mandatory: 1
    },
    {
      id: 'cl-17526-7',
      standard_id: 'std-is-17526',
      clause_number: 'Clause 7',
      title: 'Marking and Labelling',
      description: 'Each product must legibly mark: Manufacturer identity or trademark, capacity in millilitres, BIS Standard Mark (ISI) with CM/L number, and batch manufacturing code.',
      mandatory: 1
    },
    {
      id: 'cl-17526-8',
      standard_id: 'std-is-17526',
      clause_number: 'Clause 8',
      title: 'Packaging Requirements',
      description: 'Individual protective sleeve, corrugated unit carton, and moisture barrier desiccant pouch.',
      mandatory: 1
    }
  ];

  for (const cl of is17526Clauses) {
    insertClause.run(cl);
  }

  // 4. Seed Tests for IS 17526:2021
  const insertTest = db.prepare(`
    INSERT INTO standard_tests (id, standard_id, test_name, clause_ref, sampling_size, duration_days, estimated_cost_inr)
    VALUES (@id, @standard_id, @test_name, @clause_ref, @sampling_size, @duration_days, @estimated_cost_inr)
  `);

  const tests = [
    { id: 't-1', standard_id: 'std-is-17526', test_name: 'Thermal Retention Test (6h Hot/Cold)', clause_ref: 'Clause 5.1', sampling_size: '3 units', duration_days: 2, estimated_cost_inr: 8500 },
    { id: 't-2', standard_id: 'std-is-17526', test_name: 'Hydrostatic Leakage Test', clause_ref: 'Clause 5.2', sampling_size: '5 units', duration_days: 1, estimated_cost_inr: 6000 },
    { id: 't-3', standard_id: 'std-is-17526', test_name: 'Food Grade Material Chemical Composition (OES)', clause_ref: 'Clause 4.2', sampling_size: '2 coupons', duration_days: 3, estimated_cost_inr: 12000 },
    { id: 't-4', standard_id: 'std-is-17526', test_name: 'Salt Spray Corrosion Resistance (96 hours)', clause_ref: 'Clause 6.4', sampling_size: '3 units', duration_days: 5, estimated_cost_inr: 14500 },
    { id: 't-5', standard_id: 'std-is-17526', test_name: 'Drop Impact Durability (1.0m height)', clause_ref: 'Clause 6.2', sampling_size: '3 units', duration_days: 1, estimated_cost_inr: 5000 },
  ];

  for (const t of tests) {
    insertTest.run(t);
  }

  // 5. Seed Required Documents for IS 17526:2021
  const insertDocReq = db.prepare(`
    INSERT INTO standard_documents (id, standard_id, document_name, document_type, mandatory, description)
    VALUES (@id, @standard_id, @document_name, @document_type, @mandatory, @description)
  `);

  const docReqs = [
    { id: 'dr-1', standard_id: 'std-is-17526', document_name: 'Factory Layout & Machinery List', document_type: 'Technical', mandatory: 1, description: 'Detailed floor diagram showing vacuum sealing, furnace, polishing, and quality lab' },
    { id: 'dr-2', standard_id: 'std-is-17526', document_name: 'Raw Material Test Certificate (SS 304/316)', document_type: 'Material', mandatory: 1, description: 'Mill test certificate from certified primary steel producer verifying chemical composition' },
    { id: 'dr-3', standard_id: 'std-is-17526', document_name: 'Calibration Certificates of Testing Equipment', document_type: 'Quality', mandatory: 1, description: 'NABL accredited calibration reports for thermocouples, pressure gauges, and weighing balances' },
    { id: 'dr-4', standard_id: 'std-is-17526', document_name: 'Scheme of Inspection and Testing (SIT)', document_type: 'Quality', mandatory: 1, description: 'Agreed BIS SIT document detailing in-house routine and batch test records' },
    { id: 'dr-5', standard_id: 'std-is-17526', document_name: 'Product Label & ISI Marking Artwork', document_type: 'Artwork', mandatory: 1, description: 'Vector drawing showing CM/L number, IS code, laser etching location, and packaging dimensions' },
    { id: 'dr-6', standard_id: 'std-is-17526', document_name: 'Proof of Manufacturing Premises (Lease/Deed)', document_type: 'Legal', mandatory: 1, description: 'Registered factory ownership or long-term lease deed with electricity bill' },
    { id: 'dr-7', standard_id: 'std-is-17526', document_name: 'MSME Udyam Registration Certificate', document_type: 'Statutory', mandatory: 0, description: 'Valid Udyam certificate for 50% concession on BIS application fees' },
    { id: 'dr-8', standard_id: 'std-is-17526', document_name: 'In-house Test Personnel Qualifications', document_type: 'HR', mandatory: 1, description: 'Degrees and training certificates of QC chemist and mechanical inspection engineers' }
  ];

  for (const dr of docReqs) {
    insertDocReq.run(dr);
  }

  // 6. Seed Compliance Plan for Afnan (Stainless Steel Water Bottle)
  const insertPlan = db.prepare(`
    INSERT INTO compliance_plans (id, user_id, product_name, standard_id, current_step, overall_progress_pct, status)
    VALUES (@id, @user_id, @product_name, @standard_id, @current_step, @overall_progress_pct, @status)
  `);

  insertPlan.run({
    id: 'plan-ss-bottle-001',
    user_id: 'usr-afnan-001',
    product_name: 'Stainless Steel Water Bottle (750ml Vacuum Insulated)',
    standard_id: 'std-is-17526',
    current_step: 3,
    overall_progress_pct: 40,
    status: 'Active'
  });

  const insertStep = db.prepare(`
    INSERT INTO compliance_step_items (id, plan_id, step_number, step_title, status, notes)
    VALUES (@id, @plan_id, @step_number, @step_title, @status, @notes)
  `);

  const steps = [
    { id: 'stp-1', plan_id: 'plan-ss-bottle-001', step_number: 1, step_title: 'Standard Identified (IS 17526:2021)', status: 'completed', notes: 'Product matched with 92% confidence against QCO order' },
    { id: 'stp-2', plan_id: 'plan-ss-bottle-001', step_number: 2, step_title: 'Tests Mapped (5 Required Tests)', status: 'completed', notes: 'Thermal, Leakage, Metallurgy, Salt Spray, Impact tests verified' },
    { id: 'stp-3', plan_id: 'plan-ss-bottle-001', step_number: 3, step_title: 'Documents Preparation (Checklist Active)', status: 'current', notes: '6 of 8 required documents uploaded and verified' },
    { id: 'stp-4', plan_id: 'plan-ss-bottle-001', step_number: 4, step_title: 'Laboratory Selection (Nearby BIS Labs)', status: 'pending', notes: 'Shortlisted National Test House, Ghaziabad' },
    { id: 'stp-5', plan_id: 'plan-ss-bottle-001', step_number: 5, step_title: 'Application & Certification Submission', status: 'pending', notes: 'Form V online filing on ManakOnline portal' },
    { id: 'stp-6', plan_id: 'plan-ss-bottle-001', step_number: 6, step_title: 'Factory Inspection & Audit', status: 'pending', notes: 'BIS inspecting officer physical audit of production facility' },
    { id: 'stp-7', plan_id: 'plan-ss-bottle-001', step_number: 7, step_title: 'Independent Sample Verification', status: 'pending', notes: 'Sealing of random production samples for referral testing' },
    { id: 'stp-8', plan_id: 'plan-ss-bottle-001', step_number: 8, step_title: 'Grant of BIS Licence (CM/L Number)', status: 'pending', notes: 'Issuance of CM/L licence certificate and ISI logo rights' },
    { id: 'stp-9', plan_id: 'plan-ss-bottle-001', step_number: 9, step_title: 'Marking & Laser Etching Verification', status: 'pending', notes: 'Verification of artwork on actual mass production units' },
    { id: 'stp-10', plan_id: 'plan-ss-bottle-001', step_number: 10, step_title: 'Periodic Surveillance & Renewal Audit', status: 'pending', notes: 'Annual market surveillance and continuous compliance' }
  ];

  for (const s of steps) {
    insertStep.run(s);
  }

  // 7. Seed Uploaded Documents
  const insertDoc = db.prepare(`
    INSERT INTO documents (id, user_id, filename, file_type, file_size, status, extracted_fields_json)
    VALUES (@id, @user_id, @filename, @file_type, @file_size, @status, @extracted_fields_json)
  `);

  const docs = [
    {
      id: 'doc-1',
      user_id: 'usr-afnan-001',
      filename: 'Product_Manual_HydroPure_750.pdf',
      file_type: 'application/pdf',
      file_size: 2450000,
      status: 'analyzed',
      extracted_fields_json: JSON.stringify({ is_code: 'IS 17526:2021', product_name: 'Stainless Steel Water Bottle', material: 'SS 304 Food Grade', capacity: '750ml' })
    },
    {
      id: 'doc-2',
      user_id: 'usr-afnan-001',
      filename: 'Raw_Material_Mill_TC_Jindal_SS304.pdf',
      file_type: 'application/pdf',
      file_size: 1840000,
      status: 'analyzed',
      extracted_fields_json: JSON.stringify({ standard: 'ASTM A240 / IS 6911', chromium_pct: '18.4%', nickel_pct: '8.2%', heat_no: 'JH-88392' })
    },
    {
      id: 'doc-3',
      user_id: 'usr-afnan-001',
      filename: 'Licence_Draft_Artwork.jpg',
      file_type: 'image/jpeg',
      file_size: 1200000,
      status: 'pending',
      extracted_fields_json: JSON.stringify({ is_code: 'IS 17526:2021', draft_cml: 'CM/L-71020123' })
    }
  ];

  for (const d of docs) {
    insertDoc.run(d);
  }

  // 8. Seed Verifications (BIS & QR)
  const insertVerif = db.prepare(`
    INSERT INTO verifications (id, licence_number, is_code, product_name, manufacturer, status, risk_level, evidence_json, valid_till, factory_location)
    VALUES (@id, @licence_number, @is_code, @product_name, @manufacturer, @status, @risk_level, @evidence_json, @valid_till, @factory_location)
  `);

  const verifs = [
    {
      id: 'v-1',
      licence_number: 'CM/L-71020123',
      is_code: 'IS 17526:2021',
      product_name: 'Stainless Steel Vacuum Flask 750ml',
      manufacturer: 'AquaSafe Steelware Pvt. Ltd.',
      status: 'VERIFIED',
      risk_level: 'Low',
      evidence_json: JSON.stringify(['OCR Extracted Data matches active licence', 'Product Database Record valid', 'Standard Scope exact match']),
      valid_till: '2027-08-31',
      factory_location: 'Plot 42, Industrial Area, Baddi, HP'
    },
    {
      id: 'v-2',
      licence_number: 'R-71020123',
      is_code: 'IS 302-2-25',
      product_name: 'Microwave Convection Oven 28L',
      manufacturer: 'Surya ElectroTech Appliances Ltd.',
      status: 'VERIFIED',
      risk_level: 'Low',
      evidence_json: JSON.stringify(['BIS Electronic Register match', 'Safety test pass reports on file', 'Hologram certificate valid']),
      valid_till: '2026-12-15',
      factory_location: 'Chakan Industrial Zone, Pune, Maharashtra'
    },
    {
      id: 'v-3',
      licence_number: 'CM/L-99999999',
      is_code: 'IS 17526:2021',
      product_name: 'Unverified Water Container',
      manufacturer: 'Unknown Grey Market Entity',
      status: 'SUSPICIOUS',
      risk_level: 'High',
      evidence_json: JSON.stringify(['Licence number not found in official BIS registry', 'Hologram security pattern forged', 'Material purity not certified']),
      valid_till: 'Expired 2024-01-01',
      factory_location: 'Unregistered location'
    },
    {
      id: 'v-4',
      licence_number: 'CM/L-55443322',
      is_code: 'IS 4151:2015',
      product_name: 'Protective Two Wheeler Helmet',
      manufacturer: 'Apex Helmets India',
      status: 'WARNING',
      risk_level: 'Medium',
      evidence_json: JSON.stringify(['Licence renewal application under review', 'Audit observations pending compliance response']),
      valid_till: '2025-06-30',
      factory_location: 'Faridabad, Haryana'
    }
  ];

  for (const v of verifs) {
    insertVerif.run(v);
  }

  // 9. Seed Regulatory Alerts
  const insertAlert = db.prepare(`
    INSERT INTO alerts (id, title, category, description, is_code_ref, priority, date_published, is_read)
    VALUES (@id, @title, @category, @description, @is_code_ref, @priority, @date_published, @is_read)
  `);

  const alerts = [
    {
      id: 'alt-1',
      title: 'New QCO Notified for Stainless Steel Utensils',
      category: 'QCO',
      description: 'Ministry of Commerce & Industry notifies mandatory BIS certification under IS 17526:2021 for all insulated flasks and bottles manufactured or imported into India.',
      is_code_ref: 'IS 17526:2021',
      priority: 'High',
      date_published: '12 Sep 2025',
      is_read: 0
    },
    {
      id: 'alt-2',
      title: 'Amendment 2 Released for Electrical Appliances',
      category: 'Amendment',
      description: 'Bureau of Indian Standards issues technical amendment regarding insulation resistance tests for microwave ovens under IS 302 (Part 2/Sec 25):2024.',
      is_code_ref: 'IS 302-2-25',
      priority: 'Medium',
      date_published: '28 Aug 2025',
      is_read: 0
    },
    {
      id: 'alt-3',
      title: 'Draft Standard for Public Comments — Plastics for Food Contact',
      category: 'Draft',
      description: 'Draft revision open for public review and industry comments until 30 September 2025. MSMEs are invited to submit feedback.',
      is_code_ref: 'PCD 12 (22891)',
      priority: 'Low',
      date_published: '10 Aug 2025',
      is_read: 0
    },
    {
      id: 'alt-4',
      title: 'Document Submission Deadline Reminder',
      category: 'Deadline',
      description: 'Annual surveillance audit report submission deadline approaching for electrical wire manufacturers.',
      is_code_ref: 'IS 694:2010',
      priority: 'Medium',
      date_published: '05 Aug 2025',
      is_read: 1
    }
  ];

  for (const a of alerts) {
    insertAlert.run(a);
  }

  // 10. Seed Laboratories
  const insertLab = db.prepare(`
    INSERT INTO laboratories (id, name, city, state, recognition_status, supported_standards_json, capabilities_json, address, contact_phone, contact_email, shortlisted)
    VALUES (@id, @name, @city, @state, @recognition_status, @supported_standards_json, @capabilities_json, @address, @contact_phone, @contact_email, @shortlisted)
  `);

  const labs = [
    {
      id: 'lab-1',
      name: 'National Test House (Northern Region)',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh',
      recognition_status: 'Recognized',
      supported_standards_json: JSON.stringify(['IS 17526:2021', 'IS 302-2-25', 'IS 694:2010']),
      capabilities_json: JSON.stringify(['Thermal Insulation Testing', 'Chemical Composition OES', 'High Voltage Breakdown', 'Leakage Detection']),
      address: 'Kamla Nehru Nagar, Ghaziabad, UP 201002',
      contact_phone: '+91 120 2789823',
      contact_email: 'nth-gzb@nic.in',
      shortlisted: 1
    },
    {
      id: 'lab-2',
      name: 'Central Power Research Institute (CPRI)',
      city: 'Bengaluru',
      state: 'Karnataka',
      recognition_status: 'Recognized',
      supported_standards_json: JSON.stringify(['IS 302-2-25', 'IS 694:2010', 'IS 17017:2018', 'IS 14697:2017']),
      capabilities_json: JSON.stringify(['Short Circuit Testing', 'EV Charger Safety', 'Impulse Voltage Withstand', 'Dielectric Strength']),
      address: 'Sir C.V. Raman Road, Sadashivanagar, Bengaluru 560080',
      contact_phone: '+91 80 22072210',
      contact_email: 'cpri-blr@cpri.in',
      shortlisted: 1
    },
    {
      id: 'lab-3',
      name: 'BIS Central Laboratory',
      city: 'Sahibabad',
      state: 'Uttar Pradesh',
      recognition_status: 'Recognized',
      supported_standards_json: JSON.stringify(['IS 17526:2021', 'IS 14543:2016', 'IS 4151:2015', 'IS 9873:2019']),
      capabilities_json: JSON.stringify(['Complete ISI Mark Referral Testing', 'Food Grade Migration Tests', 'Microbiological Culture']),
      address: 'Plot 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad 201010',
      contact_phone: '+91 120 2867900',
      contact_email: 'cl-lab@bis.gov.in',
      shortlisted: 1
    },
    {
      id: 'lab-4',
      name: 'Shriram Institute for Industrial Research',
      city: 'Delhi',
      state: 'Delhi',
      recognition_status: 'Recognized',
      supported_standards_json: JSON.stringify(['IS 17526:2021', 'IS 14543:2016', 'IS 9873:2019']),
      capabilities_json: JSON.stringify(['Heavy Metal Migration ICP-MS', 'Polymer Testing', 'Gas Chromatography']),
      address: '19 University Road, Delhi 110007',
      contact_phone: '+91 11 27667267',
      contact_email: 'customercare@shriraminstitute.org',
      shortlisted: 0
    },
    {
      id: 'lab-5',
      name: 'Bharat Test House Pvt. Ltd.',
      city: 'Sonipat',
      state: 'Haryana',
      recognition_status: 'Recognized',
      supported_standards_json: JSON.stringify(['IS 16046 (Part 2):2018', 'IS 17017:2018', 'IS 302-2-25']),
      capabilities_json: JSON.stringify(['Lithium Cell Safety Testing', 'Thermal Abuse Chamber', 'EMC Testing']),
      address: 'Plot 79, Sector 56, HSIIDC Industrial Estate, Kundli, Sonipat 131028',
      contact_phone: '+91 130 2371200',
      contact_email: 'info@bharattest.com',
      shortlisted: 0
    }
  ];

  for (const l of labs) {
    insertLab.run(l);
  }

  // 11. Seed BIS Offices
  const insertOffice = db.prepare(`
    INSERT INTO offices (id, office_name, region, city, state, address, phone, email, working_hours, services_json, coordinates_json)
    VALUES (@id, @office_name, @region, @city, @state, @address, @phone, @email, @working_hours, @services_json, @coordinates_json)
  `);

  const offices = [
    {
      id: 'off-hq',
      office_name: 'BIS Headquarters (Manak Bhavan)',
      region: 'Headquarters',
      city: 'New Delhi',
      state: 'Delhi',
      address: '9 Bahadur Shah Zafar Marg, ITO, New Delhi 110002',
      phone: '+91 11 23230131',
      email: 'info@bis.gov.in',
      working_hours: '9:00 AM - 5:30 PM (Mon-Fri)',
      services_json: JSON.stringify(['Product Certification (ISI)', 'Standardization Directorate', 'Hallmarking Secretariat', 'Complaints Cell']),
      coordinates_json: JSON.stringify({ lat: 28.6289, lng: 77.2405 })
    },
    {
      id: 'off-delhi-bo',
      office_name: 'Delhi Branch Office I & II',
      region: 'Northern',
      city: 'New Delhi',
      state: 'Delhi',
      address: 'Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi 110002',
      phone: '+91 11 23237582',
      email: 'delhibo1@bis.gov.in',
      working_hours: '9:00 AM - 5:30 PM (Mon-Fri)',
      services_json: JSON.stringify(['Factory Inspections', 'Licence Grant & Renewal', 'Surveillance Sample Collection']),
      coordinates_json: JSON.stringify({ lat: 28.6300, lng: 77.2420 })
    },
    {
      id: 'off-mumbai-ro',
      office_name: 'Western Regional Office (Manakalaya)',
      region: 'Western',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Manakalaya, E-9, MIDC, Andheri (East), Mumbai 400093',
      phone: '+91 22 28329295',
      email: 'wro@bis.gov.in',
      working_hours: '9:00 AM - 5:30 PM (Mon-Fri)',
      services_json: JSON.stringify(['Product Certification', 'Management Systems Certification', 'Laboratory Services']),
      coordinates_json: JSON.stringify({ lat: 19.1197, lng: 72.8687 })
    },
    {
      id: 'off-chennai-ro',
      office_name: 'Southern Regional Office',
      region: 'Southern',
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'CIT Campus, 4th Cross Road, Taramani, Chennai 600113',
      phone: '+91 44 22541442',
      email: 'sro@bis.gov.in',
      working_hours: '9:00 AM - 5:30 PM (Mon-Fri)',
      services_json: JSON.stringify(['ISI Mark Licensing', 'Compulsory Registration Scheme (CRS)', 'Industry Outreach']),
      coordinates_json: JSON.stringify({ lat: 12.9863, lng: 80.2432 })
    },
    {
      id: 'off-kolkata-ro',
      office_name: 'Eastern Regional Office',
      region: 'Eastern',
      city: 'Kolkata',
      state: 'West Bengal',
      address: '1/14 C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata 700054',
      phone: '+91 33 23207085',
      email: 'ero@bis.gov.in',
      working_hours: '9:00 AM - 5:30 PM (Mon-Fri)',
      services_json: JSON.stringify(['Product Certification', 'Consumer Welfare Guidance', 'Laboratory Testing']),
      coordinates_json: JSON.stringify({ lat: 22.5768, lng: 88.3888 })
    },
    {
      id: 'off-bhopal-cro',
      office_name: 'Central Regional Office',
      region: 'Central',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      address: 'Manak Bhavan, Link Road No. 3, Arera Hills, Bhopal 462003',
      phone: '+91 755 2552803',
      email: 'cro@bis.gov.in',
      working_hours: '9:00 AM - 5:30 PM (Mon-Fri)',
      services_json: JSON.stringify(['Licensing & Inspections', 'MSME Handholding Desk', 'Standard Sale Counter']),
      coordinates_json: JSON.stringify({ lat: 23.2324, lng: 77.4298 })
    }
  ];

  for (const o of offices) {
    insertOffice.run(o);
  }

  // 12. Seed Saved Workspace Items
  const insertSaved = db.prepare(`
    INSERT INTO saved_items (id, user_id, item_type, title, item_id, metadata_json)
    VALUES (@id, @user_id, @item_type, @title, @item_id, @metadata_json)
  `);

  insertSaved.run({
    id: 'save-1',
    user_id: 'usr-afnan-001',
    item_type: 'standard',
    title: 'IS 17526:2021 (Stainless Steel Water Bottles)',
    item_id: 'std-is-17526',
    metadata_json: JSON.stringify({ category: 'Food & Beverages', mandatory: 1 })
  });

  insertSaved.run({
    id: 'save-2',
    user_id: 'usr-afnan-001',
    item_type: 'comparison',
    title: 'Comparison: IS 17526:2021 vs IS 302-2-25',
    item_id: 'comp-1',
    metadata_json: JSON.stringify({ standards: ['IS 17526:2021', 'IS 302-2-25:2014'] })
  });

  insertSaved.run({
    id: 'save-3',
    user_id: 'usr-afnan-001',
    item_type: 'product',
    title: 'Stainless Steel Water Bottle Profile',
    item_id: 'prod-ss-bottle',
    metadata_json: JSON.stringify({ material: 'SS 304', capacity: '750ml' })
  });

  // 13. Seed Chat Conversation & Message
  const insertConv = db.prepare(`
    INSERT INTO chat_conversations (id, user_id, title, product_context_json)
    VALUES (@id, @user_id, @title, @product_context_json)
  `);

  insertConv.run({
    id: 'conv-bottle-001',
    user_id: 'usr-afnan-001',
    title: 'Which BIS standard applies to my stainless steel water bottle?',
    product_context_json: JSON.stringify({
      product_name: 'Stainless Steel Water Bottle',
      category: 'Food & Beverage Containers',
      material: 'Stainless Steel (SS 304/316)',
      intended_use: 'Drinking Water Storage',
      capacity: '750 ml',
      is_code: 'IS 17526:2021',
      confidence: 0.92
    })
  });

  const insertMsg = db.prepare(`
    INSERT INTO chat_messages (id, conversation_id, sender, content, structured_data_json, confidence_score)
    VALUES (@id, @conversation_id, @sender, @content, @structured_data_json, @confidence_score)
  `);

  insertMsg.run({
    id: 'msg-1',
    conversation_id: 'conv-bottle-001',
    sender: 'user',
    content: 'Which BIS standard applies to my stainless steel water bottle?',
    structured_data_json: '{}',
    confidence_score: 1.0
  });

  insertMsg.run({
    id: 'msg-2',
    conversation_id: 'conv-bottle-001',
    sender: 'assistant',
    content: `Here's what I found for your product:

### Applicable Standard
**IS 17526:2021** — *Stainless Steel Vacuum Insulated Flasks and Bottles — Specification*

**Status:** Mandatory (QCO Notified)  
**Confidence:** 92%

---

### Why it applies:
Your product falls under stainless steel food-grade containers specifically engineered for potable water and beverage storage, which is governed under **IS 17526:2021**.

### Key requirements:
- **Material:** Food grade Stainless Steel (SS 304 / SS 316)
- **Leak-proof performance:** Zero leakage under inverted 10-minute hold
- **Thermal insulation:** Heat retention ≥ 70°C after 6 hours
- **Food grade safety:** Compliance with non-toxic extraction thresholds

### Required tests:
1. Thermal Retention Performance (Clause 5.1)
2. Hydrostatic Leakage Test (Clause 5.2)
3. Material Chemical Composition OES Analysis (Clause 4.2)
4. Salt Spray Corrosion Resistance (Clause 6.4)
5. Drop Impact Durability Test (Clause 6.2)

### Required documents:
- Raw Material Mill Test Certificate (SS 304/316)
- Factory Layout & Vacuum Furnace Machinery Details
- In-house Quality Assurance Scheme & Calibration Certificates
- Product Label & ISI Marking Vector Artwork

**Source:** BIS Standards Portal | Clause 4.2, 5.1, 6.2 (Demonstration Knowledge Base Record)
*Disclaimer: Demo data for prototype evaluation. Confirm current requirements with official BIS gazette.*`,
    structured_data_json: JSON.stringify({
      is_code: 'IS 17526:2021',
      title: 'Stainless Steel Vacuum Insulated Flasks and Bottles — Specification',
      confidence: 92,
      mandatory: true,
      category: 'Food & Beverages',
      why_applies: 'Your product falls under stainless steel food grade containers used for potable water, which is covered under IS 17526:2021.',
      key_requirements: [
        'Material: Stainless steel (SS 304/316)',
        'Leak proof performance',
        'Food grade safety and thermal retention'
      ],
      clauses: ['Clause 4.2 Material', 'Clause 5.1 Thermal Performance', 'Clause 5.2 Leakage Resistance'],
      tests: ['Thermal Retention', 'Leakage Test', 'Chemical Composition', 'Salt Spray Corrosion'],
      documents: ['Raw Material Mill TC', 'Factory Layout', 'Calibration Certificates', 'Product Label Artwork']
    }),
    confidence_score: 0.92
  });

  // 14. Seed Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, details)
    VALUES (@id, @user_name, @action, @entity_type, @entity_id, @details)
  `);

  insertAudit.run({
    id: 'aud-1',
    user_name: 'Afnan Ahmad',
    action: 'MATCH_STANDARD',
    entity_type: 'Product',
    entity_id: 'prod-ss-bottle',
    details: 'Matched Stainless Steel Water Bottle with IS 17526:2021 (92% confidence)'
  });

  insertAudit.run({
    id: 'aud-2',
    user_name: 'Afnan Ahmad',
    action: 'VERIFY_MARK',
    entity_type: 'Licence',
    entity_id: 'CM/L-71020123',
    details: 'Verified ISI mark for AquaSafe Steelware Pvt. Ltd. (Status: VERIFIED)'
  });

  insertAudit.run({
    id: 'aud-3',
    user_name: 'Afnan Ahmad',
    action: 'UPDATE_CHECKLIST',
    entity_type: 'CompliancePlan',
    entity_id: 'plan-ss-bottle-001',
    details: 'Completed Step 2 (Tests Mapped) and activated Step 3 (Documents Preparation)'
  });

  console.log('[DB] Seeding completed successfully.');
}
