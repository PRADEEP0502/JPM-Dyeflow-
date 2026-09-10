import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { ProcessBar } from '../common/ProcessBar';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    metrics, 
    ldnRecords, 
    setActivePage, 
    openDetailFor 
  } = useDyeFlow();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Visual Workflow Process at the Top */}
      <ProcessBar />

      {/* 4 Core Numbers (CRITICAL PROMPT REQUIREMENT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. LDN Delivered */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              LDN Delivered
            </span>
            <Truck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
            {metrics.totalLdnDelivered}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Total samples delivered to buyers
          </div>
        </div>

        {/* 2. Bulk Orders Found */}
        <div className="bg-white border border-emerald-200 rounded-lg p-4 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">
              Bulk Orders Found
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono mt-1">
            {metrics.bulkOrdersFound}
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            Matched with Selsoft ERP
          </div>
        </div>

        {/* 3. Bulk Orders Pending */}
        <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">
              Bulk Orders Pending
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700 font-mono mt-1">
            {metrics.bulkOrdersPending}
          </div>
          <div className="text-xs text-amber-800 mt-1">
            Waiting for buyer bulk confirmation
          </div>
        </div>

        {/* 4. Bulk Quantity */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Bulk Quantity
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
            {metrics.totalBulkQuantityKg.toLocaleString()} KG
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Total commercial order volume
          </div>
        </div>

      </div>

      {/* LDN -> Bulk Order Conversion Banner (CRITICAL PROMPT REQUIREMENT) */}
      <div className="bg-white border-2 border-slate-900 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
              CONVERSION PERFORMANCE
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            LDN → Bulk Order Conversion
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Out of {metrics.totalLdnDelivered} colour samples delivered to customers, {metrics.bulkOrdersFound} have successfully turned into Bulk Orders in ERP.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <div className="text-center font-mono">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">CONVERSION RATIO</span>
            <strong className="text-xl font-bold text-slate-900">
              {metrics.bulkOrdersFound} / {metrics.totalLdnDelivered}
            </strong>
          </div>

          <div className="h-10 w-px bg-slate-300" />

          <div className="text-center font-mono">
            <span className="text-[10px] text-emerald-800 uppercase block font-semibold">CONVERTED</span>
            <strong className="text-2xl font-black text-emerald-700">
              {metrics.conversionPercentage}%
            </strong>
          </div>
        </div>
      </div>

      {/* Recent LDN Movement Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Recent LDN Deliveries &amp; Match Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any record to inspect its complete LRN → Lab → LDN → ERP timeline
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('ldn-tracking')}
            className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
          >
            <span>View All LDN Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-3 px-4">LDN No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Colour</th>
                <th className="py-3 px-4">Fabric</th>
                <th className="py-3 px-4">Delivery Date</th>
                <th className="py-3 px-4">Bulk Order</th>
                <th className="py-3 px-4 text-right">Bulk Qty</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ldnRecords.slice(0, 6).map((record) => (
                <tr 
                  key={record.ldnNo}
                  onClick={() => openDetailFor(record.ldnNo)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {record.ldnNo}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {record.customer}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: record.colorHex }} />
                      <span className="font-semibold text-slate-900">{record.colorName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {record.fabric}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {record.sampleDeliveryDate}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-950">
                    {record.bulkOrderNo || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {record.bulkQuantityKg ? `${record.bulkQuantityKg.toLocaleString()} KG` : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={record.status} />
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
                      Timeline →
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
