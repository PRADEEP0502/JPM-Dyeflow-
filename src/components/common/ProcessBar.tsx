import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const ProcessBar: React.FC = () => {
  const steps = [
    {
      code: 'LRN',
      title: 'Customer Sample Received',
      desc: 'Sample logged at Lab Receive',
      stepNo: '01'
    },
    {
      code: 'LAB',
      title: 'Colour Processing',
      desc: 'Dyeing & shade matching',
      stepNo: '02'
    },
    {
      code: 'LDN',
      title: 'Sample Delivered',
      desc: 'Processed swatch sent to buyer',
      stepNo: '03'
    },
    {
      code: 'ERP',
      title: 'Bulk Order',
      desc: 'Order entered in ERP ledger',
      stepNo: '04'
    },
    {
      code: 'MATCH',
      title: 'Bulk Conversion',
      desc: 'LDN ↔ ERP verification',
      stepNo: '05',
      isHighlight: true
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
        Core Tracking Workflow
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        {steps.map((step, idx) => (
          <React.Fragment key={step.code}>
            <div className={`p-3 rounded-lg border text-left transition-all ${
              step.isHighlight 
                ? 'bg-emerald-50/70 border-emerald-300' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                  step.isHighlight ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-amber-300'
                }`}>
                  {step.code}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Step {step.stepNo}</span>
              </div>
              <div className="font-bold text-xs text-slate-900 mt-1">
                {step.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {step.desc}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
