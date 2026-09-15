import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Plus,
  Search,
  Bot,
  User as UserIcon,
  Trash2,
  Edit2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  FileText,
  Compass,
  FlaskConical,
  X,
  ArrowRight
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  apiGetConversations,
  apiCreateConversation,
  apiRenameConversation,
  apiDeleteConversation,
  apiGetMessages,
  apiSendMessage
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AssistantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');
  const { user } = useAuth();
  const { t } = useLanguage();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [productContext, setProductContext] = useState<any>(null);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Voice Web Speech API
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Rename modal
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  // Mobile drawer toggle for right context panel
  const [showMobileContext, setShowMobileContext] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial query from URL search bar
  useEffect(() => {
    if (initialQuery && conversations.length > 0) {
      handleSend(initialQuery);
    }
  }, [initialQuery, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const data = await apiGetConversations();
      setConversations(data);
      if (data.length > 0) {
        setActiveConversationId(data[0].id);
        setProductContext(data[0].product_context);
      } else {
        // Create initial conversation
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const msgs = await apiGetMessages(convId);
      setMessages(msgs);
      const conv = conversations.find(c => c.id === convId);
      if (conv) {
        setProductContext(conv.product_context);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleNewChat = async () => {
    try {
      const newConv = await apiCreateConversation('New Compliance Inquiry', {
        product_name: 'Stainless Steel Water Bottle',
        category: 'Food & Beverage Containers'
      });
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setMessages([]);
      setProductContext(newConv.product_context);
    } catch (err) {
      console.error('Failed to create new conversation:', err);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText || inputValue).trim();
    if (!textToSend || loading) return;

    setInputValue('');
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConversationId,
      sender: 'user',
      content: textToSend,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const response = await apiSendMessage(textToSend, activeConversationId, productContext);
      
      setMessages(prev => [
        ...prev,
        {
          id: response.messageId,
          conversation_id: activeConversationId,
          sender: 'assistant',
          content: response.content,
          structured_data: response.structuredData || response.clarificationData,
          confidence_score: response.confidenceScore,
          isClarification: response.isClarification,
          created_at: new Date().toISOString()
        }
      ]);

      if (response.productContext) {
        setProductContext(response.productContext);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          conversation_id: activeConversationId,
          sender: 'assistant',
          content: 'Unable to reach the compliance intelligence engine. Please retry or check your network connection.',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API Voice Dictation
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      alert('Web Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await apiDeleteConversation(id);
      const remaining = conversations.filter(c => c.id !== id);
      setConversations(remaining);
      if (activeConversationId === id) {
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingId || !renameTitle.trim()) return;
    try {
      await apiRenameConversation(renamingId, renameTitle.trim());
      setConversations(prev =>
        prev.map(c => (c.id === renamingId ? { ...c, title: renameTitle.trim() } : c))
      );
      setRenamingId(null);
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  const filteredConversations = conversations.filter(c =>
    (c.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col lg:flex-row gap-4 select-none">
      {/* 1. LEFT: Conversation History List */}
      <div className="hidden lg:flex flex-col w-64 bg-white border border-slate-200/90 rounded-2xl shadow-subtle p-3 shrink-0">
        <button
          type="button"
          onClick={handleNewChat}
          className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>

        {/* Search input */}
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500"
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-1 pr-1 scrollbar-thin">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Recent Inquiries
          </p>
          {filteredConversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveConversationId(c.id)}
              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                activeConversationId === c.id
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="truncate flex-1 pr-1">
                <p className="truncate">{c.title}</p>
                <p className={`text-[10px] truncate ${activeConversationId === c.id ? 'text-blue-100' : 'text-slate-400'}`}>
                  {c.product_context?.is_code || 'Standard inquiry'}
                </p>
              </div>

              {/* Edit/Delete icons */}
              <div className="hidden group-hover:flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingId(c.id);
                    setRenameTitle(c.title);
                  }}
                  className={`p-1 rounded hover:bg-black/10 ${activeConversationId === c.id ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteConversation(e, c.id)}
                  className={`p-1 rounded hover:bg-black/10 ${activeConversationId === c.id ? 'text-white' : 'text-slate-400 hover:text-rose-600'}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CENTER: Chat Messages & Input Composer */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200/90 rounded-2xl shadow-subtle overflow-hidden relative">
        {/* Chat Top Header */}
        <div className="px-4 py-3 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs lg:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>SUGAM Compliance Intelligence</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h2>
              <p className="text-[10px] text-slate-500">
                Indian Standards RAG & Grounded Verification Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewChat}
              className="lg:hidden p-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold"
            >
              + New
            </button>
            <button
              type="button"
              onClick={() => setShowMobileContext(!showMobileContext)}
              className="lg:hidden p-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Context</span>
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 border border-blue-100 shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Ask about Indian Standards & BIS Compliance
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Describe your product (e.g. materials, voltage, capacity, intended use) or ask about clauses, required tests, and documentation.
              </p>

              {/* Sample Starters */}
              <div className="mt-4 w-full space-y-2 text-left">
                {[
                  'Which BIS standard applies to my stainless steel water bottle?',
                  'What tests are required for microwave ovens under IS 302?',
                  'Show me the compliance roadmap for ISI mark certification',
                  'What documents do I need for raw material testing?'
                ].map((promptText) => (
                  <button
                    key={promptText}
                    type="button"
                    onClick={() => handleSend(promptText)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 text-slate-700 hover:text-blue-700 text-xs font-medium transition-all text-left flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{promptText}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                      isUser
                        ? 'bg-[#0A1628] text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {isUser ? user?.name?.charAt(0) || 'U' : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] lg:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 shadow-subtle'
                    }`}
                  >
                    {/* Render message content */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Clarification prompt options (Mobile screen 5 replica) */}
                    {msg.isClarification && msg.structured_data?.suggestedAnswers && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                        <p className="text-[11px] font-bold text-slate-700">
                          Select one of these quick options:
                        </p>
                        {msg.structured_data.suggestedAnswers.map((s: any, idx: number) => (
                          <div key={idx} className="flex flex-wrap gap-1.5">
                            {s.options.map((opt: string) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleSend(`My product is ${opt}`)}
                                className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 font-semibold border border-blue-300 rounded-lg text-[11px] shadow-xs transition-colors"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Structured Action Card inside AI Message */}
                    {!isUser && msg.structured_data?.is_code && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
                        <Link
                          to={`/standards/${encodeURIComponent(msg.structured_data.is_code)}`}
                          className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Standard</span>
                        </Link>
                        <Link
                          to="/compliance"
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Compass className="w-3 h-3" />
                          <span>Start Compliance Plan</span>
                        </Link>
                        <Link
                          to="/documents"
                          className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          <span>Check Documents</span>
                        </Link>
                        <Link
                          to="/laboratories"
                          className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <FlaskConical className="w-3 h-3 text-amber-600" />
                          <span>Find Lab</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>Searching BIS Knowledge Base & synthesizing response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            'What tests are required?',
            'What documents do I need?',
            'Show me compliance roadmap',
            'How to verify ISI mark?'
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 text-[11px] font-medium shrink-0 shadow-xs transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Sticky Chat Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          {/* File Upload trigger */}
          <Link
            to="/documents"
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Upload Document or Image for OCR analysis"
          >
            <Paperclip className="w-4 h-4" />
          </Link>

          {/* Voice Microphone control */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2 rounded-lg transition-colors ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak (Web Speech API)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your compliance question or product details..."
            className="flex-1 py-2 px-3 text-xs lg:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 3. RIGHT: Live Workspace Context Panel (Desktop & Mobile Drawer) */}
      <div
        className={`${
          showMobileContext ? 'fixed inset-0 z-50 flex p-4 bg-slate-900/60 backdrop-blur-xs' : 'hidden lg:flex'
        } flex-col w-full lg:w-72 bg-white border border-slate-200/90 rounded-2xl shadow-subtle p-4 overflow-y-auto shrink-0 justify-between`}
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Workspace Context
              </h3>
            </div>
            {showMobileContext && (
              <button
                type="button"
                onClick={() => setShowMobileContext(false)}
                className="p-1 text-slate-400 hover:text-slate-600 lg:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Current Product Card */}
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Current Product
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-1">
              {productContext?.product_name || 'Stainless Steel Water Bottle'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Category: {productContext?.category || 'Food & Beverages'}
            </p>
            {productContext?.material && (
              <p className="text-[10px] text-slate-500 mt-0.5">
                Material: {productContext.material}
              </p>
            )}
          </div>

          {/* Applicable Standard */}
          <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Applicable Standard
              </span>
              <StatusBadge status="92% Match" size="xs" />
            </div>
            <p className="text-xs font-extrabold text-blue-900 mt-1">
              {productContext?.is_code || 'IS 17526:2021'}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
              Stainless Steel Vacuum Insulated Flasks and Bottles
            </p>
          </div>

          {/* Clauses & Evidence */}
          <div className="mt-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Key Requirements & Evidence
            </p>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span>Clause 4.2 Material (SS 304)</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span>Clause 5.1 Thermal Insulation</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span>Clause 5.2 Leakage Resistance</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <Link
            to="/compliance"
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center text-xs font-semibold block shadow-sm transition-colors"
          >
            Start Compliance Roadmap →
          </Link>
          <p className="text-[10px] text-slate-400 text-center leading-tight">
            Source: Bureau of Indian Standards Knowledge Base (Demonstration Record)
          </p>
        </div>
      </div>

      {/* Rename Conversation Modal */}
      {renamingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleRenameSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200"
          >
            <h3 className="text-sm font-bold text-slate-900">Rename Conversation</h3>
            <input
              type="text"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              className="w-full mt-3 p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenamingId(null)}
                className="py-1 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
              >
                Save Title
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
