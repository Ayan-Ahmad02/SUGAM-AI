import React, { useState, useEffect } from 'react';
import {
  FolderCheck,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiGetDocuments, apiUploadDocument, apiDeleteDocument } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const DocumentCheckerPage: React.FC = () => {
  const { t } = useLanguage();

  const [documents, setDocuments] = useState<any[]>([]);
  const [checklist, setChecklist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const data = await apiGetDocuments();
      setDocuments(data.documents || []);
      setChecklist(data.checklist || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await apiUploadDocument(formData);
      await loadDocs();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Document upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-xs">
            <FolderCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('documentsTemplates')} & Scrutiny
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload factory drawings, test reports, and mill certificates to verify completeness against BIS checklist
            </p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone (Matching Mobile Screen 10) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle">
        <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all text-center group">
          <input
            type="file"
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mt-3">
            {uploading ? 'Analyzing Document with OCR...' : 'Upload Compliance Documents'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            PDF, DOCX, JPG, PNG (Max 10MB)
          </p>
        </label>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Uploaded Files ({documents.length})
          </h3>
          <button
            type="button"
            onClick={loadDocs}
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="space-y-2.5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {doc.filename}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {(doc.file_size / (1024 * 1024)).toFixed(1)} MB • {doc.file_type || 'Document'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={doc.status === 'analyzed' ? 'COMPLETED' : 'PENDING'} size="xs" />
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Checklist (Matching Mobile Screen 10) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Verification Checklist
        </h3>

        <div className="space-y-2.5">
          {checklist.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.mandatory ? '[Mandatory]' : '[Optional]'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{item.reason}</p>
              </div>

              <div className="shrink-0">
                <StatusBadge status={item.status} size="xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
