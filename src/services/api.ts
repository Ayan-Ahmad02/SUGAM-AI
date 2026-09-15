const API_BASE = '/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('sugam_token');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `API request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

// Dashboard
export const apiGetDashboard = () => fetchApi<any>('/dashboard');

// Standards
export const apiSearchStandards = (q = '', category = '', status = '', mandatory = '') => {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  if (status) params.set('status', status);
  if (mandatory !== '') params.set('mandatory', mandatory);
  return fetchApi<any[]>(`/standards?${params.toString()}`);
};

export const apiGetStandardDetails = (idOrCode: string) => fetchApi<any>(`/standards/${idOrCode}`);

export const apiCompareStandards = (standardIds: string[]) => 
  fetchApi<any[]>('/standards/compare', {
    method: 'POST',
    body: JSON.stringify({ standardIds })
  });

export const apiSaveStandard = (id: string) => fetchApi<any>(`/standards/${id}/save`, { method: 'POST' });
export const apiUnsaveStandard = (id: string) => fetchApi<any>(`/standards/${id}/save`, { method: 'DELETE' });

// Product Matching
export const apiMatchProduct = (data: any) => 
  fetchApi<any>('/products/match', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const apiSaveProduct = (productName: string, details: any) =>
  fetchApi<any>('/products/save', {
    method: 'POST',
    body: JSON.stringify({ productName, details })
  });

// Compliance Navigator
export const apiGetCompliance = () => fetchApi<any>('/compliance');
export const apiUpdateComplianceStep = (planId: string, stepNumber: number, status: string, notes?: string) =>
  fetchApi<any>(`/compliance/plans/${planId}/steps/${stepNumber}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes })
  });
export const apiCreateCompliancePlan = (productName: string, standardId?: string) =>
  fetchApi<any>('/compliance/plans', {
    method: 'POST',
    body: JSON.stringify({ productName, standardId })
  });
export const apiGetCompliancePlanner = () => fetchApi<any>('/compliance/planner');

// Documents & OCR
export const apiGetDocuments = () => fetchApi<any>('/documents');
export const apiUploadDocument = (formData: FormData) =>
  fetchApi<any>('/documents/upload', {
    method: 'POST',
    body: formData
  });
export const apiDeleteDocument = (id: string) => fetchApi<any>(`/documents/${id}`, { method: 'DELETE' });
export const apiRunOcr = (text?: string, imageBase64?: string) =>
  fetchApi<any>('/ocr', {
    method: 'POST',
    body: JSON.stringify({ text, imageBase64 })
  });

// BIS & QR Verification
export const apiVerifyMark = (data: { licenceNumber?: string; isCode?: string; rawText?: string }) =>
  fetchApi<any>('/verification/mark', {
    method: 'POST',
    body: JSON.stringify(data)
  });
export const apiVerifyQr = (qrPayload: string) =>
  fetchApi<any>('/verification/qr', {
    method: 'POST',
    body: JSON.stringify({ qrPayload })
  });

// Claim Checker
export const apiCheckClaim = (data: { listingText?: string; productUrl?: string }) =>
  fetchApi<any>('/claims/check', {
    method: 'POST',
    body: JSON.stringify(data)
  });

// Laboratories & Offices
export const apiGetLabs = (filters: any = {}) => {
  const p = new URLSearchParams(filters);
  return fetchApi<any[]>(`/labs?${p.toString()}`);
};
export const apiShortlistLab = (id: string) => fetchApi<any>(`/labs/${id}/shortlist`, { method: 'POST' });
export const apiGetOffices = (filters: any = {}) => {
  const p = new URLSearchParams(filters);
  return fetchApi<any[]>(`/offices?${p.toString()}`);
};

// Regulatory Alerts
export const apiGetAlerts = (filters: any = {}) => {
  const p = new URLSearchParams(filters);
  return fetchApi<any[]>(`/alerts?${p.toString()}`);
};
export const apiMarkAlertRead = (id: string) => fetchApi<any>(`/alerts/${id}/read`, { method: 'PATCH' });

// Saved Workspace
export const apiGetSavedItems = (type = '') => {
  const p = type ? `?type=${type}` : '';
  return fetchApi<any[]>(`/saved${p}`);
};
export const apiDeleteSavedItem = (id: string) => fetchApi<any>(`/saved/${id}`, { method: 'DELETE' });

// Complaints & FAQs
export const apiGetComplaints = () => fetchApi<any>('/complaints');
export const apiSubmitComplaint = (data: any) =>
  fetchApi<any>('/complaints', {
    method: 'POST',
    body: JSON.stringify(data)
  });

// AI Chat
export const apiGetConversations = () => fetchApi<any[]>('/chat/conversations');
export const apiCreateConversation = (title: string, productContext?: any) =>
  fetchApi<any>('/chat/conversations', {
    method: 'POST',
    body: JSON.stringify({ title, productContext })
  });
export const apiRenameConversation = (id: string, title: string) =>
  fetchApi<any>(`/chat/conversations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title })
  });
export const apiDeleteConversation = (id: string) =>
  fetchApi<any>(`/chat/conversations/${id}`, { method: 'DELETE' });
export const apiGetMessages = (convId: string) => fetchApi<any[]>(`/chat/conversations/${convId}/messages`);
export const apiSendMessage = (message: string, conversationId?: string, productContext?: any) =>
  fetchApi<any>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversationId, productContext })
  });

// Admin Directorate
export const apiGetAdminSummary = () => fetchApi<any>('/admin/summary');
export const apiGetAdminUsers = () => fetchApi<any[]>('/admin/users');
export const apiUpdateUserRole = (id: string, role: string) =>
  fetchApi<any>(`/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role })
  });
export const apiGetAdminQueries = () => fetchApi<any[]>('/admin/queries');
export const apiGetAdminAudit = () => fetchApi<any[]>('/admin/audit');
export const apiAddAdminStandard = (data: any) =>
  fetchApi<any>('/admin/standards', {
    method: 'POST',
    body: JSON.stringify(data)
  });
export const apiDeleteAdminStandard = (id: string) =>
  fetchApi<any>(`/admin/standards/${id}`, { method: 'DELETE' });
