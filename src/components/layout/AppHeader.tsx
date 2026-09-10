import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { 
  Search, 
  RefreshCw, 
  Bell, 
  Layers, 
  User
} from 'lucide-react';
import { SearchBar } from '../common/SearchBar';

export const AppHeader: React.FC = () => {
  const { 
    globalSearch, 
    setGlobalSearch, 
    syncWithErp, 
    isSyncing,
    openTraceFor,
    labApprovals
  } = useDyeFlow();

  const pendingApprovalsCount = labApprovals.filter(l => l.approvalStatus === 'Awaiting Customer').length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="px-6 py-3.5 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-amber-300 font-mono font-bold text-sm">
            JPM
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 leading-tight">
              JPM DyeFlow
            </h1>
            <p className="text-xs text-slate-500">
              Lab-to-Delivery Operations
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg">
          <SearchBar 
            value={globalSearch}
            onChange={setGlobalSearch}
            placeholder="Search Lab No (8157-26/A), Order, Customer..."
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openTraceFor('8157-26/A')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-semibold transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Order Trace</span>
          </button>

          <button
            type="button"
            onClick={syncWithErp}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
            title="Sync ERP"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync ERP'}</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-semibold text-xs">
              MD
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-none">MD Desk</div>
              <div className="text-[11px] text-slate-500 leading-none mt-1">Junior Processing Mills</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
