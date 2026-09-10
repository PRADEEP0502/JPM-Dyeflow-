import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { 
  LayoutDashboard, 
  Truck, 
  Clock, 
  FileSpreadsheet, 
  Layers
} from 'lucide-react';
import { ActivePage } from '../../types';

export const AppSidebar: React.FC = () => {
  const { activePage, setActivePage, metrics } = useDyeFlow();

  const navItems: { id: ActivePage; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'ldn-tracking',
      label: 'LDN Tracking',
      icon: Truck,
      badge: metrics.totalLdnDelivered,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'pending-bulk',
      label: 'Bulk Conversion Pending',
      icon: Clock,
      badge: metrics.bulkOrdersPending,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
    },
    {
      id: 'erp-orders',
      label: 'ERP Bulk Orders',
      icon: FileSpreadsheet,
      badge: metrics.bulkOrdersFound,
      badgeColor: 'bg-indigo-100 text-indigo-900'
    }
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div>
              <span className="font-bold text-sm text-white tracking-wide uppercase block">
                JPM DyeFlow
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                Junior Processing Mills
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
            NAVIGATION
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Core Tracking Principle:</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-relaxed font-mono">
          LRN (Sample In) → LDN (Sample Out) → ERP Bulk Match
        </div>
      </div>
    </aside>
  );
};
