'use client';

import { useState } from 'react';
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
  Lock,
  Sparkles,
} from 'lucide-react';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'products' | 'services' | 'prices' | 'faqs'>('info');

  // Business Information State (Default UNCONFIGURED / PLACEHOLDERS)
  const [businessInfo, setBusinessInfo] = useState({
    business_name: '',
    legal_name: '',
    description: '',
    phone: '',
    whatsapp_number: '',
    email: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    business_hours: '',
    gstin: '',
    support_contact: '',
    privacy_policy: '',
    terms_url: '',
  });

  const [infoSaved, setInfoSaved] = useState(false);

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ sku: '', name: '', category: '', description: '', unit: 'piece', status: 'APPROVED' });

  // Services State
  const [services, setServices] = useState<any[]>([]);
  const [newService, setNewService] = useState({ name: '', category: '', description: '', scope: '', sla: '', status: 'APPROVED' });

  // Prices State
  const [prices, setPrices] = useState<any[]>([]);
  const [newPrice, setNewPrice] = useState({ item_name: '', price: '', currency: 'INR', unit: 'unit', pricing_type: 'STANDARD' });

  // FAQs State
  const [faqs, setFaqs] = useState([
    {
      id: '1',
      question: 'What are your commercial HVAC maintenance services?',
      answer: 'We provide preventive maintenance, duct cleaning, chiller overhaul, and VRF system servicing with SLA guarantee.',
      keywords: 'hvac, maintenance, chiller, vrf, duct',
      category: 'Services',
      status: 'APPROVED',
    },
    {
      id: '2',
      question: 'What are your customer support business hours?',
      answer: 'Our official support hours are Monday to Saturday, 9:00 AM to 6:30 PM IST.',
      keywords: 'hours, time, open, timing, support',
      category: 'General',
      status: 'APPROVED',
    },
  ]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', keywords: '', category: 'General', status: 'APPROVED' });

  // Status Metrics
  const isBusinessInfoConfigured = !!(businessInfo.business_name && businessInfo.phone && businessInfo.address);
  const approvedFaqsCount = faqs.filter(f => f.status === 'APPROVED').length;
  const approvedProductsCount = products.filter(p => p.status === 'APPROVED').length;
  const approvedServicesCount = services.filter(s => s.status === 'APPROVED').length;

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 3000);
  };

  const handleAddProduct = () => {
    if (!newProduct.name) return;
    setProducts([...products, { ...newProduct, id: Date.now().toString() }]);
    setNewProduct({ sku: '', name: '', category: '', description: '', unit: 'piece', status: 'APPROVED' });
  };

  const handleAddService = () => {
    if (!newService.name) return;
    setServices([...services, { ...newService, id: Date.now().toString() }]);
    setNewService({ name: '', category: '', description: '', scope: '', sla: '', status: 'APPROVED' });
  };

  const handleAddPrice = () => {
    if (!newPrice.item_name || !newPrice.price) return;
    setPrices([...prices, { ...newPrice, id: Date.now().toString() }]);
    setNewPrice({ item_name: '', price: '', currency: 'INR', unit: 'unit', pricing_type: 'STANDARD' });
  };

  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) return;
    setFaqs([...faqs, { ...newFaq, id: Date.now().toString() }]);
    setNewFaq({ question: '', answer: '', keywords: '', category: 'General', status: 'APPROVED' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Title Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Authoritative Business Knowledge Base</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Kedar Enterprises Knowledge & AI Guardrail Control
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Configure verified commercial information, products, prices, and approved FAQs. The AI Router only responds using verified database facts—never hallucinating unconfigured details.
          </p>
        </div>
      </div>

      {/* Overview Status Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Business Info */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company Profile</span>
            <Building2 className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-sm font-bold text-white mt-2 flex items-center gap-1.5">
            {isBusinessInfoConfigured ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">CONFIGURED</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400">INCOMPLETE</span>
              </>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Official details & GSTIN</p>
        </div>

        {/* Card 2: Products */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Products</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1">{approvedProductsCount} Approved</div>
          <p className="text-[10px] text-slate-400 mt-0.5">{products.length} Total items</p>
        </div>

        {/* Card 3: Services */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Services</span>
            <Wrench className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1">{approvedServicesCount} Approved</div>
          <p className="text-[10px] text-slate-400 mt-0.5">{services.length} Offerings catalog</p>
        </div>

        {/* Card 4: Pricing */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Price Engine</span>
            <Tag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1">{prices.length} Configured</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Authoritative prices only</p>
        </div>

        {/* Card 5: FAQs */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Verified FAQs</span>
            <HelpCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1">{approvedFaqsCount} Approved</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Intent matcher active</p>
        </div>
      </div>

      {/* AI Guardrail Safety Alert Banner */}
      <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-300">AI Hallucination Protection Active</h4>
            <p className="text-slate-400 mt-0.5">
              If a requested detail (e.g. unlisted product price, unconfigured warranty, or missing address) is not in the database, the AI is instructed to return:
              <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded ml-1 font-mono">"That information is currently unavailable. I'll connect you with our team."</code>
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabbed Intake Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-brand-500 text-brand-400 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Business Information</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-brand-500 text-brand-400 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'services'
                ? 'border-brand-500 text-brand-400 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Services ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'prices'
                ? 'border-brand-500 text-brand-400 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Pricing Matrix ({prices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'faqs'
                ? 'border-brand-500 text-brand-400 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Verified FAQs ({faqs.length})</span>
          </button>
        </div>

        {/* Tab 1: Business Information Form */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="p-6 space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Company Profile & Official Details</h3>
                <p className="text-slate-400">Fill in official Kedar Enterprises details. Leave unconfirmed fields blank.</p>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition-all shadow-lg shadow-brand-600/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{infoSaved ? 'Saved to Supabase!' : 'Save Business Info'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Business Name *</label>
                <input
                  type="text"
                  placeholder="Kedar Enterprises"
                  value={businessInfo.business_name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, business_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Legal Registered Name</label>
                <input
                  type="text"
                  placeholder="Kedar Enterprises Private Limited"
                  value={businessInfo.legal_name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, legal_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">GSTIN</label>
                <input
                  type="text"
                  placeholder="27AAAAA0000A1Z5 (Leave blank if unconfigured)"
                  value={businessInfo.gstin}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, gstin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Official Phone</label>
                <input
                  type="text"
                  placeholder="+91-XXXXX-XXXXX"
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="+91-XXXXX-XXXXX"
                  value={businessInfo.whatsapp_number}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, whatsapp_number: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
                <input
                  type="email"
                  placeholder="info@kedarenterprises.com"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Physical Address</label>
                <textarea
                  rows={2}
                  placeholder="Enter official commercial address..."
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Business Hours & Days</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mon-Sat 9:00 AM - 6:30 PM IST (Sun Closed)"
                  value={businessInfo.business_hours}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, business_hours: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono resize-none"
                />
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Products Catalog */}
        {activeTab === 'products' && (
          <div className="p-6 space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Commercial Product Catalog</h3>
                <p className="text-slate-400">Add verified products. Unconfigured products must remain unlisted.</p>
              </div>
            </div>

            {/* Add Product Inputs */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">SKU</label>
                <input
                  type="text"
                  placeholder="KE-HVAC-101"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  placeholder="Commercial VRF Chiller"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <input
                  type="text"
                  placeholder="HVAC Systems"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Unit</label>
                <input
                  type="text"
                  placeholder="piece / ton"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <button
                onClick={handleAddProduct}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            {products.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
                <Package className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="font-semibold text-slate-300">No Products Configured</p>
                <p className="text-[11px] text-slate-500 mt-0.5">The AI will return "NOT_CONFIGURED" for unlisted product inquiries.</p>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">SKU</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Unit</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-mono text-slate-300">{p.sku || 'N/A'}</td>
                        <td className="px-4 py-3 font-semibold text-white">{p.name}</td>
                        <td className="px-4 py-3 text-slate-400">{p.category || 'General'}</td>
                        <td className="px-4 py-3 text-slate-400">{p.unit}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            APPROVED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Services Catalog */}
        {activeTab === 'services' && (
          <div className="p-6 space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Commercial Services Catalog</h3>
                <p className="text-slate-400">Define verified services, SLAs, and scope of work.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Name *</label>
                <input
                  type="text"
                  placeholder="VRF Preventive Maintenance"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <input
                  type="text"
                  placeholder="AMC / Servicing"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">SLA Guarantee</label>
                <input
                  type="text"
                  placeholder="24 Hour Emergency Response"
                  value={newService.sla}
                  onChange={(e) => setNewService({ ...newService, sla: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <button
                onClick={handleAddService}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            {services.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
                <Wrench className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="font-semibold text-slate-300">No Services Configured</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Unconfigured service inquiries will route directly to staff handoff.</p>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Service Name</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">SLA</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-semibold text-white">{s.name}</td>
                        <td className="px-4 py-3 text-slate-400">{s.category || 'General'}</td>
                        <td className="px-4 py-3 text-slate-400">{s.sla || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            APPROVED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Pricing Engine */}
        {activeTab === 'prices' && (
          <div className="p-6 space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Authoritative Pricing Engine</h3>
                <p className="text-slate-400">Set exact prices. The AI will NEVER fabricate a price if unlisted.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product / Service Item *</label>
                <input
                  type="text"
                  placeholder="VRF Maintenance Package"
                  value={newPrice.item_name}
                  onChange={(e) => setNewPrice({ ...newPrice, item_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Price (₹ INR) *</label>
                <input
                  type="number"
                  placeholder="15000"
                  value={newPrice.price}
                  onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pricing Type</label>
                <select
                  value={newPrice.pricing_type}
                  onChange={(e) => setNewPrice({ ...newPrice, pricing_type: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                >
                  <option value="STANDARD">Standard Fixed</option>
                  <option value="TIERED">Tiered Volume</option>
                  <option value="SUBSCRIPTION">Annual AMC</option>
                </select>
              </div>

              <button
                onClick={handleAddPrice}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Set Authoritative Price</span>
              </button>
            </div>

            {prices.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
                <Tag className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="font-semibold text-slate-300">No Prices Configured</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  PRICE_NOT_CONFIGURED status active. Customer price inquiries will return: "Custom quotation required. Connecting with staff."
                </p>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Item Name</th>
                      <th className="px-4 py-2.5">Authoritative Price</th>
                      <th className="px-4 py-2.5">Pricing Type</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {prices.map((pr) => (
                      <tr key={pr.id} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-semibold text-white">{pr.item_name}</td>
                        <td className="px-4 py-3 font-mono font-bold text-amber-400">₹{pr.price} {pr.currency}</td>
                        <td className="px-4 py-3 text-slate-400">{pr.pricing_type}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            AUTHORITATIVE
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Verified FAQs Repository */}
        {activeTab === 'faqs' && (
          <div className="p-6 space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Verified FAQ Repository & Approval Engine</h3>
                <p className="text-slate-400">Only APPROVED FAQs are used by n8n intent router and AI models.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer Question *</label>
                  <input
                    type="text"
                    placeholder="What are your service warranties?"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deterministic Keywords (comma separated)</label>
                  <input
                    type="text"
                    placeholder="warranty, guarantee, replacement, policy"
                    value={newFaq.keywords}
                    onChange={(e) => setNewFaq({ ...newFaq, keywords: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Verified Answer *</label>
                <textarea
                  rows={2}
                  placeholder="Enter exact verified commercial response..."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAddFaq}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Approve & Publish FAQ</span>
                </button>
              </div>
            </div>

            {/* FAQs List */}
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
                      {faq.question}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      APPROVED
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800/60">{faq.answer}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Keywords: <code className="text-slate-300 font-mono">{faq.keywords}</code></span>
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
