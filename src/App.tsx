import React, { useState, useMemo } from 'react';
import { LdnItem, NavTab } from './types';
import { LDN_DATA, SUMMARY_NUMBERS } from './data/mockData';
import { Search, X, ArrowRight, ArrowDown, CheckCircle2, Clock, Check } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<LdnItem | null>(null);

  // Filtered dataset
  const filteredData = useMemo(() => {
    let list = LDN_DATA;
    if (activeTab === 'waiting-bulk') {
      list = list.filter(item => item.result === 'Waiting');
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
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
                JPM DyeFlow
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                Junior Processing Mills
              </span>
            </div>
          </div>

          {/* Navigation - Clean, Clear & Sized Comfortably */}
          <nav className="flex items-center gap-1.5 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ldn-tracking')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'ldn-tracking'
                  ? 'bg-slate-100 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              LDN Tracking
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('waiting-bulk')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'waiting-bulk'
                  ? 'bg-slate-100 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Waiting for Bulk Order
            </button>
          </nav>

          {/* Search - Comfortable size & readable */}
          <div className="w-72 relative shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Customer, LRN, LDN, Colour..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white transition-all"
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        
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

        {/* Process Indicator (Apple-style clean process flow) */}
        {activeTab === 'dashboard' && (
          <div className="py-4 px-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between text-sm font-medium">
              
              {/* LRN */}
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono font-bold text-xs">
                  LRN
                </span>
                <span className="text-slate-900 font-semibold">Received</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300" />

              {/* LAB */}
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono font-bold text-xs">
                  LAB
                </span>
                <span className="text-slate-900 font-semibold">Processed</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300" />

              {/* LDN */}
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono font-bold text-xs">
                  LDN
                </span>
                <span className="text-slate-900 font-semibold">Delivered</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300" />

              {/* ERP */}
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-blue-700 text-white font-mono font-bold text-xs">
                  ERP
                </span>
                <span className="text-blue-700 font-bold">Bulk Order Check</span>
              </div>

            </div>
          </div>
        )}

        {/* Main Question & 3 Core Numbers (Dashboard only) */}
        {activeTab === 'dashboard' && (
          <div className="py-7 px-7 bg-white border border-slate-200 rounded-xl shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400 block mb-1 font-mono">
                MAIN PURPOSE
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Did the delivered sample become a Bulk Order?
              </h2>
            </div>

            {/* Clear Big Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-slate-100">
              
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">
                  LDN Delivered
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
                  {SUMMARY_NUMBERS.ldnDelivered}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">
                  Bulk Order Found
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-emerald-600 font-mono">
                  {SUMMARY_NUMBERS.bulkOrderFound}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">
                  Waiting for Bulk Order
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-amber-600 font-mono">
                  {SUMMARY_NUMBERS.waitingForBulk}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Main Table Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>
              {activeTab === 'waiting-bulk' ? 'DELIVERED SAMPLES AWAITING BULK ORDER' : 'LDN → BULK ORDER CHECK'}
            </span>
            <span>
              {filteredData.length} records
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-xs tracking-wider uppercase bg-slate-50">
                  <th className="py-3.5 px-5">LDN No</th>
                  <th className="py-3.5 px-5">Customer</th>
                  <th className="py-3.5 px-5">Colour</th>
                  <th className="py-3.5 px-5">Fabric</th>
                  <th className="py-3.5 px-5">Delivered Date</th>
                  {activeTab === 'waiting-bulk' ? (
                    <th className="py-3.5 px-5 text-center">Days Waiting</th>
                  ) : (
                    <>
                      <th className="py-3.5 px-5">Bulk Order</th>
                      <th className="py-3.5 px-5 text-right">Bulk Qty</th>
                    </>
                  )}
                  <th className="py-3.5 px-5">Result</th>
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
                      <td className="py-4 px-5">
                        {item.result === 'Bulk Order Found' ? (
                          <span className="inline-flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Bulk Order Found</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-sm text-amber-700 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>Waiting</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
