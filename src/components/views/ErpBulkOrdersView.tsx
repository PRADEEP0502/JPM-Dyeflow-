import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { FileSpreadsheet, CheckCircle2, ArrowRight } from 'lucide-react';

export const ErpBulkOrdersView: React.FC = () => {
  const { erpOrders, openDetailFor } = useDyeFlow();

  const totalKg = erpOrders.reduce((sum, o) => sum + o.quantityKg, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            ERP Bulk Orders
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bulk commercial production orders recorded in Selsoft ERP and matched to Lab Delivery Numbers (LDN).
          </p>
        </div>

        <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-3">
          <div>
            <span className="text-slate-400 text-[10px] block">TOTAL ERP VOLUME</span>
            <strong className="text-amber-300 text-sm font-bold">{totalKg.toLocaleString()} KG</strong>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-3 px-4">Bulk Order No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Colour</th>
                <th className="py-3 px-4">Fabric</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Linked LDN</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {erpOrders.map((order) => (
                <tr 
                  key={order.bulkOrderNo}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {order.bulkOrderNo}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {order.customer}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded border border-black/15 shrink-0" style={{ backgroundColor: order.colorHex }} />
                      <span className="font-semibold text-slate-900">{order.colorName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono">
                    {order.fabric}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {order.quantityKg.toLocaleString()} KG
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {order.orderDate}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-900">
                    {order.linkedLdnNo ? (
                      <span className="bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {order.linkedLdnNo}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal italic">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {order.linkedLdnNo ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Matched with LDN</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span>Direct Order</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {order.linkedLdnNo ? (
                      <button
                        type="button"
                        onClick={() => openDetailFor(order.linkedLdnNo!)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white rounded text-xs font-medium transition-colors"
                      >
                        Trace LDN →
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
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
