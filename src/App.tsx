import React, { useState, useMemo } from 'react';
import { LdnItem, NavTab } from './types';
import { LDN_DATA, SUMMARY_NUMBERS } from './data/mockData';
import { Search, X, ArrowRight, ArrowDown, CheckCircle2, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] flex flex-col antialiased">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#e5e5ea]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0066cc]" />
            <span className="font-semibold text-sm tracking-tight text-[#1d1d1f]">
              JPM DyeFlow
            </span>
          </div>

          {/* Navigation - Extremely minimal */}
          <nav className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[#f5f5f7] font-semibold text-[#1d1d1f]'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ldn-tracking')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'ldn-tracking'
                  ? 'bg-[#f5f5f7] font-semibold text-[#1d1d1f]'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              LDN Tracking
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('waiting-bulk')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'waiting-bulk'
                  ? 'bg-[#f5f5f7] font-semibold text-[#1d1d1f]'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Waiting for Bulk Order
            </button>
          </nav>

          {/* Search */}
          <div className="w-64 relative">
            <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Customer, LRN, LDN, Colour..."
              className="w-full pl-8 pr-7 py-1.5 bg-[#f5f5f7] border border-transparent rounded-md text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#d2d2d7] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-[#86868b] hover:text-[#1d1d1f]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
            {activeTab === 'dashboard' && 'JPM DyeFlow'}
            {activeTab === 'ldn-tracking' && 'LDN Tracking'}
            {activeTab === 'waiting-bulk' && 'Waiting for Bulk Order'}
          </h1>
          <p className="text-xs text-[#86868b]">
            {activeTab === 'dashboard' && 'From Lab Sample to Bulk Order'}
            {activeTab === 'ldn-tracking' && 'Complete record of delivered lab samples and bulk status'}
            {activeTab === 'waiting-bulk' && 'Delivered samples where no matching ERP bulk order is found'}
          </p>
        </div>

        {/* Apple-style Simple Process Indicator (Visible on Dashboard & Tracking) */}
        {activeTab === 'dashboard' && (
          <div className="py-3 px-4 bg-white border border-[#e5e5ea] rounded-lg">
            <div className="flex items-center justify-between text-xs text-[#86868b]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1d1d1f]">LRN</span>
                <span>Received</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#d2d2d7]" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1d1d1f]">LAB</span>
                <span>Processed</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#d2d2d7]" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1d1d1f]">LDN</span>
                <span>Delivered</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#d2d2d7]" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0066cc]">ERP</span>
                <span className="font-medium text-[#0066cc]">Bulk Order Check</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Question & Key Figures (Dashboard only) */}
        {activeTab === 'dashboard' && (
          <div className="py-6 px-6 bg-white border border-[#e5e5ea] rounded-lg space-y-6">
            <div>
              <span className="text-[11px] font-medium tracking-wide uppercase text-[#86868b] block mb-1">
                Main Question
              </span>
              <h2 className="text-lg font-semibold text-[#1d1d1f]">
                Did the delivered sample become a Bulk Order?
              </h2>
            </div>

            {/* Simple Numbers - Clean Apple style */}
            <div className="grid grid-cols-3 gap-6 pt-2 border-t border-[#f2f2f5]">
              <div>
                <div className="text-xs text-[#86868b] mb-1">LDN Delivered</div>
                <div className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                  {SUMMARY_NUMBERS.ldnDelivered}
                </div>
              </div>

              <div>
                <div className="text-xs text-[#86868b] mb-1">Bulk Order Found</div>
                <div className="text-2xl font-bold tracking-tight text-[#34c759]">
                  {SUMMARY_NUMBERS.bulkOrderFound}
                </div>
              </div>

              <div>
                <div className="text-xs text-[#86868b] mb-1">Waiting for Bulk Order</div>
                <div className="text-2xl font-bold tracking-tight text-[#ff9500]">
                  {SUMMARY_NUMBERS.waitingForBulk}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Table Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-semibold text-[#1d1d1f] tracking-tight uppercase text-[11px] text-[#86868b]">
              {activeTab === 'waiting-bulk' ? 'DELIVERED SAMPLES AWAITING BULK ORDER' : 'LDN → BULK ORDER CHECK'}
            </h3>
            <span className="text-[#86868b]">
              {filteredData.length} records
            </span>
          </div>

          <div className="bg-white border border-[#e5e5ea] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e5e5ea] text-[#86868b] font-medium bg-[#fafafa]">
                  <th className="py-2.5 px-4">LDN No</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Colour</th>
                  <th className="py-2.5 px-4">Fabric</th>
                  <th className="py-2.5 px-4">Delivered Date</th>
                  {activeTab === 'waiting-bulk' ? (
                    <th className="py-2.5 px-4 text-center">Days Waiting</th>
                  ) : (
                    <>
                      <th className="py-2.5 px-4">Bulk Order</th>
                      <th className="py-2.5 px-4 text-right">Bulk Qty</th>
                    </>
                  )}
                  <th className="py-2.5 px-4">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f5]">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-[#86868b]">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.ldnNo}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-[#f5f5f7] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-[#1d1d1f]">
                        {item.ldnNo}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#1d1d1f]">
                        {item.customer}
                      </td>
                      <td className="py-3 px-4 text-[#1d1d1f]">
                        {item.colorName}
                      </td>
                      <td className="py-3 px-4 text-[#86868b]">
                        {item.fabric}
                      </td>
                      <td className="py-3 px-4 text-[#86868b] font-mono">
                        {item.deliveredDate}
                      </td>

                      {activeTab === 'waiting-bulk' ? (
                        <td className="py-3 px-4 text-center font-mono text-[#ff9500] font-medium">
                          {item.daysWaiting} Days
                        </td>
                      ) : (
                        <>
                          <td className="py-3 px-4 font-mono text-[#1d1d1f]">
                            {item.bulkOrderNo || '—'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-[#1d1d1f]">
                            {item.bulkQty || '—'}
                          </td>
                        </>
                      )}

                      {/* Result with simple dot indicator */}
                      <td className="py-3 px-4">
                        {item.result === 'Bulk Order Found' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[#34c759] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                            <span>Bulk Order Found</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[#ff9500] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9500]" />
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

      {/* Simple Detail Panel / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e5e5ea] shadow-xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-100">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea]">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] font-mono">
                  {selectedItem.ldnNo}
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Delivered: {selectedItem.deliveredDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-md text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simple Information Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#f2f2f5]">
                <span className="text-[#86868b]">Customer</span>
                <span className="font-semibold text-[#1d1d1f]">{selectedItem.customer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f2f2f5]">
                <span className="text-[#86868b]">Colour</span>
                <span className="font-medium text-[#1d1d1f]">{selectedItem.colorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f2f2f5]">
                <span className="text-[#86868b]">Fabric</span>
                <span className="text-[#1d1d1f]">{selectedItem.fabric}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f2f2f5]">
                <span className="text-[#86868b]">Lab App No</span>
                <span className="font-mono text-[#1d1d1f]">{selectedItem.labAppNo}</span>
              </div>
            </div>

            {/* Core Relationship (LRN → LDN → ERP) */}
            <div className="p-4 bg-[#fbfbfd] border border-[#e5e5ea] rounded-lg space-y-3 text-xs">
              
              {/* LRN */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1d1d1f]">LRN</div>
                  <div className="text-[#86868b] text-[11px]">Customer Sample Received ({selectedItem.lrnNo})</div>
                </div>
                <span className="text-[#34c759] text-xs font-bold">✓</span>
              </div>

              <div className="flex justify-center text-[#d2d2d7]">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>

              {/* LDN */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1d1d1f]">LDN</div>
                  <div className="text-[#86868b] text-[11px]">Sample Delivered ({selectedItem.ldnNo})</div>
                </div>
                <span className="text-[#34c759] text-xs font-bold">✓</span>
              </div>

              <div className="flex justify-center text-[#d2d2d7]">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>

              {/* ERP */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1d1d1f]">ERP</div>
                  <div className="text-[#86868b] text-[11px]">
                    {selectedItem.result === 'Bulk Order Found' ? 'Bulk Order Found' : 'Bulk Order Pending'}
                  </div>
                </div>
                {selectedItem.result === 'Bulk Order Found' ? (
                  <span className="text-[#34c759] text-xs font-bold">✓</span>
                ) : (
                  <span className="text-[#ff9500] text-xs font-bold">⏳</span>
                )}
              </div>

            </div>

            {/* Result & Bulk Order info */}
            {selectedItem.result === 'Bulk Order Found' ? (
              <div className="p-3 bg-[#eafaf1] border border-[#a3e9b9] rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#1e7e34] font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bulk Order Found</span>
                </div>
                <div className="font-mono text-[#1d1d1f] pt-1">
                  Bulk Order: <strong>{selectedItem.bulkOrderNo}</strong>
                </div>
                <div className="font-mono text-[#1d1d1f]">
                  Bulk Quantity: <strong>{selectedItem.bulkQty}</strong>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#fff8ec] border border-[#ffe0b2] rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#b78103] font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Waiting for Bulk Order</span>
                </div>
                <div className="text-[#7c5e10] text-[11px]">
                  Sample delivered {selectedItem.daysWaiting} days ago. No bulk order has been entered in ERP yet.
                </div>
              </div>
            )}

            {/* Close */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] font-medium text-xs rounded-md transition-colors"
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
