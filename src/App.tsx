import React, { useState, useMemo } from 'react';
import { LdnItem, NavTab } from './types';
import { LDN_DATA, SUMMARY_NUMBERS } from './data/mockData';
import { 
  Search, 
  X, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  Clock, 
  Check,
  TrendingUp,
  Package,
  Building2,
  Layers,
  ChevronRight
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<LdnItem | null>(null);
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Bulk Order Found' | 'Waiting'>('all');

  // Customer conversion statistics breakdown
  const customerBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; converted: number; waiting: number; qty: number }>();
    
    LDN_DATA.forEach(item => {
      const current = map.get(item.customer) || { total: 0, converted: 0, waiting: 0, qty: 0 };
      current.total += 1;
      if (item.result === 'Bulk Order Found') {
        current.converted += 1;
        const qtyNum = item.bulkQty ? parseInt(item.bulkQty.replace(/[^0-9]/g, ''), 10) : 0;
        current.qty += qtyNum;
      } else {
        current.waiting += 1;
      }
      map.set(item.customer, current);
    });

    return Array.from(map.entries()).map(([customer, stats]) => ({
      customer,
      ...stats,
      conversionRate: Math.round((stats.converted / stats.total) * 100)
    })).sort((a, b) => b.total - a.total);
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    let list = LDN_DATA;
    if (activeTab === 'waiting-bulk') {
      list = list.filter(item => item.result === 'Waiting');
    } else if (statusFilter !== 'all') {
      list = list.filter(item => item.result === statusFilter);
    }

    if (customerFilter !== 'all') {
      list = list.filter(item => item.customer === customerFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.customer.toLowerCase().includes(q) ||
        item.ldnNo.toLowerCase().includes(q) ||
        item.lrnNo.toLowerCase().includes(q) ||
        item.labAppNo.toLowerCase().includes(q) ||
        item.colorName.toLowerCase().includes(q) ||
        (item.bulkOrderNo && item.bulkOrderNo.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeTab, statusFilter, customerFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
          
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-extrabold text-lg shadow-sm">
              JP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-950">
                  JPM DyeFlow
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  Executive Suite
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Junior Processing Mills • Lab to ERP Bulk Conversion
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => { setActiveTab('dashboard'); setStatusFilter('all'); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Executive Dashboard
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('ldn-tracking'); setStatusFilter('all'); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'ldn-tracking'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              LDN Registry ({LDN_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('waiting-bulk'); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'waiting-bulk'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Awaiting Bulk ({SUMMARY_NUMBERS.waitingForBulk})
            </button>
          </nav>

          {/* Search Input */}
          <div className="w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search LDN, LRN, Customer, Color..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-7 space-y-7">
        
        {/* Page Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {activeTab === 'dashboard' && 'JPM DyeFlow'}
            {activeTab === 'ldn-tracking' && 'LDN Tracking'}
            {activeTab === 'waiting-bulk' && 'Waiting for Bulk Order'}
          </h1>
          <p className="text-sm text-slate-500">
            {activeTab === 'dashboard' && 'From Lab Sample to Bulk Order'}
            {activeTab === 'ldn-tracking' && 'Complete record of delivered lab samples and bulk status'}
            {activeTab === 'waiting-bulk' && 'Delivered samples where no matching ERP bulk order is found'}
          </p>
        </div>

        {/* Top Workflow Banner: Visual Pipeline */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                CORE BUSINESS PIPELINE
              </span>
              <h2 className="text-xl font-bold text-slate-950">
                Customer Sample Receipt → Lab Processing → Delivery → ERP Bulk Conversion
              </h2>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live ERP Synced
              </span>
            </div>
          </div>

          {/* Pipeline Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            
            {/* Step 1: LRN */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-extrabold text-sm shrink-0">
                LRN
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Stage 01</div>
                <div className="text-sm font-extrabold text-slate-900 truncate">Lab Receive</div>
                <div className="text-xs text-slate-500">Customer colour input</div>
              </div>
            </div>

            {/* Step 2: LAB */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-indigo-900 text-indigo-200 flex items-center justify-center font-mono font-extrabold text-sm shrink-0">
                LAB
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Stage 02</div>
                <div className="text-sm font-extrabold text-slate-900 truncate">Dyeing & Approval</div>
                <div className="text-xs text-slate-500">Recipe trial matching</div>
              </div>
            </div>

            {/* Step 3: LDN */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-blue-200 flex items-center justify-center font-mono font-extrabold text-sm shrink-0">
                LDN
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Stage 03</div>
                <div className="text-sm font-extrabold text-slate-900 truncate">Lab Delivery Note</div>
                <div className="text-xs text-slate-500">Handed to customer</div>
              </div>
            </div>

            {/* Step 4: ERP BULK */}
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-800 text-emerald-100 flex items-center justify-center font-mono font-extrabold text-sm shrink-0">
                ERP
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Goal</div>
                <div className="text-sm font-extrabold text-emerald-950 truncate">Bulk Order Check</div>
                <div className="text-xs text-emerald-700">63% Conversion Rate</div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Interactive KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Total Delivered */}
          <div 
            onClick={() => { setActiveTab('ldn-tracking'); setStatusFilter('all'); }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Samples Delivered
              </span>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-slate-950 font-mono tracking-tight mb-1">
              {SUMMARY_NUMBERS.ldnDelivered}
            </div>
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              Delivered via LDN outward
            </div>
          </div>

          {/* Card 2: Bulk Converted */}
          <div 
            onClick={() => { setActiveTab('ldn-tracking'); setStatusFilter('Bulk Order Found'); }}
            className="bg-white p-5 rounded-2xl border border-emerald-200/90 shadow-sm hover:border-emerald-300 transition-all cursor-pointer group bg-gradient-to-br from-white to-emerald-50/20"
          >
            <div className="flex items-center justify-between text-emerald-700 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Bulk Orders Converted
              </span>
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-emerald-700 font-mono tracking-tight mb-1">
              {SUMMARY_NUMBERS.bulkOrderFound}
            </div>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              63% conversion into ERP Bulk
            </div>
          </div>

          {/* Card 3: Total Bulk Volume */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200/90 shadow-sm hover:border-blue-300 transition-all group bg-gradient-to-br from-white to-blue-50/20">
            <div className="flex items-center justify-between text-blue-700 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Total Bulk Volume
              </span>
              <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-blue-800 font-mono tracking-tight mb-1">
              1,25,000 <span className="text-xl font-bold text-blue-600">KG</span>
            </div>
            <div className="text-xs font-bold text-blue-700">
              Generated from approved LDNs
            </div>
          </div>

          {/* Card 4: Awaiting Conversion */}
          <div 
            onClick={() => { setActiveTab('waiting-bulk'); }}
            className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-sm hover:border-amber-300 transition-all cursor-pointer group bg-gradient-to-br from-white to-amber-50/20"
          >
            <div className="flex items-center justify-between text-amber-700 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Awaiting Bulk Order
              </span>
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-amber-700 font-mono tracking-tight mb-1">
              {SUMMARY_NUMBERS.waitingForBulk}
            </div>
            <div className="text-xs font-bold text-amber-700">
              Samples handed, awaiting order
            </div>
          </div>

        </div>

        {/* Analytics Breakdown Row (Dashboard Tab Only) */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Customer Conversion Split Cards */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Customer Conversion Performance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ratio of delivered lab samples that generated bulk production orders
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {customerBreakdown.length} Active Accounts
                </span>
              </div>

              {/* Progress bars per customer */}
              <div className="space-y-4 pt-2">
                {customerBreakdown.map((cust) => (
                  <div 
                    key={cust.customer}
                    onClick={() => { setCustomerFilter(customerFilter === cust.customer ? 'all' : cust.customer); }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      customerFilter === cust.customer
                        ? 'bg-blue-50/50 border-blue-300 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-extrabold text-slate-900">
                          {cust.customer}
                        </span>
                        {cust.qty > 0 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {cust.qty.toLocaleString()} KG
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold font-mono">
                        <span className="text-emerald-700">{cust.converted} Converted</span>
                        <span className="text-slate-400 mx-1.5">/</span>
                        <span className="text-slate-600">{cust.total} Samples</span>
                        <span className="ml-2 text-slate-900 font-extrabold">({cust.conversionRate}%)</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${cust.conversionRate}%` }}
                        className="bg-emerald-600 rounded-full transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Quick Status & Conversion Funnel Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Conversion Summary
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Overall strike rate of lab development
                </p>

                {/* Big Visual Donut / Metric */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center mb-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Overall Conversion Rate
                  </div>
                  <div className="text-5xl font-black text-slate-950 font-mono tracking-tight">
                    63.0%
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> High Commercial Efficiency
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      Bulk Confirmed
                    </span>
                    <span className="font-bold text-slate-900 font-mono">63 Samples</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      Pending Follow-up
                    </span>
                    <span className="font-bold text-slate-900 font-mono">37 Samples</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2">
                    <span className="text-slate-600 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      Total Delivered
                    </span>
                    <span className="font-bold text-slate-900 font-mono">100 Samples</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setActiveTab('waiting-bulk')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>View 37 Pending Samples</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Data Grid Section */}
        <div className="space-y-4">
          
          {/* Header Controls for Table */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-950 flex items-center gap-2.5">
                {activeTab === 'waiting-bulk' ? 'Samples Awaiting Bulk Order' : 'Delivered Samples & Bulk Order Match'}
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-mono">
                  {filteredData.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {activeTab === 'waiting-bulk' 
                  ? 'LDNs delivered to customers where no Bulk Order has been logged in ERP yet'
                  : 'Full registry matching lab delivery note (LDN) with ERP Bulk Order records'}
              </p>
            </div>

            {/* Quick Filter Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {customerFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setCustomerFilter('all')}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-900 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Customer: {customerFilter}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {activeTab !== 'waiting-bulk' && (
                <div className="inline-flex rounded-lg border border-slate-300 p-1 bg-white text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      statusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({LDN_DATA.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Bulk Order Found')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      statusFilter === 'Bulk Order Found' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Matched Bulk
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Waiting')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      statusFilter === 'Waiting' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Waiting
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold text-xs uppercase tracking-wider">
                    <th className="py-4 px-5">LDN Number</th>
                    <th className="py-4 px-5">Customer Name</th>
                    <th className="py-4 px-5">Colour / Shade</th>
                    <th className="py-4 px-5">Fabric Type</th>
                    <th className="py-4 px-5">Delivered Date</th>
                    {activeTab === 'waiting-bulk' ? (
                      <th className="py-4 px-5 text-center">Days Waiting</th>
                    ) : (
                      <>
                        <th className="py-4 px-5">ERP Bulk Order</th>
                        <th className="py-4 px-5 text-right">Order Qty</th>
                      </>
                    )}
                    <th className="py-4 px-5 text-center">ERP Match Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-slate-500">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.ldnNo}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      {/* LDN No */}
                      <td className="py-4 px-5 font-mono font-bold text-slate-900">
                        {item.ldnNo}
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-5 font-bold text-slate-900">
                        {item.customer}
                      </td>

                      {/* Colour */}
                      <td className="py-4 px-5 text-slate-900">
                        <div className="flex items-center gap-2.5">
                          {item.colorHex && (
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner shrink-0" 
                              style={{ backgroundColor: item.colorHex }} 
                            />
                          )}
                          <span className="font-medium">{item.colorName}</span>
                        </div>
                      </td>

                      {/* Fabric */}
                      <td className="py-4 px-5 text-slate-600 font-medium">
                        {item.fabric}
                      </td>

                      {/* Delivered Date */}
                      <td className="py-4 px-5 text-slate-500 font-mono">
                        {item.deliveredDate}
                      </td>

                      {activeTab === 'waiting-bulk' ? (
                        <td className="py-4 px-5 text-center font-mono text-amber-700 font-bold">
                          {item.daysWaiting} Days
                        </td>
                      ) : (
                        <>
                          <td className="py-4 px-5 font-mono font-bold text-slate-900">
                            {item.bulkOrderNo || '—'}
                          </td>
                          <td className="py-4 px-5 text-right font-mono font-bold text-slate-900">
                            {item.bulkQty || '—'}
                          </td>
                        </>
                      )}

                      {/* Result with simple clean indicator */}
                      <td className="py-4 px-5 text-center">
                        {item.result === 'Bulk Order Found' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Bulk Order Found
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/90 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Waiting
                          </span>
                        )}
                      </td>

                      {/* Action View */}
                      <td className="py-4 px-5 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all inline-flex items-center gap-1 text-xs font-bold"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>

      </main>

      {/* Clean Detail View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-7 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  LDN SAMPLE DETAIL
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">
                  {selectedItem.ldnNo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Attributes */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 text-xs block font-medium">Customer</span>
                <strong className="text-slate-900 text-sm block mt-0.5">{selectedItem.customer}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-xs block font-medium">Colour</span>
                <div className="flex items-center gap-2 mt-0.5">
                  {selectedItem.colorHex && (
                    <span className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner shrink-0" style={{ backgroundColor: selectedItem.colorHex }} />
                  )}
                  <strong className="text-slate-900 text-sm">{selectedItem.colorName}</strong>
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-xs block font-medium">Fabric</span>
                <strong className="text-slate-900 text-sm block mt-0.5">{selectedItem.fabric}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-xs block font-medium">Lab App No</span>
                <strong className="text-slate-900 font-mono text-sm block mt-0.5">{selectedItem.labAppNo}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-xs block font-medium">Delivered Date</span>
                <strong className="text-slate-700 font-mono text-sm block mt-0.5">{selectedItem.deliveredDate}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-xs block font-medium">Elapsed</span>
                <strong className="text-slate-700 font-mono text-sm block mt-0.5">{selectedItem.daysWaiting} Days ago</strong>
              </div>
            </div>

            {/* The Critical Process Relationship */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3.5 text-sm">
              
              {/* LRN */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">LRN</div>
                  <div className="text-slate-500 text-xs mt-0.5">Customer Sample Received ({selectedItem.lrnNo})</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* LDN */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">LDN</div>
                  <div className="text-slate-500 text-xs mt-0.5">Sample Delivered to Customer ({selectedItem.ldnNo})</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* ERP */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">ERP</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {selectedItem.result === 'Bulk Order Found' ? 'Bulk Order Found in ERP' : 'Checking ERP Ledger'}
                  </div>
                </div>
                {selectedItem.result === 'Bulk Order Found' ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

            </div>

            {/* Result Box */}
            {selectedItem.result === 'Bulk Order Found' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✓ Bulk Order Found</span>
                </div>
                <div className="text-slate-800 font-mono pt-1 text-sm">
                  Bulk Order: <strong className="text-slate-950">{selectedItem.bulkOrderNo}</strong>
                </div>
                <div className="text-slate-800 font-mono text-sm">
                  Bulk Quantity: <strong className="text-slate-950">{selectedItem.bulkQty}</strong>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-sm">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Waiting for Bulk Order</span>
                </div>
                <div className="text-amber-800 text-xs leading-relaxed mt-1">
                  Sample delivered {selectedItem.daysWaiting} days ago. No bulk order has been entered into ERP yet.
                </div>
              </div>
            )}

            {/* Footer Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default App;
