import { db } from '../db';

export interface VerificationResult {
  licenceNumber: string;
  isCode: string;
  productName: string;
  manufacturer: string;
  status: 'VERIFIED' | 'WARNING' | 'SUSPICIOUS' | 'UNABLE_TO_VERIFY';
  riskLevel: 'Low' | 'Medium' | 'High';
  evidence: string[];
  validTill?: string;
  factoryLocation?: string;
  disclaimer: string;
}

export function verifyBisMark(input: {
  licenceNumber?: string;
  isCode?: string;
  qrPayload?: string;
  rawText?: string;
}): VerificationResult {
  let licence = (input.licenceNumber || '').trim();
  let code = (input.isCode || '').trim();

  // If QR payload provided, parse it
  if (input.qrPayload) {
    const cmlMatch = input.qrPayload.match(/(?:cml|licence|r)[=:\-\s]*([a-zA-Z0-9\-\/]+)/i);
    if (cmlMatch) licence = cmlMatch[1];

    const isMatch = input.qrPayload.match(/IS\s*[:\-\s]?\s*(\d+(?:[-–]\d+)*(?::\d{4})?)/i);
    if (isMatch) code = isMatch[0];
  }

  // If raw text provided from OCR
  if (!licence && input.rawText) {
    const cmlMatch = input.rawText.match(/(?:CM\/L[-:\s]*\d{7,8}|R[-:\s]*\d{7,8})/i);
    if (cmlMatch) licence = cmlMatch[0].replace(/\s+/g, '');
  }

  const cleanLicence = licence.toUpperCase().replace(/\s+/g, '');

  // Look up in database
  let record: any = null;
  if (cleanLicence) {
    record = db.prepare(`
      SELECT * FROM verifications 
      WHERE UPPER(REPLACE(licence_number, ' ', '')) LIKE ? 
         OR UPPER(REPLACE(licence_number, '-', '')) LIKE ?
    `).get(`%${cleanLicence}%`, `%${cleanLicence.replace(/-/g, '')}%`);
  }

  if (!record && code) {
    record = db.prepare(`SELECT * FROM verifications WHERE UPPER(is_code) LIKE ?`).get(`%${code.toUpperCase()}%`);
  }

  if (record) {
    let parsedEvidence: string[] = [];
    try {
      parsedEvidence = JSON.parse(record.evidence_json);
    } catch {
      parsedEvidence = ['Matching licence found in BIS demonstration database'];
    }

    return {
      licenceNumber: record.licence_number,
      isCode: record.is_code,
      productName: record.product_name,
      manufacturer: record.manufacturer,
      status: record.status as any,
      riskLevel: record.risk_level as any,
      evidence: parsedEvidence,
      validTill: record.valid_till,
      factoryLocation: record.factory_location,
      disclaimer: 'Demo Verification — based on local demonstration data. This is not official BIS verification.'
    };
  }

  // If not found in demo records
  return {
    licenceNumber: licence || 'NOT DETECTED',
    isCode: code || 'IS 17526:2021',
    productName: 'Unregistered Product Entity',
    manufacturer: 'Unknown Supplier',
    status: 'UNABLE_TO_VERIFY',
    riskLevel: 'High',
    evidence: [
      'No active record found in the demonstration BIS database',
      'Missing or malformed CM/L certification endorsement',
      'Requires physical cross-check against official BIS ManakOnline registry'
    ],
    disclaimer: 'Demo Verification — based on local demonstration data. This is not official BIS verification.'
  };
}
