import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { X, CheckCircle2, Clock, ArrowDown, FileSpreadsheet, Layers } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const DetailTimelineModal: React.FC = () => {
  const { 
    isDetailModalOpen, 
    setIsDetailModalOpen, 
    selectedLdn 
  } = useDyeFlow();

  if (!isDetailModalOpen || !selectedLdn) return null;

  const isFound = selectedLdn.status === 'Bulk Found';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block">
              SAMPLE LIFECYCLE TIMELINE
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {selectedLdn.ldnNo} — {selectedLdn.customer}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsDetailModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Top Key Info Card */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 text-[11px] block">Customer</span>
              <strong className="text-slate-900 text-xs block">{selectedLdn.customer}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Colour</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-3.5 h-3.5 rounded border border-black/15 shadow-inner shrink-0" style={{ backgroundColor: selectedLdn.colorHex }} />
                <strong className="text-slate-900 text-xs">{selectedLdn.colorName}</strong>
              </div>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Fabric</span>
              <strong className="text-slate-900 text-xs block">{selectedLdn.fabric}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Lab App No</span>
              <strong className="text-slate-900 font-mono text-xs block">{selectedLdn.labAppNo}</strong>
            </div>
          </div>

          {/* Simple Step Timeline */}
          <div className="space-y-3">
            
            {/* 1. LRN */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-900 text-amber-300 font-mono font-bold rounded text-[10px]">
                    LRN
                  </span>
                  <span className="font-bold text-slate-800 text-xs">Customer Sample Received</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Received Ref: <strong>{selectedLdn.lrnNo}</strong> · Date: {selectedLdn.lrnDate}
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <div className="text-center text-slate-400 font-bold -my-1">↓</div>

            {/* 2. LAB */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-900 text-amber-300 font-mono font-bold rounded text-[10px]">
                    LAB
                  </span>
                  <span className="font-bold text-slate-800 text-xs">Colour Processed</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Lab App No: <strong>{selectedLdn.labAppNo}</strong> · Colorist: {selectedLdn.colorist}
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <div className="text-center text-slate-400 font-bold -my-1">↓</div>

            {/* 3. LDN */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-900 text-amber-300 font-mono font-bold rounded text-[10px]">
                    LDN
                  </span>
                  <span className="font-bold text-slate-800 text-xs">Sample Delivered to Customer</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Delivery Ref: <strong>{selectedLdn.ldnNo}</strong> · Date: {selectedLdn.sampleDeliveryDate} ({selectedLdn.daysSinceDelivery} days ago)
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <div className="text-center text-slate-400 font-bold -my-1">↓</div>

            {/* 4. ERP */}
            <div className={`p-3.5 rounded-lg border flex items-start justify-between ${
              isFound ? 'bg-indigo-50/70 border-indigo-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 font-mono font-bold rounded text-[10px] ${
                    isFound ? 'bg-indigo-900 text-white' : 'bg-slate-300 text-slate-700'
                  }`}>
                    ERP
                  </span>
                  <span className="font-bold text-slate-800 text-xs">Bulk Order Entry</span>
                </div>
                {isFound ? (
                  <div className="text-[11px] text-indigo-950 font-mono mt-1 space-y-0.5">
                    <div>Bulk Order No: <strong>{selectedLdn.bulkOrderNo}</strong></div>
                    <div>Bulk Quantity: <strong>{selectedLdn.bulkQuantityKg?.toLocaleString()} KG</strong></div>
                    <div>ERP Date: <strong>{selectedLdn.bulkOrderDate}</strong></div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic mt-1">
                    No matching bulk order recorded in ERP yet.
                  </div>
                )}
              </div>
              {isFound ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              )}
            </div>

            <div className="text-center text-slate-400 font-bold -my-1">↓</div>

            {/* 5. RESULT */}
            <div className={`p-4 rounded-lg border-2 flex items-center justify-between ${
              isFound ? 'bg-emerald-50 border-emerald-400' : 'bg-amber-50 border-amber-300'
            }`}>
              <div>
                <span className="font-bold text-xs uppercase tracking-wide block font-mono text-slate-700">
                  RESULT
                </span>
                <strong className={`text-sm mt-0.5 block ${isFound ? 'text-emerald-800' : 'text-amber-900'}`}>
                  {isFound ? '✓ Bulk Order Found' : '⏳ Bulk Order Pending'}
                </strong>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isFound 
                    ? `Successfully converted into ${selectedLdn.bulkQuantityKg?.toLocaleString()} KG bulk commercial lot.`
                    : `${selectedLdn.daysSinceDelivery} days since sample delivery. Ready for sales follow-up.`}
                </p>
              </div>
              <StatusBadge status={selectedLdn.status} />
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => setIsDetailModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
