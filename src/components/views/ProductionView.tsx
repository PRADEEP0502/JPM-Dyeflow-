import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { LabAppBadge } from '../common/LabAppBadge';
import { ColorSwatch } from '../common/ColorSwatch';
import { StatusBadge } from '../common/StatusBadge';
import { CheckCircle2, Play } from 'lucide-react';
import { ProductionBatch, ProductionStatus } from '../../types';

export const ProductionView: React.FC = () => {
  const { productionBatches, advanceProductionStage, openTraceFor } = useDyeFlow();

  const stages: { id: ProductionStatus; title: string; color: string }[] = [
    { id: 'Queued', title: 'Queued', color: 'border-slate-300' },
    { id: 'Dyeing', title: 'Dyeing', color: 'border-sky-400' },
    { id: 'QC', title: 'QC Inspection', color: 'border-purple-400' },
    { id: 'Completed', title: 'Completed', color: 'border-teal-400' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Production Board
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Track fabric batches across Queued → Dyeing → QC → Completed.
        </p>
      </div>

      {/* 4 Clean Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {stages.map(stage => {
          const batches = productionBatches.filter(b => b.stage === stage.id);
          const stageKg = batches.reduce((s, b) => s + b.quantityKg, 0);

          return (
            <div key={stage.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              
              {/* Column Header */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 uppercase">
                  {stage.title}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {stageKg.toLocaleString()} KG
                </span>
              </div>

              {/* Items */}
              <div className="p-3 space-y-3 min-h-[400px]">
                {batches.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 py-8 italic">
                    No batches in {stage.title}.
                  </div>
                ) : (
                  batches.map(batch => (
                    <div 
                      key={batch.batchId}
                      className="p-3 bg-slate-50 hover:bg-white rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">{batch.bulkOrderNo}</span>
                        <LabAppBadge labAppNo={batch.labAppNo} size="sm" />
                      </div>

                      <div className="font-semibold text-slate-900">{batch.customer}</div>

                      <div className="flex items-center justify-between">
                        <ColorSwatch colorName={batch.colorName} colorHex={batch.colorHex} size="sm" />
                        <span className="font-mono font-bold text-slate-900">{batch.quantityKg.toLocaleString()} KG</span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        Machine: {batch.machineVessel.split('(')[0]}
                      </div>

                      {/* Advance Button */}
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => openTraceFor(batch.labAppNo)}
                          className="text-[11px] text-slate-600 hover:text-slate-900"
                        >
                          Trace →
                        </button>

                        {stage.id === 'Queued' && (
                          <button
                            type="button"
                            onClick={() => advanceProductionStage(batch.batchId, 'Dyeing')}
                            className="px-2 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-semibold"
                          >
                            Start Dyeing
                          </button>
                        )}
                        {stage.id === 'Dyeing' && (
                          <button
                            type="button"
                            onClick={() => advanceProductionStage(batch.batchId, 'QC')}
                            className="px-2 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded text-[11px] font-semibold"
                          >
                            Send to QC
                          </button>
                        )}
                        {stage.id === 'QC' && (
                          <button
                            type="button"
                            onClick={() => advanceProductionStage(batch.batchId, 'Completed')}
                            className="px-2 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-[11px] font-semibold"
                          >
                            QC Pass &amp; Complete
                          </button>
                        )}
                        {stage.id === 'Completed' && (
                          <span className="text-[11px] font-mono text-teal-800 font-bold">Ready for Delivery</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
