import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { 
  FlaskConical, 
  CheckCircle2, 
  FileSpreadsheet, 
  Factory, 
  Truck, 
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../../types';

export const ProcessPipeline: React.FC = () => {
  const { 
    setActiveTab, 
    labApprovals, 
    bulkOrders, 
    productionBatches, 
    deliveryRecords 
  } = useDyeFlow();

  const labSamplesCount = labApprovals.length;
  const approvalPendingCount = labApprovals.filter(l => l.approvalStatus === 'Awaiting Customer' || l.approvalStatus === 'Resubmission Required').length;
  const bulkOrdersCount = bulkOrders.length;
  const bulkTotalQtyKg = bulkOrders.reduce((sum, o) => sum + o.orderQtyKg, 0);
  const productionActiveCount = productionBatches.filter(p => p.stage !== 'Completed').length;
  const deliveryReadyCount = deliveryRecords.filter(d => d.deliveryStatus === 'Ready for Delivery' || d.deliveryStatus === 'Production Complete').length;

  const stages = [
    {
      id: 'lab-approvals' as ActiveTab,
      label: 'LAB',
      desc: 'Color Matching',
      mainCount: `${labSamplesCount} Samples`,
      subText: 'Recipe formulation',
      icon: FlaskConical,
      accent: 'border-l-4 border-l-slate-800'
    },
    {
      id: 'customer-approvals' as ActiveTab,
      label: 'APPROVAL',
      desc: 'Customer Sign-off',
      mainCount: `${String(approvalPendingCount).padStart(2, '0')} Pending`,
      subText: `${labApprovals.filter(l => l.approvalStatus === 'Approved').length} Approved`,
      icon: CheckCircle2,
      accent: 'border-l-4 border-l-amber-500'
    },
    {
      id: 'bulk-orders' as ActiveTab,
      label: 'BULK',
      desc: 'Confirmed Orders',
      mainCount: `${bulkOrdersCount} Orders`,
      subText: `${(bulkTotalQtyKg || 12500).toLocaleString()} KG Total`,
      icon: FileSpreadsheet,
      accent: 'border-l-4 border-l-indigo-600'
    },
    {
      id: 'production' as ActiveTab,
      label: 'PRODUCTION',
      desc: 'Dyeing Machines',
      mainCount: `${productionActiveCount} Active`,
      subText: 'In softflow vessels',
      icon: Factory,
      accent: 'border-l-4 border-l-sky-600'
    },
    {
      id: 'deliveries' as ActiveTab,
      label: 'DELIVERY',
      desc: 'Dispatch & POD',
      mainCount: `${String(deliveryReadyCount).padStart(2, '0')} Ready`,
      subText: 'Packing & In transit',
      icon: Truck,
      accent: 'border-l-4 border-l-emerald-600'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveTab(stage.id)}
              className={`text-left p-3 rounded-md bg-slate-50 hover:bg-white hover:shadow-sm border border-slate-200 hover:border-slate-300 transition-all ${stage.accent}`}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="font-bold text-xs text-slate-800 tracking-wider">
                  {stage.label}
                </span>
                <Icon className="w-4 h-4 text-slate-400" />
              </div>

              <div className="text-base font-bold text-slate-900 mt-0.5">
                {stage.mainCount}
              </div>

              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span>{stage.desc}</span>
                <span className="text-slate-400 font-medium">{stage.subText}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
