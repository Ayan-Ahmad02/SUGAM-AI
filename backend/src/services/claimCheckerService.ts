export interface ClaimAnalysisItem {
  claim: string;
  status: 'Verified' | 'Suspicious' | 'Needs Verification';
  reason: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ClaimCheckResult {
  overallStatus: 'VERIFIED' | 'SUSPICIOUS' | 'NEEDS_VERIFICATION';
  riskLevel: 'Low' | 'Medium' | 'High';
  claims: ClaimAnalysisItem[];
  detectedLicence?: string;
  detectedStandard?: string;
  recommendations: string[];
}

export function analyzeProductClaims(text: string): ClaimCheckResult {
  const t = text.toLowerCase();
  const claims: ClaimAnalysisItem[] = [];

  // Detect IS standard mention
  const isMatch = text.match(/IS\s*[:\-\s]?\s*(\d+(?:[-–]\d+)*(?::\d{4})?)/i);
  // Detect CM/L or R-number
  const cmlMatch = text.match(/(?:CM\/L[-:\s]*\d{7,8}|R[-:\s]*\d{7,8})/i);

  const detectedStandard = isMatch ? isMatch[0].toUpperCase() : undefined;
  const detectedLicence = cmlMatch ? cmlMatch[0].toUpperCase() : undefined;

  // Check 1: BIS Certified Claim
  if (t.includes('bis certified') || t.includes('bis approved') || t.includes('approved by bis')) {
    if (detectedLicence) {
      claims.push({
        claim: 'Claimed: "BIS Certified"',
        status: 'Verified',
        reason: `Valid Licence Number syntax detected (${detectedLicence}). Corresponds to an accredited certification.`,
        riskLevel: 'Low'
      });
    } else {
      claims.push({
        claim: 'Claimed: "BIS Certified"',
        status: 'Needs Verification',
        reason: 'Product listing claims BIS certification but omits the mandatory 7 or 8 digit CM/L licence number.',
        riskLevel: 'High'
      });
    }
  }

  // Check 2: ISI Mark Claim
  if (t.includes('isi mark') || t.includes('isi certified') || t.includes('isi marked')) {
    if (detectedStandard && detectedLicence) {
      claims.push({
        claim: 'Claimed: "ISI Mark"',
        status: 'Verified',
        reason: `Complete attribution provided with standard (${detectedStandard}) and licence (${detectedLicence}).`,
        riskLevel: 'Low'
      });
    } else {
      claims.push({
        claim: 'Claimed: "ISI Mark"',
        status: 'Suspicious',
        reason: 'Under the BIS Act 2016, use of the ISI mark without displaying the associated CM/L licence number is prohibited.',
        riskLevel: 'High'
      });
    }
  }

  // Check 3: Standard Conformity Claim
  if (detectedStandard) {
    claims.push({
      claim: `Conforms to ${detectedStandard}`,
      status: detectedLicence ? 'Verified' : 'Needs Verification',
      reason: detectedLicence ? 'Standard code aligned with licence registration.' : 'Standard specified, but proof of laboratory compliance testing or licence is missing.',
      riskLevel: detectedLicence ? 'Low' : 'Medium'
    });
  }

  // If no specific claims were explicitly found
  if (claims.length === 0) {
    claims.push({
      claim: 'General Quality Claims',
      status: 'Needs Verification',
      reason: 'No official BIS certification mark or Indian Standard number was detected in the provided listing description.',
      riskLevel: 'Medium'
    });
  }

  const hasHighRisk = claims.some(c => c.riskLevel === 'High');
  const hasMediumRisk = claims.some(c => c.riskLevel === 'Medium');

  const riskLevel = hasHighRisk ? 'High' : (hasMediumRisk ? 'Medium' : 'Low');
  const overallStatus = hasHighRisk ? 'SUSPICIOUS' : (hasMediumRisk ? 'NEEDS_VERIFICATION' : 'VERIFIED');

  const recommendations = [
    hasHighRisk 
      ? 'Request the seller or manufacturer to supply their 7/8 digit CM/L number or R-number.' 
      : 'Verify the physical packaging on delivery to confirm indelible laser marking of the ISI logo.',
    'Cross-check the licence number against the SUGAM-AI BIS Verification tool before bulk procurement.'
  ];

  return {
    overallStatus,
    riskLevel,
    claims,
    detectedLicence,
    detectedStandard,
    recommendations
  };
}
