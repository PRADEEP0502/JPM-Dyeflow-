import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { 
  LayoutDashboard, 
  FlaskConical, 
  CheckCircle2, 
  FileSpreadsheet, 
  Factory, 
  Truck, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { ActiveTab } from '../../types';

export const AppSidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    labApprovals, 
    bulkOrders, 
    productionBatches, 
    deliveryRecords 
  } = useDyeFlow();

  const pendingApprovalsCount = labApprovals.filter(
    l => l.approvalStatus === 'Awaiting Customer'
  ).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'lab-approvals',
      label: 'Lab Approvals',
      icon: FlaskConical,
      badge: labApprovals.length
    },
    {
      id: 'customer-approvals',
      label: 'Customer Approvals',
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined
    },
    {
      id: 'bulk-orders',
      label: 'Bulk Orders',
      icon: FileSpreadsheet,
      badge: bulkOrders.length
    },
    {
      id: 'production',
      label: 'Production',
      icon: Factory,
      badge: productionBatches.filter(p => p.stage !== 'Completed').length
    },
    {
      id: 'deliveries',
      label: 'Deliveries',
      icon: Truck,
      badge: deliveryRecords.filter(d => d.deliveryStatus !== 'Delivered').length
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3
    }
  ];

  return (
    <aside className="w-60 bg-[#0f172a] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-slate-800">
      <div>
        {/* Top Logo */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-bold text-sm text-white tracking-wide uppercase">
              JPM Operations
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
