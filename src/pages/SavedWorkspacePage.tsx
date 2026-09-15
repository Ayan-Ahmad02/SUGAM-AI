import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bookmark,
  FileText,
  Package,
  Compass,
  MessageSquare,
  Trash2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { apiGetSavedItems, apiDeleteSavedItem } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const SavedWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'All' | 'standard' | 'product' | 'plan' | 'comparison'>('All');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedItems();
  }, [activeTab]);

  const loadSavedItems = async () => {
    try {
      setLoading(true);
      const data = await apiGetSavedItems(activeTab !== 'All' ? activeTab : '');
      setItems(data);
    } catch (err) {
      console.error('Failed to load saved items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiDeleteSavedItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Failed to delete saved item:', err);
    }
  };

  const handleOpenItem = (item: any) => {
    if (item.item_type === 'standard') {
      navigate(`/standards/${encodeURIComponent(item.item_id || 'IS 17526:2021')}`);
    } else if (item.item_type === 'plan') {
      navigate('/compliance');
    } else if (item.item_type === 'comparison') {
      navigate('/compare');
    } else if (item.item_type === 'product') {
      navigate('/product-matching');
    } else {
      navigate('/assistant');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'standard': return FileText;
      case 'product': return Package;
      case 'plan': return Compass;
      case 'comparison': return Layers;
      default: return MessageSquare;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('savedWorkspace')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal compliance vault for saved standards, products, and compliance plans
            </p>
          </div>
        </div>

        {/* Tabs (Matching Mobile Screen 16) */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto">
          {[
            { key: 'All', label: 'All Items' },
            { key: 'standard', label: 'Standards' },
            { key: 'product', label: 'Products' },
            { key: 'plan', label: 'Plans' },
            { key: 'comparison', label: 'Comparisons' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            Loading saved items...
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-bold text-slate-800">No saved items in this category</p>
            <p className="text-xs text-slate-500 mt-1">Bookmark standards or save product matches to view them here.</p>
          </div>
        ) : (
          items.map((item) => {
            const Icon = getIcon(item.item_type);
            return (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 truncate">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 capitalize">
                      {item.item_type} • Saved {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
