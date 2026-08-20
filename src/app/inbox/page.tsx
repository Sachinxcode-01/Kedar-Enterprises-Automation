'use client';

import { useState } from 'react';
import {
  initialConversations,
  initialMessagesMap,
  initialCustomers,
  initialLeads,
} from '@/lib/data';
import { Conversation, Message } from '@/lib/types';
import {
  Search,
  Send,
  UserCheck,
  Bot,
  CheckCircle2,
  RotateCcw,
  Tag,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>(initialConversations[0].id);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessagesMap);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'BOT' | 'HUMAN'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');

  // Input Box State
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = messagesMap[activeConv.id] || [];
  const activeCustomer = initialCustomers.find((c) => c.id === activeConv.customer_id);
  const activeLead = initialLeads.find((l) => l.customer_id === activeConv.customer_id);

  // Filtered List
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer_phone.includes(searchTerm);
    const matchesMode = filterMode === 'ALL' || c.mode === filterMode;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesMode && matchesStatus;
  });

  // Action Handlers
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversation_id: activeConv.id,
      direction: 'OUTBOUND',
      message_type: 'text',
      content: inputText,
      sender_type: 'STAFF',
      status: 'DELIVERED',
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeConv.id]: [...(prev[activeConv.id] || []), newMsg],
    }));

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? { ...c, last_message: inputText, last_message_at: 'Just now' }
          : c
      )
    );

    setInputText('');
  };

  const toggleMode = (newMode: 'BOT' | 'HUMAN') => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConv.id ? { ...c, mode: newMode } : c))
    );
  };

  const toggleStatus = (newStatus: 'OPEN' | 'RESOLVED') => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConv.id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="h-[calc(100vh-6rem)] bg-slate-900/90 border border-slate-800 rounded-2xl flex overflow-hidden shadow-2xl">
      {/* PANEL 1: CONVERSATIONS LIST */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950/60">
        {/* Search & Filter Header */}
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                filterMode === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('BOT')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                filterMode === 'BOT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bot
            </button>
            <button
              onClick={() => setFilterMode('HUMAN')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                filterMode === 'HUMAN' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Human
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-slate-800/90 border-l-4 border-brand-500'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200 truncate max-w-[140px]">
                    {conv.customer_name}
                  </span>
                  <span className="text-[10px] text-slate-500">{conv.last_message_at}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">{conv.last_message}</p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded ${
                        conv.mode === 'BOT'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      {conv.mode}
                    </span>
                    <span className="text-[10px] text-slate-500">{conv.customer_location}</span>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-brand-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PANEL 2: CURRENT CHAT STREAM & ACTIONS */}
      <div className="flex-1 flex flex-col bg-slate-900/40">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm">
              {activeConv.customer_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm">{activeConv.customer_name}</h3>
                <span className="text-xs font-mono text-slate-400">{activeConv.customer_phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span>Mode: <strong className={activeConv.mode === 'HUMAN' ? 'text-indigo-400' : 'text-emerald-400'}>{activeConv.mode}</strong></span>
                <span>•</span>
                <span>Status: <strong className={activeConv.status === 'OPEN' ? 'text-amber-400' : 'text-emerald-400'}>{activeConv.status}</strong></span>
              </div>
            </div>
          </div>

          {/* Mode Switch & Status Control */}
          <div className="flex items-center gap-2">
            {activeConv.mode === 'BOT' ? (
              <button
                onClick={() => toggleMode('HUMAN')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Take Over Chat</span>
              </button>
            ) : (
              <button
                onClick={() => toggleMode('BOT')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Resume Bot</span>
              </button>
            )}

            {activeConv.status === 'OPEN' ? (
              <button
                onClick={() => toggleStatus('RESOLVED')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resolve</span>
              </button>
            ) : (
              <button
                onClick={() => toggleStatus('OPEN')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reopen</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          {activeMessages.map((msg) => {
            const isCustomer = msg.direction === 'INBOUND';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isCustomer
                      ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                      : msg.sender_type === 'BOT'
                      ? 'bg-emerald-950/80 text-emerald-100 border border-emerald-800/60 rounded-tr-none'
                      : 'bg-brand-600 text-white rounded-tr-none shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75 font-semibold">
                    <span>{msg.sender_type}</span>
                    <span>{msg.created_at}</span>
                  </div>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Send Reply Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
          <input
            type="text"
            placeholder={
              activeConv.mode === 'BOT'
                ? 'Bot automation is active. Switch to Human mode to reply manually...'
                : 'Type official Meta WhatsApp response...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-brand-600/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* PANEL 3: CUSTOMER & LEAD PROFILE */}
      <div className="w-80 border-l border-slate-800 p-4 bg-slate-950/60 overflow-y-auto space-y-5">
        {/* Customer Header */}
        <div className="text-center border-b border-slate-800 pb-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-brand-500 mx-auto flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {activeConv.customer_name.substring(0, 2).toUpperCase()}
          </div>
          <h4 className="font-bold text-sm text-white mt-2">{activeConv.customer_name}</h4>
          <span className="text-xs text-slate-400 font-mono">{activeConv.customer_phone}</span>

          {/* DPDP Consent Status */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-[11px] font-semibold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Consent Granted</span>
          </div>
        </div>

        {/* Customer Info Details */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /> Location</span>
            <span className="font-medium text-slate-200">{activeConv.customer_location}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-slate-500" /> Tags</span>
            <div className="flex gap-1">
              {activeConv.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Context Card */}
        {activeLead && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand-400" /> Associated Lead
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeLead.status}
              </span>
            </div>
            <div className="text-xs font-semibold text-white">{activeLead.product}</div>
            <p className="text-[11px] text-slate-400 leading-snug">{activeLead.requirement}</p>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              Assigned: <strong className="text-slate-300">{activeLead.assigned_name || 'Unassigned'}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
