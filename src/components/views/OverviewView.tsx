import React, { useState } from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { ProcessPipeline } from '../common/ProcessPipeline';
import { LabAppBadge } from '../common/LabAppBadge';
import { ColorSwatch } from '../common/ColorSwatch';
import { StatusBadge } from '../common/StatusBadge';
import { 
  FileSpreadsheet, 
  ArrowRight, 
  Plus, 
  Download,
  Filter
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { 
    bulkOrders, 
    labApprovals, 
    productionBatches, 
    deliveryRecords, 
    setActiveTab, 
    openTraceFor,
    addToast
  } = useDyeFlow();

  const [customerFilter, setCustomerFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');

  const customers = Array.from(new Set(bulkOrders.map(b => b.customer)));

  const filteredOrders = bulkOrders.filter(order => {
    if (customerFilter !== 'ALL' && order.customer !== customerFilter) return false;
    if (stageFilter !== 'ALL' && order.currentStage !== stageFilter) return false;
    return true;
  });

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Data Exported',
      message: 'Bulk Order Movement exported as CSV.'
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Operations Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lab Approval → Bulk Order → Dyeing → Delivery Management
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('lab-approvals')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>New Lab Sample</span>
          </button>
        </div>
      </div>

      {/* Main Process Pipeline */}
      <div>
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Process Pipeline
        </div>
        <ProcessPipeline />
      </div>

      {/* Bulk Order Movement Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        
        {/* Table Controls Header */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Bulk Order Movement
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Recent orders linked to approved Lab Approval Numbers
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Filter by Customer */}
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="ALL">All Customers</option>
              {customers.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Filter by Stage */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="ALL">All Stages</option>
              <option value="Approval">Approval</option>
              <option value="Production">Production</option>
              <option value="Delivery">Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Clean Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-medium">
                <th className="py-3 px-4">Lab App No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Colour</th>
                <th className="py-3 px-4">Bulk Order</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Expected Delivery</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr 
                  key={order.bulkOrderNo}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <LabAppBadge labAppNo={order.labAppNo} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {order.customer}
                  </td>
                  <td className="py-3.5 px-4">
                    <ColorSwatch colorName={order.colorName} colorHex={order.colorHex} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {order.bulkOrderNo}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {order.orderQtyKg.toLocaleString()} KG
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {order.currentStage}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {order.requiredDeliveryDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge 
                      status={order.deliveryStatus === 'Delivered' ? 'Delivered' : order.productionStatus === 'Completed' ? 'Ready for Delivery' : order.productionStatus} 
                      size="sm" 
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => openTraceFor(order.labAppNo)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded text-xs font-medium transition-colors"
                    >
                      Trace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{filteredOrders.length} Bulk Orders Listed</span>
          <button
            type="button"
            onClick={() => setActiveTab('bulk-orders')}
            className="text-slate-900 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Go to Bulk Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
