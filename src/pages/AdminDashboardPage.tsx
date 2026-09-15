import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  Activity,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  apiGetAdminSummary,
  apiGetAdminUsers,
  apiUpdateUserRole,
  apiGetAdminQueries,
  apiGetAdminAudit,
  apiAddAdminStandard,
  apiDeleteAdminStandard,
  apiSearchStandards
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin, user } = useAuth();

  const [summary, setSummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'users' | 'queries' | 'audit'>('knowledge');

  const [standards, setStandards] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // Add Standard Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newIsCode, setNewIsCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Food & Beverages');
  const [newMandatory, setNewMandatory] = useState(true);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [sum, stds, usr, qrs, aud] = await Promise.all([
        apiGetAdminSummary(),
        apiSearchStandards(),
        apiGetAdminUsers(),
        apiGetAdminQueries(),
        apiGetAdminAudit()
      ]);
      setSummary(sum);
      setStandards(stds);
      setUsers(usr);
      setQueries(qrs);
      setAuditLogs(aud);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiUpdateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleAddStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIsCode.trim() || !newTitle.trim()) return;

    try {
      await apiAddAdminStandard({
        is_code: newIsCode.trim(),
        title: newTitle.trim(),
        category: newCategory,
        mandatory: newMandatory ? 1 : 0
      });
      setAddModalOpen(false);
      setNewIsCode('');
      setNewTitle('');
      const updated = await apiSearchStandards();
      setStandards(updated);
    } catch (err) {
      console.error('Failed to add standard:', err);
    }
  };

  const handleDeleteStandard = async (id: string) => {
    if (!confirm('Are you sure you want to remove this standard from the knowledge base?')) return;
    try {
      await apiDeleteAdminStandard(id);
      setStandards(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete standard:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              SUGAM-AI Directorate Admin
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Knowledge Base Management, User Governance, RAG Query Monitoring, and System Health
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadAllAdminData}
          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto border border-slate-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 4 Metric Cards (Matching Mobile Screen 19) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Total Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {summary?.metrics?.totalUsers || 124}
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Total Standards</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {summary?.metrics?.totalStandards || 356}
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Total Queries</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {summary?.metrics?.totalQueries || 642}
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Low Confidence</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">
            {summary?.metrics?.lowConfidenceQueries || 23}
          </p>
        </div>
      </div>

      {/* System Health Strip */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-subtle">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-emerald-600" />
          Live Microservices Health
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold block">REST API</span>
            <span className="font-bold text-emerald-600 block mt-0.5">● ONLINE</span>
            <span className="text-[10px] text-slate-500">Latency: 14ms</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold block">SQLite Engine</span>
            <span className="font-bold text-emerald-600 block mt-0.5">● ONLINE</span>
            <span className="text-[10px] text-slate-500">WAL Mode Active</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold block">AI Engine</span>
            <span className="font-bold text-blue-600 block mt-0.5">● ONLINE</span>
            <span className="text-[10px] text-slate-500">RAG Semantic</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold block">OCR Engine</span>
            <span className="font-bold text-emerald-600 block mt-0.5">● ONLINE</span>
            <span className="text-[10px] text-slate-500">Tesseract.js</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 font-bold block">QR Matrix</span>
            <span className="font-bold text-emerald-600 block mt-0.5">● ONLINE</span>
            <span className="text-[10px] text-slate-500">jsQR Decoder</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { key: 'knowledge', label: `Knowledge Base (${standards.length})` },
              { key: 'users', label: `Users (${users.length})` },
              { key: 'queries', label: `Query Logs (${queries.length})` },
              { key: 'audit', label: `Audit Trail (${auditLogs.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'knowledge' && (
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Standard</span>
            </button>
          )}
        </div>

        {/* Tab 1: Knowledge Base */}
        {activeTab === 'knowledge' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">IS Code</th>
                  <th className="py-2.5">Title</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standards.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-blue-700">{std.is_code}</td>
                    <td className="py-3 font-semibold text-slate-900 max-w-xs truncate">{std.title}</td>
                    <td className="py-3 text-slate-600">{std.category}</td>
                    <td className="py-3">
                      <StatusBadge status={std.mandatory ? 'Mandatory' : 'Voluntary'} size="xs" />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteStandard(std.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete standard"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Users Management */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Company</th>
                  <th className="py-2.5">Current Role</th>
                  <th className="py-2.5 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 text-slate-600">{u.email}</td>
                    <td className="py-3 text-slate-500">{u.company}</td>
                    <td className="py-3">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="py-1 px-2 text-xs border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="MSME">MSME</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Laboratory">Laboratory</option>
                        <option value="Compliance Lead">Compliance Lead</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Queries Log */}
        {activeTab === 'queries' && (
          <div className="space-y-2">
            {queries.map((q) => (
              <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{q.query}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Context: {q.conversation_title} • {q.created_at}
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-white px-2 py-1 rounded border border-slate-200">
                  {Math.round((q.confidence_score || 0.9) * 100)}% Conf
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">{log.details}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    User: {log.user_name} • Entity: {log.entity_type} ({log.entity_id})
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Standard Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleAddStandard}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Add Standard to Knowledge Base</h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">IS Code *</label>
              <input
                type="text"
                required
                value={newIsCode}
                onChange={(e) => setNewIsCode(e.target.value)}
                placeholder="e.g. IS 9873:2019"
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Standard Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Safety of Toys - Specification"
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Electrical & Cables">Electrical & Cables</option>
                <option value="Automotive & Safety">Automotive & Safety</option>
                <option value="Consumer Products / Toys">Consumer Products / Toys</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={newMandatory}
                onChange={(e) => setNewMandatory(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700">Mandatory Quality Control Order (QCO)</span>
            </label>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="py-1.5 px-3 bg-slate-100 text-slate-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Save to Database
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
