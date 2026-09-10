import React, { useState } from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { LabAppBadge } from '../common/LabAppBadge';
import { ColorSwatch } from '../common/ColorSwatch';
import { StatusBadge } from '../common/StatusBadge';
import { 
  X, 
  Layers, 
  Download,
  ArrowRight
} from 'lucide-react';
import { BulkOrder } from '../../types';

export const BulkOrdersView: React.FC = () => {
  const { 
    bulkOrders, 
    labApprovals, 
    productionBatches, 
    deliveryRecords, 
    openTraceFor,
    addToast
  } = useDyeFlow();

  const [customerFilter, setCustomerFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrawerOrder, setSelectedDrawerOrder] = useState<BulkOrder | null>(bulkOrders[0] || null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const customers = Array.from(new Set(bulkOrders.map(b => b.customer)));

  const totalVolumeKg = bulkOrders.reduce((sum, o) => sum + o.orderQtyKg, 0);

  const filteredOrders = bulkOrders.filter(order => {
    if (customerFilter !== 'ALL' && order.customer !== customerFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = 
        order.bulkOrderNo.toLowerCase().includes(q) ||
        order.labAppNo.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.colorName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenDrawer = (order: BulkOrder) => {
    setSelectedDrawerOrder(order);
    setIsDrawerOpen(true);
  };

  const linkedLab = labApprovals.find(l => l.labAppNo === selectedDrawerOrder?.labAppNo);
  const linkedProduction = productionBatches.find(p => p.bulkOrderNo === selectedDrawerOrder?.bulkOrderNo);
  const linkedDelivery = deliveryRecords.find(d => d.bulkOrderNo === selectedDrawerOrder?.bulkOrderNo);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Bulk Orders Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total Commercial Volume: <strong className="text-slate-900">{totalVolumeKg.toLocaleString()} KG</strong> across {bulkOrders.length} orders
          </p>
        </div>

        <button
          type="button"
          onClick={() => addToast({ type: 'success', title: 'Exported', message: 'Bulk register exported.' })}
          className="px-3.5 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Order No, Lab App, Customer..."
          className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 w-64 focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Customer:</span>
          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none"
          >
            <option value="ALL">All Customers</option>
            {customers.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Register */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-3 px-4">Bulk Order No</th>
                <th className="py-3 px-4">Lab App No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Colour</th>
                <th className="py-3 px-4">Fabric</th>
                <th className="py-3 px-4 text-right">Order Qty</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Req Delivery</th>
                <th className="py-3 px-4 text-center">Production</th>
                <th className="py-3 px-4 text-center">Delivery</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr 
                  key={order.bulkOrderNo}
                  onClick={() => handleOpenDrawer(order)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {order.bulkOrderNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <LabAppBadge labAppNo={order.labAppNo} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {order.customer}
                  </td>
                  <td className="py-3.5 px-4">
                    <ColorSwatch colorName={order.colorName} colorHex={order.colorHex} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono">
                    {order.fabric}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {order.orderQtyKg.toLocaleString()} KG
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {order.orderDate}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-800 font-semibold">
                    {order.requiredDeliveryDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={order.productionStatus} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={order.deliveryStatus} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDrawer(order);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white rounded text-xs font-medium transition-colors"
                    >
                      View Linkage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {isDrawerOpen && selectedDrawerOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-500">Order Detail</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedDrawerOrder.bulkOrderNo}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 4-Step Process Relationship */}
              <div className="mt-6 space-y-4 text-xs">
                
                {/* 1. LAB APPROVAL */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">1. LAB APPROVAL</span>
                    <LabAppBadge labAppNo={selectedDrawerOrder.labAppNo} size="sm" />
                  </div>
                  <div className="text-slate-600 font-mono text-[11px] pt-1">
                    {selectedDrawerOrder.customer} · {selectedDrawerOrder.colorName} ({selectedDrawerOrder.fabric})
                  </div>
                </div>

                <div className="text-center text-slate-400 font-bold">↓ linked relationship</div>

                {/* 2. BULK ORDER */}
                <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950">2. BULK ORDER</span>
                    <span className="font-mono font-bold text-indigo-900">{selectedDrawerOrder.bulkOrderNo}</span>
                  </div>
                  <div className="text-indigo-900 font-mono text-[11px] pt-1">
                    Order Quantity: <strong>{selectedDrawerOrder.orderQtyKg.toLocaleString()} KG</strong>
                  </div>
                </div>

                <div className="text-center text-slate-400 font-bold">↓ linked relationship</div>

                {/* 3. PRODUCTION */}
                <div className="p-3.5 rounded-lg bg-sky-50/70 border border-sky-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-950">3. PRODUCTION</span>
                    <StatusBadge status={selectedDrawerOrder.productionStatus} size="sm" />
                  </div>
                  <div className="text-sky-900 font-mono text-[11px] pt-1">
                    Batch Volume: <strong>{selectedDrawerOrder.orderQtyKg.toLocaleString()} KG</strong>
                  </div>
                </div>

                <div className="text-center text-slate-400 font-bold">↓ linked relationship</div>

                {/* 4. DELIVERY */}
                <div className="p-3.5 rounded-lg bg-teal-50/70 border border-teal-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-950">4. DELIVERY</span>
                    <StatusBadge status={selectedDrawerOrder.deliveryStatus} size="sm" />
                  </div>
                  <div className="text-teal-900 font-mono text-[11px] pt-1">
                    Required by: <strong>{selectedDrawerOrder.requiredDeliveryDate}</strong>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  openTraceFor(selectedDrawerOrder.labAppNo);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded"
              >
                Full Audit Trace →
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded text-xs text-slate-700"
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
