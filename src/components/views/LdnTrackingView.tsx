import React, { useState } from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { StatusBadge } from '../common/StatusBadge';
import { Search, Filter, Download } from 'lucide-react';

export const LdnTrackingView: React.FC = () => {
  const { ldnRecords, openDetailFor } = useDyeFlow();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');

  const customers = Array.from(new Set(ldnRecords.map(l => l.customer)));

  const filteredRecords = ldnRecords.filter(record => {
    if (statusFilter !== 'ALL' && record.status !== statusFilter) return false;
    if (customerFilter !== 'ALL' && record.customer !== customerFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const match = 
        record.ldnNo.toLowerCase().includes(q) ||
        record.customer.toLowerCase().includes(q) ||
        record.colorName.toLowerCase().includes(q) ||
        record.labAppNo.toLowerCase().includes(q) ||
        record.bulkOrderNo?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            LDN Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete register of colour samples delivered to customers (LDN) and their ERP bulk match status.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search LDN, Customer, Colour, Lab App No..."
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 w-64 focus:outline-none"
          />

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none"
            >
              <option value="ALL">All Statuses ({ldnRecords.length})</option>
              <option value="Bulk Found">Bulk Found</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
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

        <div className="text-slate-500 font-mono text-[11px]">
          Showing {filteredRecords.length} LDN Deliveries
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-3 px-4">LDN No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Colour</th>
                <th className="py-3 px-4">Fabric</th>
                <th className="py-3 px-4">Lab App No</th>
                <th className="py-3 px-4">Delivery Date</th>
                <th className="py-3 px-4">Bulk Order</th>
                <th className="py-3 px-4 text-right">Bulk Qty</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record) => (
                <tr 
                  key={record.ldnNo}
                  onClick={() => openDetailFor(record.ldnNo)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {/* LDN No */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {record.ldnNo}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {record.customer}
                  </td>

                  {/* Colour */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded border border-black/15 shrink-0" style={{ backgroundColor: record.colorHex }} />
                      <span className="font-semibold text-slate-900">{record.colorName}</span>
                    </div>
                  </td>

                  {/* Fabric */}
                  <td className="py-3.5 px-4 text-slate-700">
                    {record.fabric}
                  </td>

                  {/* Lab App No */}
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {record.labAppNo}
                  </td>

                  {/* Delivery Date */}
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {record.sampleDeliveryDate}
                  </td>

                  {/* Bulk Order */}
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-950">
                    {record.bulkOrderNo || '—'}
                  </td>

                  {/* Bulk Qty */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {record.bulkQuantityKg ? `${record.bulkQuantityKg.toLocaleString()} KG` : '—'}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={record.status} />
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailFor(record.ldnNo);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white rounded text-xs font-medium transition-colors"
                    >
                      Detail →
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
