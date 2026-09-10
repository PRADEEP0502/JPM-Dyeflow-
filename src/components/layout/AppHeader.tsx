import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { Search, RefreshCw } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { 
    globalSearch, 
    setGlobalSearch, 
    openDetailFor, 
    triggerSync, 
    isSyncing 
  } = useDyeFlow();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      openDetailFor(globalSearch);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-amber-300 font-mono font-bold text-sm">
            JPM
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 leading-tight">
              JPM DyeFlow
            </h1>
            <p className="text-xs text-slate-500">
              Lab Sample → Customer → Bulk Order Tracking
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search Customer, LRN, LDN, Lab App (8157-26/A), Colour, Bulk No..."
              className="w-full pl-9 pr-20 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:bg-white"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => openDetailFor(globalSearch)}
                className="absolute right-2 top-1.5 px-2 py-0.5 bg-slate-900 text-white rounded text-[11px] font-medium"
              >
                Search
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={triggerSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{isSyncing ? 'Syncing ERP...' : 'Sync Selsoft ERP'}</span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
              MD
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-none">MD Desk</div>
              <div className="text-[10px] text-slate-400 leading-none mt-1">Junior Processing Mills</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
