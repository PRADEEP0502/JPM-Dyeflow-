import React, { useState } from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, Phone, AlertCircle } from 'lucide-react';

export const PendingBulkView: React.FC = () => {
  const { ldnRecords, openDetailFor } = useDyeFlow();
  const [customerFilter, setCustomerFilter] = useState('ALL');

  // Filter only pending items (where no bulk order found in ERP)
  const pendingRecords = ldnRecords.filter(r => r.status === 'Pending');
  const customers = Array.from(new Set(pendingRecords.map(l => l.customer)));

  const filteredPending = pendingRecords.filter(record => {
    if (customerFilter !== 'ALL' && record.customer !== customerFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/50 border border-amber-200 p-4 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <h2 className="text-base font-bold text-amber-950">
              Bulk Conversion Pending (Follow-up Queue)
            </h2>
          </div>
          <p className="text-xs text-amber-900 mt-1">
            These LDN colour samples were delivered to buyers, but no corresponding Bulk Order has been received in ERP yet. Use this list for sales follow-up.
          </p>
        </div>

        <div className="text-right font-mono bg-white px-3.5 py-2 rounded border border-amber-300">
          <span className="text-[10px] text-amber-800 uppercase block font-semibold">TOTAL PENDING</span>
          <strong className="text-xl font-bold text-amber-900">{pendingRecords.length} Samples</strong>
        </div>
      </div>

      {/* Customer Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Filter by Buyer:</span>
          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none"
          >
            <option value="ALL">All Buyers ({pendingRecords.length})</option>
            {customers.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Showing {filteredPending.length} pending conversions
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-3 px-4">LDN No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Colour</th>
                <th className="py-3 px-4">Fabric</th>
                <th className="py-3 px-4">LDN Date</th>
                <th className="py-3 px-4 text-center">Days Since Delivery</th>
                <th className="py-3 px-4">Bulk Order</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPending.map((record) => (
                <tr 
                  key={record.ldnNo}
                  onClick={() => openDetailFor(record.ldnNo)}
                  className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {record.ldnNo}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {record.customer}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded border border-black/15 shrink-0" style={{ backgroundColor: record.colorHex }} />
                      <span className="font-semibold text-slate-900">{record.colorName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {record.fabric}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {record.sampleDeliveryDate}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                      {record.daysSinceDelivery} Days
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 italic">
                    Not Found
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status="Pending" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailFor(record.ldnNo);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white rounded text-xs font-medium transition-colors"
                    >
                      Follow Up →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
