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
      <header className="sticky top-0 z-30 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#1e293b] flex items-center justify-center text-white font-bold text-base tracking-wider">
              JPM
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                JPM DyeFlow
              </span>
              <span className="text-xs text-slate-600 block leading-tight">
                Junior Processing Mills • Lab Sample & Bulk Order Reconciliation
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-300">
            <button
              type="button"
              onClick={() => { setActiveTab('dashboard'); setStatusFilter('all'); }}
              className={`px-3.5 py-1.5 rounded text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Summary & Overview
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('ldn-tracking'); setStatusFilter('all'); }}
              className={`px-3.5 py-1.5 rounded text-sm font-semibold transition-all ${
                activeTab === 'ldn-tracking'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All LDN Deliveries ({LDN_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('waiting-bulk'); }}
              className={`px-3.5 py-1.5 rounded text-sm font-semibold transition-all ${
                activeTab === 'waiting-bulk'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Bulk Orders ({SUMMARY_NUMBERS.waitingForBulk})
            </button>
          </nav>

          {/* Search Input */}
          <div className="w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search LDN, LRN, Customer..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-600 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        
        {/* Page Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'Lab Delivery to Bulk Order Reconciliation'}
              {activeTab === 'ldn-tracking' && 'Lab Delivery Register (LDN Outward)'}
              {activeTab === 'waiting-bulk' && 'Delivered Samples Awaiting Bulk Order'}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {activeTab === 'dashboard' && 'Status tracking of lab colour approvals converted into production bulk orders in ERP'}
              {activeTab === 'ldn-tracking' && 'Complete record of delivered lab samples and cross-verified ERP bulk order status'}
              {activeTab === 'waiting-bulk' && 'Samples delivered to customer where no corresponding bulk order has been logged yet'}
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono mt-2 sm:mt-0">
            System Data As of: 08 Sep 2026
          </div>
        </div>

        {/* Workflow Stepper: Authentic Industrial Process */}
        <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Workflow: Customer Sample to ERP Production
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Step 1: LRN */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                1
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900">LRN (Lab Receive)</div>
                <div className="text-[11px] text-slate-500">Fabric & colour swatch received</div>
              </div>
            </div>

            {/* Step 2: LAB */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                2
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900">Lab Processing</div>
                <div className="text-[11px] text-slate-500">Dye trial & shade recipe match</div>
              </div>
            </div>

            {/* Step 3: LDN */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                3
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900">LDN (Lab Delivery)</div>
                <div className="text-[11px] text-slate-500">Sample handed to customer</div>
              </div>
            </div>

            {/* Step 4: ERP BULK */}
            <div className="p-3 rounded border border-slate-300 bg-slate-100 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                4
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900">ERP Bulk Matching</div>
                <div className="text-[11px] text-slate-600">Cross-match with sales order</div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Core Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Delivered */}
          <div 
            onClick={() => { setActiveTab('ldn-tracking'); setStatusFilter('all'); }}
            className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs hover:border-slate-400 transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wide mb-1">
              Delivered Lab Samples (LDN)
            </div>
            <div className="text-3xl font-bold text-slate-900 font-mono">
              {SUMMARY_NUMBERS.ldnDelivered}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Sample lots sent outward
            </div>
          </div>

          {/* Card 2: Bulk Converted */}
          <div 
            onClick={() => { setActiveTab('ldn-tracking'); setStatusFilter('Bulk Order Found'); }}
            className="bg-white p-4 rounded-lg border border-slate-300 border-l-4 border-l-emerald-600 shadow-xs hover:border-slate-400 transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold uppercase text-emerald-800 tracking-wide mb-1">
              Bulk Orders Converted (ERP)
            </div>
            <div className="text-3xl font-bold text-emerald-700 font-mono">
              {SUMMARY_NUMBERS.bulkOrderFound}
            </div>
            <div className="text-xs text-emerald-800 font-medium mt-1">
              63% conversion rate to production
            </div>
          </div>

          {/* Card 3: Total Bulk Volume */}
          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wide mb-1">
              Confirmed Bulk Quantity
            </div>
            <div className="text-3xl font-bold text-slate-900 font-mono">
              1,25,000 <span className="text-base font-semibold text-slate-500">KG</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across 63 confirmed orders
            </div>
          </div>

          {/* Card 4: Awaiting Conversion */}
          <div 
            onClick={() => { setActiveTab('waiting-bulk'); }}
            className="bg-white p-4 rounded-lg border border-slate-300 border-l-4 border-l-amber-500 shadow-xs hover:border-slate-400 transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold uppercase text-amber-800 tracking-wide mb-1">
              Pending Bulk Order
            </div>
            <div className="text-3xl font-bold text-amber-700 font-mono">
              {SUMMARY_NUMBERS.waitingForBulk}
            </div>
            <div className="text-xs text-amber-800 font-medium mt-1">
              Follow-up required with buyers
            </div>
          </div>

        </div>

        {/* Analytics Breakdown Row (Dashboard Tab Only) */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Left 2 Cols: Customer Conversion Split */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-300 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Buyer-Wise Conversion Performance
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ratio of delivered lab samples that turned into production bulk orders
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {customerBreakdown.length} Accounts
                </span>
              </div>

              {/* Progress bars per customer */}
              <div className="space-y-3">
                {customerBreakdown.map((cust) => (
                  <div 
                    key={cust.customer}
                    onClick={() => { setCustomerFilter(customerFilter === cust.customer ? 'all' : cust.customer); }}
                    className={`p-3 rounded border transition-colors cursor-pointer ${
                      customerFilter === cust.customer
                        ? 'bg-blue-50/70 border-blue-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {cust.customer}
                        </span>
                        {cust.qty > 0 && (
                          <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                            {cust.qty.toLocaleString()} KG
                          </span>
                        )}
                      </div>
                      <div className="font-mono">
                        <span className="text-emerald-700 font-bold">{cust.converted} Ordered</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-600">{cust.total} Samples</span>
                        <span className="ml-2 font-bold text-slate-900">({cust.conversionRate}%)</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${cust.conversionRate}%` }}
                        className="bg-emerald-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Quick Status & Conversion Funnel Summary */}
            <div className="bg-white rounded-lg border border-slate-300 p-5 shadow-xs flex flex-col justify-between space-y-5">
              <div>
                <div className="pb-3 border-b border-slate-200">
                  <h2 className="text-base font-bold text-slate-900">
                    Commercial Conversion Rate
                  </h2>
                  <p className="text-xs text-slate-500">
                    Overall lab strike rate into ERP bulk
                  </p>
                </div>

                {/* Big Metric Box */}
                <div className="my-4 p-4 rounded bg-slate-50 border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Conversion Percentage
                  </div>
                  <div className="text-4xl font-bold text-slate-900 font-mono mt-1">
                    63.0%
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold mt-1">
                    63 Out of 100 Delivered LDNs
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      Bulk Orders Confirmed
                    </span>
                    <span className="font-bold text-slate-900 font-mono">63</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Pending Customer Order
                    </span>
                    <span className="font-bold text-slate-900 font-mono">37</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      Total Delivered Samples
                    </span>
                    <span className="font-bold text-slate-900 font-mono">100</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setActiveTab('waiting-bulk')}
                className="w-full py-2.5 px-4 rounded bg-[#1e293b] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <span>Review 37 Pending Samples</span>
                <ArrowRight className="w-3.5 h-3.5" />
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

          {/* Table Container */}
          <div className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 border-r border-slate-200">LDN Outward</th>
                    <th className="py-3 px-4 border-r border-slate-200">Buyer / Customer</th>
                    <th className="py-3 px-4 border-r border-slate-200">Colour Shade</th>
                    <th className="py-3 px-4 border-r border-slate-200">Fabric Quality</th>
                    <th className="py-3 px-4 border-r border-slate-200">Delivery Date</th>
                    {activeTab === 'waiting-bulk' ? (
                      <th className="py-3 px-4 border-r border-slate-200 text-center">Days Elapsed</th>
                    ) : (
                      <>
                        <th className="py-3 px-4 border-r border-slate-200">ERP Bulk Order</th>
                        <th className="py-3 px-4 border-r border-slate-200 text-right">Order Qty</th>
                      </>
                    )}
                    <th className="py-3 px-4 border-r border-slate-200 text-center">ERP Status</th>
                    <th className="py-3 px-4 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-slate-500">
                        No records found matching criteria.
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
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 border-r border-slate-100">
                          {item.ldnNo}
                          <span className="block text-[11px] font-normal text-slate-500">{item.lrnNo}</span>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900 border-r border-slate-100">
                          {item.customer}
                          <span className="block text-[11px] font-normal text-slate-500 font-mono">App: {item.labAppNo}</span>
                        </td>

                        {/* Colour */}
                        <td className="py-3.5 px-4 text-slate-900 border-r border-slate-100">
                          <div className="flex items-center gap-2">
                            {item.colorHex && (
                              <span 
                                className="w-3.5 h-3.5 rounded border border-slate-400 shrink-0" 
                                style={{ backgroundColor: item.colorHex }} 
                              />
                            )}
                            <span className="font-medium text-xs">{item.colorName}</span>
                          </div>
                        </td>

                        {/* Fabric */}
                        <td className="py-3.5 px-4 text-slate-700 text-xs border-r border-slate-100">
                          {item.fabric}
                        </td>

                        {/* Delivered Date */}
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-xs border-r border-slate-100">
                          {item.deliveredDate}
                        </td>

                        {activeTab === 'waiting-bulk' ? (
                          <td className="py-3.5 px-4 text-center font-mono text-amber-800 font-bold text-xs border-r border-slate-100">
                            {item.daysWaiting} Days
                          </td>
                        ) : (
                          <>
                            <td className="py-3.5 px-4 font-mono text-xs border-r border-slate-100">
                              {item.bulkOrderNo ? (
                                <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  {item.bulkOrderNo}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-xs border-r border-slate-100">
                              {item.bulkQty || '—'}
                            </td>
                          </>
                        )}

                        {/* Result with simple clean indicator */}
                        <td className="py-3.5 px-4 text-center border-r border-slate-100">
                          {item.result === 'Bulk Order Found' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Bulk Converted
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                              Pending Order
                            </span>
                          )}
                        </td>

                        {/* Action View */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors text-xs font-semibold"
                          >
                            Details
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

      {/* Industrial Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-400 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in duration-100">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                  SAMPLE RECONCILIATION RECORD
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                  {selectedItem.ldnNo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Attributes */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded border border-slate-300">
              <div>
                <span className="text-slate-500 block">Buyer / Customer</span>
                <strong className="text-slate-900 text-sm block mt-0.5">{selectedItem.customer}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Colour / Shade</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {selectedItem.colorHex && (
                    <span className="w-3.5 h-3.5 rounded border border-slate-400 shrink-0" style={{ backgroundColor: selectedItem.colorHex }} />
                  )}
                  <strong className="text-slate-900 text-sm">{selectedItem.colorName}</strong>
                </div>
              </div>
              <div>
                <span className="text-slate-500 block">Fabric Quality</span>
                <strong className="text-slate-900 block mt-0.5">{selectedItem.fabric}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Lab Approval Ref</span>
                <strong className="text-slate-900 font-mono block mt-0.5">{selectedItem.labAppNo}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Delivered Date</span>
                <strong className="text-slate-800 font-mono block mt-0.5">{selectedItem.deliveredDate}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Time Elapsed</span>
                <strong className="text-slate-800 font-mono block mt-0.5">{selectedItem.daysWaiting} Days ago</strong>
              </div>
            </div>

            {/* Process Flow Audit */}
            <div className="p-4 bg-white border border-slate-200 rounded space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="font-bold text-slate-900">Stage 1: LRN Inward</span>
                  <div className="text-slate-500 text-[11px]">Lab Received ({selectedItem.lrnNo})</div>
                </div>
                <span className="text-emerald-700 font-semibold font-mono text-[11px]">Received ✓</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="font-bold text-slate-900">Stage 2: LDN Outward</span>
                  <div className="text-slate-500 text-[11px]">Sample Delivered ({selectedItem.ldnNo})</div>
                </div>
                <span className="text-emerald-700 font-semibold font-mono text-[11px]">Delivered ✓</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">Stage 3: ERP Bulk Order</span>
                  <div className="text-slate-500 text-[11px]">
                    {selectedItem.result === 'Bulk Order Found' ? 'Matched with Sales Order in ERP' : 'Pending Sales Order Entry'}
                  </div>
                </div>
                {selectedItem.result === 'Bulk Order Found' ? (
                  <span className="text-emerald-700 font-bold font-mono text-[11px]">Matched ✓</span>
                ) : (
                  <span className="text-amber-700 font-bold font-mono text-[11px]">Waiting...</span>
                )}
              </div>
            </div>

            {/* Result Box */}
            {selectedItem.result === 'Bulk Order Found' ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs">
                <div className="font-bold text-emerald-900">
                  Bulk Order Reconciled in ERP
                </div>
                <div className="mt-1 text-slate-800 font-mono">
                  Order No: <strong>{selectedItem.bulkOrderNo}</strong> | Quantity: <strong>{selectedItem.bulkQty}</strong>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs">
                <div className="font-bold text-amber-900">
                  Pending Bulk Order Placement
                </div>
                <div className="text-amber-800 mt-1">
                  Delivered {selectedItem.daysWaiting} days ago. Commercial order not logged in ERP.
                </div>
              </div>
            )}

            {/* Footer Action */}
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded transition-colors"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default App;
