'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  Clock,
  Check,
  CheckCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { StatusIndicator } from '@/components/ui/StatusIndicator';

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
  const [mobileTab, setMobileTab] = useState<'LIST' | 'CHAT' | 'PROFILE'>('CHAT');

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
    <div className="h-[calc(100vh-6.5rem)] glass-panel rounded-3xl flex overflow-hidden shadow-2xl border border-slate-800">
      {/* PANEL 1: CONVERSATIONS LIST */}
      <div className="w-80 md:w-88 border-r border-slate-800 flex flex-col bg-slate-950/70 shrink-0">
        {/* Search & Filter Header */}
        <div className="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-900/60">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search chats, phones, names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterMode === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({conversations.length})
            </button>
            <button
              onClick={() => setFilterMode('BOT')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterMode === 'BOT'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bot Mode
            </button>
            <button
              onClick={() => setFilterMode('HUMAN')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterMode === 'HUMAN'
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Human ({conversations.filter(c => c.mode === 'HUMAN').length})
            </button>
          </div>
        </div>

        {/* Conversation List Stream */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations matching filters.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-800/90 border-l-4 border-brand-500 shadow-md'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate max-w-[140px]">
                        {conv.customer_name}
                      </span>
                      {conv.urgency === 'HIGH' && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="High Urgency" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {conv.last_message_at}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate mt-1 leading-snug">
                    {conv.last_message}
                  </p>

                  <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-slate-800/50">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md ${
                          conv.mode === 'BOT'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {conv.mode}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {conv.customer_location}
                      </span>
                    </div>

                    {conv.unread_count > 0 && (
                      <span className="w-4 h-4 rounded-full bg-brand-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-sm">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PANEL 2: ACTIVE CHAT TIMELINE & DISPATCH */}
      <div className="flex-1 flex flex-col bg-slate-900/40 min-w-0">
        {/* Chat Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              {activeConv.customer_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">{activeConv.customer_name}</h3>
                <span className="text-xs font-mono text-slate-400">{activeConv.customer_phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                <span>
                  Mode: <strong className={activeConv.mode === 'HUMAN' ? 'text-indigo-400 font-bold' : 'text-emerald-400 font-bold'}>{activeConv.mode}</strong>
                </span>
                <span>•</span>
                <span>
                  Status: <strong className={activeConv.status === 'OPEN' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{activeConv.status}</strong>
                </span>
                {activeConv.intent && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300 font-sans">{activeConv.intent}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mode Switch & Status Control */}
          <div className="flex items-center gap-2">
            {activeConv.mode === 'BOT' ? (
              <button
                onClick={() => toggleMode('HUMAN')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Take Over Chat</span>
              </button>
            ) : (
              <button
                onClick={() => toggleMode('BOT')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Resume AI Bot</span>
              </button>
            )}

            {activeConv.status === 'OPEN' ? (
              <button
                onClick={() => toggleStatus('RESOLVED')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resolve</span>
              </button>
            ) : (
              <button
                onClick={() => toggleStatus('OPEN')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reopen</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:18px_18px]">
          {activeMessages.map((msg) => {
            const isCustomer = msg.direction === 'INBOUND';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-md lg:max-w-lg p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${
                    isCustomer
                      ? 'bg-slate-800/95 text-slate-100 rounded-tl-none border border-slate-700'
                      : msg.sender_type === 'BOT'
                      ? 'bg-emerald-950/90 text-emerald-100 border border-emerald-800/60 rounded-tr-none'
                      : 'bg-brand-600 text-white rounded-tr-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] opacity-80 font-bold uppercase tracking-wider font-mono">
                    <span className="flex items-center gap-1">
                      {msg.sender_type === 'BOT' && <Bot className="w-3 h-3 text-emerald-400" />}
                      {msg.sender_type === 'STAFF' && <UserCheck className="w-3 h-3 text-white" />}
                      {msg.sender_type}
                    </span>
                    <span className="flex items-center gap-1">
                      {msg.created_at}
                      {msg.status === 'READ' && <CheckCheck className="w-3.5 h-3.5 text-brand-300 ml-1" />}
                      {msg.status === 'DELIVERED' && <Check className="w-3.5 h-3.5 text-slate-300 ml-1" />}
                    </span>
                  </div>

                  <p className="whitespace-pre-line text-xs font-normal">{msg.content}</p>

                  {/* AI Confidence & Verified Sources Badge */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-300/80 font-mono">
                      <span>Sources: {msg.sources.join(', ')}</span>
                      {msg.confidence !== undefined && (
                        <span className="font-bold text-emerald-300">
                          {Math.round(msg.confidence * 100)}% Conf
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reply Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/95 flex items-center gap-2.5">
          <input
            type="text"
            placeholder={
              activeConv.mode === 'BOT'
                ? 'AI Bot automation is active. Switch to Human mode to reply manually...'
                : 'Type official WhatsApp message response...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/25 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* PANEL 3: CUSTOMER & LEAD PROFILE */}
      <div className="w-80 border-l border-slate-800 p-5 bg-slate-950/70 overflow-y-auto space-y-6 shrink-0 hidden xl:block">
        {/* Customer Header */}
        <div className="text-center border-b border-slate-800 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-xl font-black text-slate-950 shadow-xl shadow-brand-500/20">
            {activeConv.customer_name.substring(0, 2).toUpperCase()}
          </div>
          <h4 className="font-bold text-sm text-white mt-3">{activeConv.customer_name}</h4>
          <span className="text-xs text-slate-400 font-mono">{activeConv.customer_phone}</span>

          {/* DPDP Consent Status */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-[11px] font-bold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Consent Active</span>
          </div>
        </div>

        {/* Customer Info Details */}
        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Location
            </span>
            <span className="font-semibold text-slate-200">{activeConv.customer_location}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-500" /> Tags
            </span>
            <div className="flex flex-wrap gap-1">
              {activeConv.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Associated Lead Context Card */}
        {activeLead && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Briefcase className="w-3.5 h-3.5 text-brand-400" /> Associated Lead
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeLead.status}
              </span>
            </div>
            <div className="text-xs font-bold text-white">{activeLead.product}</div>
            <p className="text-[11px] text-slate-400 leading-snug">{activeLead.requirement}</p>
            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between font-mono">
              <span>Score: <strong className="text-brand-400">{activeLead.score || 85}/100</strong></span>
              <span>Assignee: <strong className="text-slate-200">{activeLead.assigned_name || 'Unassigned'}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
