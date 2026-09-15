export type UserIntent = 
  | 'FIND_STANDARD'
  | 'CHECK_REQUIREMENTS'
  | 'CHECK_TESTS'
  | 'CHECK_DOCUMENTS'
  | 'COMPLIANCE_ROADMAP'
  | 'VERIFY_CLAIM'
  | 'GENERAL_QUERY';

export function detectIntent(query: string): UserIntent {
  const q = query.toLowerCase();

  if (
    q.includes('test') || 
    q.includes('testing') || 
    q.includes('lab test') || 
    q.includes('sample') ||
    q.includes('what tests')
  ) {
    return 'CHECK_TESTS';
  }

  if (
    q.includes('document') || 
    q.includes('paperwork') || 
    q.includes('checklist') || 
    q.includes('certificate') ||
    q.includes('what documents')
  ) {
    return 'CHECK_DOCUMENTS';
  }

  if (
    q.includes('roadmap') || 
    q.includes('step') || 
    q.includes('process') || 
    q.includes('how to get') || 
    q.includes('how to apply') ||
    q.includes('certification path')
  ) {
    return 'COMPLIANCE_ROADMAP';
  }

  if (
    q.includes('verify') || 
    q.includes('fake') || 
    q.includes('genuine') || 
    q.includes('cml') || 
    q.includes('isi mark') ||
    q.includes('claim')
  ) {
    return 'VERIFY_CLAIM';
  }

  if (
    q.includes('clause') || 
    q.includes('requirement') || 
    q.includes('specification') || 
    q.includes('scope') || 
    q.includes('rule')
  ) {
    return 'CHECK_REQUIREMENTS';
  }

  return 'FIND_STANDARD';
}
