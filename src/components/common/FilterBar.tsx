import React from 'react';
import { Filter, Calendar, Building2 } from 'lucide-react';
import { useDyeFlow } from '../../context/DyeFlowContext';

interface FilterBarProps {
  selectedCustomer: string;
  onCustomerChange: (customer: string) => void;
  statusOptions?: string[];
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  children?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCustomer,
  onCustomerChange,
  statusOptions,
  selectedStatus,
  onStatusChange,
  children
}) => {
  const { 
    selectedDateRange, 
    setSelectedDateRange,
    labApprovals
  } = useDyeFlow();

  // Extract unique customers
  const customers = Array.from(new Set(labApprovals.map(l => l.customer)));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-3 bg-white border border-slate-200 rounded-md shadow-subtle text-xs mb-4">
      {/* Left Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Customer Selector */}
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-medium">Customer:</span>
          <select
            value={selectedCustomer}
            onChange={(e) => onCustomerChange(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-700 cursor-pointer"
          >
            <option value="ALL">All Accounts ({labApprovals.length})</option>
            {customers.map(cust => (
              <option key={cust} value={cust}>{cust}</option>
            ))}
          </select>
        </div>

        {/* Status Option Tabs/Pills if provided */}
        {statusOptions && onStatusChange && (
          <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-0.5" />
            <span className="text-slate-500 font-medium mr-1">Status:</span>
            <div className="inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => onStatusChange('ALL')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  selectedStatus === 'ALL' || !selectedStatus
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              {statusOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onStatusChange(opt)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    selectedStatus === opt
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {children}
      </div>

      {/* Right Date Range selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        <select
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-700 cursor-pointer text-xs"
        >
          <option value="Today (09 Sep 2026)">Today (09 Sep 2026)</option>
          <option value="This Week (W37 2026)">This Week (W37 2026)</option>
          <option value="This Month (Sep 2026)">This Month (Sep 2026)</option>
          <option value="Q3 FY26-27">Q3 FY26-27</option>
        </select>
      </div>
    </div>
  );
};
