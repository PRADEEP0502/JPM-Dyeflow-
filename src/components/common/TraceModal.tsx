import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { X, Layers, Printer } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ColorSwatch } from './ColorSwatch';
import { LabAppBadge } from './LabAppBadge';

export const TraceModal: React.FC = () => {
  const { 
    isTraceModalOpen, 
    setIsTraceModalOpen, 
    traceQuery, 
    setTraceQuery,
    labApprovals, 
    bulkOrders, 
    productionBatches, 
    deliveryRecords 
  } = useDyeFlow();

  if (!isTraceModalOpen) return null;

  const matchedLab = labApprovals.find(
    l => l.labAppNo.toLowerCase() === traceQuery.toLowerCase() || 
         l.linkedBulkOrderNo?.toLowerCase() === traceQuery.toLowerCase() ||
         l.customer.toLowerCase().includes(traceQuery.toLowerCase())
  ) || labApprovals[0];

  const matchedBulk = bulkOrders.find(
    b => b.labAppNo === matchedLab?.labAppNo || b.bulkOrderNo === matchedLab?.linkedBulkOrderNo
  );

  const matchedProduction = productionBatches.find(
    p => p.labAppNo === matchedLab?.labAppNo || p.bulkOrderNo === matchedBulk?.bulkOrderNo
  );

  const matchedDelivery = deliveryRecords.find(
    d => d.labAppNo === matchedLab?.labAppNo || d.bulkOrderNo === matchedBulk?.bulkOrderNo
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block">
              FULL ORDER AUDIT TRAIL
            </span>
            <h3 className="text-lg font-bold font-mono text-white mt-0.5">
              {matchedLab.labAppNo} — {matchedLab.customer} ({matchedLab.colorName})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded text-xs"
            >
              Print
            </button>
            <button
              type="button"
              onClick={() => setIsTraceModalOpen(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Switch Reference */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Select Lab Reference:</span>
          <select
            value={matchedLab.labAppNo}
            onChange={(e) => setTraceQuery(e.target.value)}
            className="bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-900 focus:outline-none"
          >
            {labApprovals.map(l => (
              <option key={l.labAppNo} value={l.labAppNo}>
                {l.labAppNo} ({l.customer} - {l.colorName})
              </option>
            ))}
          </select>
        </div>

        {/* Body: 4 Simple Clean Boxes */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* 1. LAB APPROVAL */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">1. LAB APPROVAL</span>
              <StatusBadge status={matchedLab.approvalStatus} size="sm" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-slate-700">
              <div>Ref: <strong>{matchedLab.labAppNo}</strong></div>
              <div>Fabric: <strong>{matchedLab.fabric}</strong></div>
              <div>Delta E: <strong className="text-emerald-700">ΔE {matchedLab.deltaE.toFixed(2)}</strong></div>
            </div>
          </div>

          <div className="text-center text-slate-400 font-bold">↓ linked relationship</div>

          {/* 2. BULK ORDER */}
          <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 text-sm">2. BULK ORDER</span>
              <span className="font-mono font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                {matchedBulk ? matchedBulk.bulkOrderNo : 'Pending Booking'}
              </span>
            </div>
            {matchedBulk ? (
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-indigo-950">
                <div>Quantity: <strong>{matchedBulk.orderQtyKg.toLocaleString()} KG</strong></div>
                <div>Req Date: <strong>{matchedBulk.requiredDeliveryDate}</strong></div>
                <div>PO Ref: <strong>{matchedBulk.poReference || 'Standard'}</strong></div>
              </div>
            ) : (
              <div className="text-slate-500 italic">Order not yet booked.</div>
            )}
          </div>

          <div className="text-center text-slate-400 font-bold">↓ linked relationship</div>

          {/* 3. PRODUCTION */}
          <div className="p-4 rounded-lg bg-sky-50/70 border border-sky-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-950 text-sm">3. PRODUCTION</span>
              {matchedProduction && <StatusBadge status={matchedProduction.stage} size="sm" />}
            </div>
            {matchedProduction ? (
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-sky-950">
                <div>Vessel: <strong>{matchedProduction.machineVessel.split('(')[0]}</strong></div>
                <div>Volume: <strong>{matchedProduction.quantityKg.toLocaleString()} KG</strong></div>
                <div>ETA: <strong>{matchedProduction.actualCompletion || matchedProduction.expectedCompletion}</strong></div>
              </div>
            ) : (
              <div className="text-slate-500 italic">Awaiting production schedule.</div>
            )}
          </div>

          <div className="text-center text-slate-400 font-bold">↓ linked relationship</div>

          {/* 4. DELIVERY */}
          <div className="p-4 rounded-lg bg-teal-50/70 border border-teal-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-950 text-sm">4. DELIVERY</span>
              {matchedDelivery && <StatusBadge status={matchedDelivery.deliveryStatus} size="sm" />}
            </div>
            {matchedDelivery ? (
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-teal-950">
                <div>Vehicle: <strong>{matchedDelivery.vehicleNo}</strong></div>
                <div>Driver: <strong>{matchedDelivery.driverName}</strong></div>
                <div>Status: <strong>{matchedDelivery.receiverName ? `Signed by ${matchedDelivery.receiverName}` : 'In Transit'}</strong></div>
              </div>
            ) : (
              <div className="text-slate-500 italic">Awaiting dispatch.</div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => setIsTraceModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold"
          >
            Close Trace
          </button>
        </div>

      </div>
    </div>
  );
};
