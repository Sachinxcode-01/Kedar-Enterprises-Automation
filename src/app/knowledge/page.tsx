'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Building2,
  Package,
  Wrench,
  Tag,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldCheck,
  Edit2,
  Trash2,
  Save,
  Search,
  Check,
  Clock,
  Layers,
} from 'lucide-react';
import {
  initialProducts,
  initialServices,
  initialPrices,
  initialFaqs,
} from '@/lib/data';
import { ProductItem, ServiceItem, PriceItem, FAQ } from '@/lib/types';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'products' | 'services' | 'prices' | 'faqs'>('info');

  // Business Information State
  const [businessInfo, setBusinessInfo] = useState({
    business_name: 'Kedar Enterprises',
    legal_name: 'Kedar Enterprises Private Limited',
    description: 'Premier commercial HVAC, solar energy inverters, and industrial generator solutions in India.',
    phone: '+91-80-4567-8900',
    whatsapp_number: '+91-98765-43210',
    email: 'info@kedarenterprises.com',
    website: 'https://kedarenterprises.com',
    address: 'Plot 45, Industrial Suburb Stage II, Bengaluru, Karnataka - 560022',
    business_hours: 'Monday through Saturday, 09:00 AM to 06:00 PM IST (Sunday Closed)',
    gstin: '29AAAAA0000A1Z5',
  });

  const [infoSaved, setInfoSaved] = useState(false);

  // Lists
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [prices, setPrices] = useState<PriceItem[]>(initialPrices);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // New item draft states
  const [newProduct, setNewProduct] = useState({ sku: '', name: '', category: '', description: '', unit: 'unit', price: 0 });
  const [newService, setNewService] = useState({ name: '', category: '', description: '', scope: '', sla: '' });
  const [newPrice, setNewPrice] = useState({ item_name: '', price: 0, currency: 'INR', unit: 'unit', pricing_type: 'STANDARD' as const });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', keywords: '', category: 'General' });

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 3000);
  };

  const handleAddProduct = () => {
    if (!newProduct.name) return;
    const item: ProductItem = {
      id: `p-${Date.now()}`,
      sku: newProduct.sku || `KE-SKU-${Date.now().toString().slice(-4)}`,
      name: newProduct.name,
      category: newProduct.category || 'General',
      description: newProduct.description,
      unit: newProduct.unit,
      price: newProduct.price || undefined,
      status: 'APPROVED',
      updated_at: 'Just now',
    };
    setProducts([item, ...products]);
    setNewProduct({ sku: '', name: '', category: '', description: '', unit: 'unit', price: 0 });
  };

  const handleAddService = () => {
    if (!newService.name) return;
    const item: ServiceItem = {
      id: `s-${Date.now()}`,
      name: newService.name,
      category: newService.category || 'Services',
      description: newService.description,
      scope: newService.scope || 'Standard maintenance protocol',
      sla: newService.sla || '24-hour response',
      status: 'APPROVED',
      updated_at: 'Just now',
    };
    setServices([item, ...services]);
    setNewService({ name: '', category: '', description: '', scope: '', sla: '' });
  };

  const handleAddPrice = () => {
    if (!newPrice.item_name || !newPrice.price) return;
    const item: PriceItem = {
      id: `pr-${Date.now()}`,
      item_name: newPrice.item_name,
      price: Number(newPrice.price),
      currency: 'INR',
      unit: newPrice.unit,
      pricing_type: newPrice.pricing_type,
      status: 'AUTHORITATIVE',
      updated_at: 'Just now',
    };
    setPrices([item, ...prices]);
    setNewPrice({ item_name: '', price: 0, currency: 'INR', unit: 'unit', pricing_type: 'STANDARD' });
  };

  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) return;
    const kws = newFaq.keywords.split(',').map((k) => k.trim()).filter(Boolean);
    const item: FAQ = {
      id: `f-${Date.now()}`,
      question: newFaq.question,
      answer: newFaq.answer,
      keywords: kws.length > 0 ? kws : ['general'],
      category: newFaq.category,
      enabled: true,
      match_count: 0,
      status: 'APPROVED',
    };
    setFaqs([item, ...faqs]);
    setNewFaq({ question: '', answer: '', keywords: '', category: 'General' });
  };

  const handleDeleteProduct = (id: string) => setProducts(products.filter((p) => p.id !== id));
  const handleDeleteService = (id: string) => setServices(services.filter((s) => s.id !== id));
  const handleDeletePrice = (id: string) => setPrices(prices.filter((pr) => pr.id !== id));
  const handleDeleteFaq = (id: string) => setFaqs(faqs.filter((f) => f.id !== id));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Top Banner with Coverage Score */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 font-mono">
            <BookOpen className="w-4 h-4" />
            <span>Authoritative Business Knowledge Base</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Knowledge & AI Guardrail Control
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Configure verified commercial information, products, prices, and approved FAQs. The AI Router only responds using verified database facts—never hallucinating unconfigured details.
          </p>
        </div>

        {/* Coverage Score Pill */}
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono">Knowledge Coverage</div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">94.8%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Overview Metric Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="glass-panel p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Profile</span>
          <div className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Configured
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">GSTIN & Address active</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Products</span>
          <div className="text-lg font-bold text-white mt-1">{products.length} Verified</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Commercial catalog</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Services</span>
          <div className="text-lg font-bold text-white mt-1">{services.length} Active</div>
          <p className="text-[10px] text-slate-400 mt-0.5">AMC & SLA contracts</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Prices Matrix</span>
          <div className="text-lg font-bold text-white mt-1">{prices.length} Fixed</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Authoritative rates</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Verified FAQs</span>
          <div className="text-lg font-bold text-white mt-1">{faqs.length} Live</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Deterministic matchers</p>
        </div>
      </div>

      {/* AI Guardrail Safety Alert Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-300">AI Hallucination Protection Engine Active</h4>
            <p className="text-slate-400 mt-0.5 leading-relaxed">
              If a requested detail is unlisted in this repository, the AI Router immediately routes to staff takeover rather than fabricating pricing, warranty, or specifications.
            </p>
          </div>
        </div>
      </div>

      {/* Tabbed Knowledge Panel */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-brand-500 text-brand-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Business Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-brand-500 text-brand-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-brand-500 text-brand-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Services ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'prices'
                ? 'border-brand-500 text-brand-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Pricing Matrix ({prices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'border-brand-500 text-brand-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Verified FAQs ({faqs.length})</span>
          </button>
        </div>

        {/* TAB 1: BUSINESS INFO FORM */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="p-6 lg:p-8 space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Company Profile & Official Specifications</h3>
                <p className="text-slate-400">Authoritative facts queried by n8n knowledge retrieval workflow.</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all shadow-lg shadow-brand-600/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{infoSaved ? 'Saved to Supabase!' : 'Save Business Info'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Brand Trade Name *</label>
                <input
                  type="text"
                  value={businessInfo.business_name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, business_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Legal Registered Name</label>
                <input
                  type="text"
                  value={businessInfo.legal_name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, legal_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={businessInfo.gstin}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, gstin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Official Phone</label>
                <input
                  type="text"
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official WhatsApp Number</label>
                <input
                  type="text"
                  value={businessInfo.whatsapp_number}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, whatsapp_number: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
                <input
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Physical Address</label>
                <textarea
                  rows={2}
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Business Hours Schedule</label>
                <textarea
                  rows={2}
                  value={businessInfo.business_hours}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, business_hours: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono resize-none"
                />
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="p-6 lg:p-8 space-y-6 text-xs">
            {/* Add Product Form */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">SKU</label>
                <input
                  type="text"
                  placeholder="KE-HVAC-101"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  placeholder="Commercial VRF Unit"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <input
                  type="text"
                  placeholder="HVAC Systems"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Price (₹)</label>
                <input
                  type="number"
                  placeholder="450000"
                  value={newProduct.price || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono text-slate-300 font-bold">{p.sku}</td>
                      <td className="p-4 font-bold text-white">{p.name}</td>
                      <td className="p-4 text-slate-400">{p.category}</td>
                      <td className="p-4 font-mono text-amber-400 font-semibold">
                        {p.price ? `₹${p.price.toLocaleString('en-IN')}` : 'Quotation Required'}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES CATALOG */}
        {activeTab === 'services' && (
          <div className="p-6 lg:p-8 space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Name *</label>
                <input
                  type="text"
                  placeholder="Preventive AMC"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <input
                  type="text"
                  placeholder="HVAC Maintenance"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">SLA Guarantee</label>
                <input
                  type="text"
                  placeholder="4-hour response"
                  value={newService.sla}
                  onChange={(e) => setNewService({ ...newService, sla: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <button
                onClick={handleAddService}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-4">Service Offering</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">SLA Commitment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {services.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">{s.name}</td>
                      <td className="p-4 text-slate-400">{s.category}</td>
                      <td className="p-4 text-slate-300 font-mono">{s.sla}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRICING MATRIX */}
        {activeTab === 'prices' && (
          <div className="p-6 lg:p-8 space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item Name *</label>
                <input
                  type="text"
                  placeholder="VRF Preventive Package"
                  value={newPrice.item_name}
                  onChange={(e) => setNewPrice({ ...newPrice, item_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Price (₹ INR) *</label>
                <input
                  type="number"
                  placeholder="25000"
                  value={newPrice.price || ''}
                  onChange={(e) => setNewPrice({ ...newPrice, price: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pricing Type</label>
                <select
                  value={newPrice.pricing_type}
                  onChange={(e) => setNewPrice({ ...newPrice, pricing_type: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value="STANDARD">Fixed Standard</option>
                  <option value="SUBSCRIPTION">Annual AMC</option>
                  <option value="TIERED">Tiered Scale</option>
                </select>
              </div>
              <button
                onClick={handleAddPrice}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Price</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-4">Item Name</th>
                    <th className="p-4">Authoritative Price</th>
                    <th className="p-4">Pricing Model</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {prices.map((pr) => (
                    <tr key={pr.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">{pr.item_name}</td>
                      <td className="p-4 font-mono font-bold text-amber-400">
                        ₹{pr.price.toLocaleString('en-IN')} {pr.currency}
                      </td>
                      <td className="p-4 text-slate-400">{pr.pricing_type}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          {pr.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeletePrice(pr.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: VERIFIED FAQS */}
        {activeTab === 'faqs' && (
          <div className="p-6 lg:p-8 space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer Question *</label>
                  <input
                    type="text"
                    placeholder="What are your service warranties?"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Keywords (comma separated)</label>
                  <input
                    type="text"
                    placeholder="warranty, guarantee, policy"
                    value={newFaq.keywords}
                    onChange={(e) => setNewFaq({ ...newFaq, keywords: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Verified Answer Text *</label>
                <textarea
                  rows={2}
                  placeholder="Exact answer payload to dispatch to WhatsApp customer..."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddFaq}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Verified FAQ</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-brand-400" />
                      {faq.question}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {faq.match_count} Hits
                      </span>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Keywords: <code className="text-brand-300">{faq.keywords.join(', ')}</code></span>
                    <span>Category: {faq.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
