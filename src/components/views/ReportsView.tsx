import React, { useState } from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Layers, 
  FileSpreadsheet, 
  Factory, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { LabAppBadge } from '../common/LabAppBadge';
import { ColorSwatch } from '../common/ColorSwatch';
import { StatusBadge } from '../common/StatusBadge';

export const ReportsView: React.FC = () => {
  const { 
    labApprovals, 
    bulkOrders, 
    productionBatches, 
    deliveryRecords, 
    openTraceFor,
    addToast
  } = useDyeFlow();

  const [activeReportTab, setActiveReportTab] = useState<
    'conversion' | 'by-customer' | 'by-color' | 'prod-pending' | 'delivery-pending' | 'delayed'
  >('conversion');

  const [dateFilter, setDateFilter] = useState('Sep 2026');

  // Conversion calculations
  const totalLabSamples = labApprovals.length;
  const approvedLabSamples = labApprovals.filter(l => l.approvalStatus === 'Approved').length;
  const convertedToBulk = labApprovals.filter(l => l.linkedBulkOrderNo).length;
  const conversionRate = Math.round((convertedToBulk / totalLabSamples) * 100);

  // Volume by Customer
  const customerVolumes = bulkOrders.reduce((acc, order) => {
    acc[order.customer] = (acc[order.customer] || 0) + order.orderQtyKg;
    return acc;
  }, {} as Record<string, number>);

  // Volume by Colour
  const colorVolumes = bulkOrders.reduce((acc, order) => {
    acc[order.colorName] = (acc[order.colorName] || 0) + order.orderQtyKg;
    return acc;
  }, {} as Record<string, number>);

  // Production Pending
  const pendingBatches = productionBatches.filter(p => p.stage !== 'Completed');

  // Delivery Pending
  const pendingDeliveries = deliveryRecords.filter(d => d.deliveryStatus !== 'Delivered');

  // Delayed Deliveries Simulation (ETA past or near target)
  const delayedOrders = bulkOrders.filter(o => o.deliveryStatus === 'Pending' || o.productionStatus === 'Queued');

  const handleExportReport = (reportName: string) => {
    addToast({
      type: 'success',
      title: `${reportName} Exported`,
      message: 'Comprehensive operations report exported as CSV & formatted PDF.'
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#d1d9e2] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              MANAGEMENT INFORMATION SYSTEM (MIS) &amp; AUDIT REPORTS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display mt-0.5">
            Operational Intelligence &amp; Throughput Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Executive metrics covering conversion velocity, customer tonnage, liquor throughput, and delivery compliance.
          </p>
        </div>

        {/* Global Export & Date Filter */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Sep 2026">Month: September 2026</option>
              <option value="Q3 FY26-27">Q3 FY2026-2027</option>
              <option value="FY26-27">Full Fiscal Year 2026-27</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleExportReport('Executive Operations Deck')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-mono font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Executive Pack</span>
          </button>
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'conversion', label: '1. Lab → Bulk Conversion' },
          { id: 'by-customer', label: '2. Orders by Customer' },
          { id: 'by-color', label: '3. Quantity by Colour' },
          { id: 'prod-pending', label: '4. Production Pending' },
          { id: 'delivery-pending', label: '5. Delivery Pending' },
          { id: 'delayed', label: '6. Delayed & Risk Orders' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveReportTab(tab.id as typeof activeReportTab)}
            className={`px-3.5 py-2 rounded-md text-xs font-mono font-semibold transition-all ${
              activeReportTab === tab.id
                ? 'bg-slate-900 text-amber-300 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REPORT 1: LAB TO BULK CONVERSION */}
      {activeReportTab === 'conversion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm font-mono">
              <span className="text-slate-500 text-[11px] block uppercase font-sans font-semibold">Total Lab Samples</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalLabSamples}</span>
              <span className="text-[11px] text-slate-500 font-sans mt-0.5 block">Formulated in Lab</span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm font-mono">
              <span className="text-slate-500 text-[11px] block uppercase font-sans font-semibold">Customer Approved</span>
              <span className="text-2xl font-bold text-emerald-800 mt-1 block">{approvedLabSamples}</span>
              <span className="text-[11px] text-emerald-700 font-sans mt-0.5 block">{Math.round((approvedLabSamples/totalLabSamples)*100)}% approval rate</span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm font-mono">
              <span className="text-slate-500 text-[11px] block uppercase font-sans font-semibold">Converted to Bulk PO</span>
              <span className="text-2xl font-bold text-indigo-900 mt-1 block">{convertedToBulk}</span>
              <span className="text-[11px] text-indigo-700 font-sans mt-0.5 block">Active commercial lots</span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm font-mono">
              <span className="text-slate-500 text-[11px] block uppercase font-sans font-semibold">Conversion Rate</span>
              <span className="text-2xl font-bold text-amber-700 mt-1 block">{conversionRate}%</span>
              <span className="text-[11px] text-slate-500 font-sans mt-0.5 block">Target benchmark &gt; 60%</span>
            </div>
          </div>

          <div className="bg-white border border-[#d1d9e2] rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Conversion Audit Matrix (Lab Approval → Bulk Order)
              </h3>
              <button
                type="button"
                onClick={() => handleExportReport('Lab Conversion Matrix')}
                className="text-xs text-indigo-700 hover:underline font-mono"
              >
                Export Matrix CSV →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600 text-[11px]">
                    <th className="py-2.5 px-3">Lab App No</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Colour &amp; Fabric</th>
                    <th className="py-2.5 px-3">Delta E</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Bulk Order No</th>
                    <th className="py-2.5 px-3 text-right">Bulk Quantity</th>
                    <th className="py-2.5 px-3 text-center">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {labApprovals.map(lab => (
                    <tr key={lab.labAppNo} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3"><LabAppBadge labAppNo={lab.labAppNo} size="sm" /></td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{lab.customer}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <ColorSwatch colorName={lab.colorName} colorHex={lab.colorHex} size="sm" />
                          <span className="font-mono text-slate-500 text-[11px]">({lab.fabric})</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-800">ΔE {lab.deltaE.toFixed(2)}</td>
                      <td className="py-2.5 px-3"><StatusBadge status={lab.approvalStatus} size="sm" /></td>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-900">{lab.linkedBulkOrderNo || '—'}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {bulkOrders.find(b => b.labAppNo === lab.labAppNo)?.orderQtyKg.toLocaleString() || '—'} {lab.linkedBulkOrderNo ? 'KG' : ''}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        {lab.linkedBulkOrderNo ? (
                          <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ✓ CONVERTED
                          </span>
                        ) : (
                          <span className="text-slate-400">PENDING</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: BULK ORDERS BY CUSTOMER */}
      {activeReportTab === 'by-customer' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d1d9e2] rounded-lg shadow-sm p-5">
            <h3 className="font-bold text-sm text-slate-900 font-display mb-4">
              Customer Account Tonnage &amp; Lot Distribution
            </h3>

            <div className="space-y-4">
              {Object.entries(customerVolumes).map(([customer, volumeKg]) => {
                const customerOrders = bulkOrders.filter(b => b.customer === customer);
                const pct = Math.round((volumeKg / 12500) * 100);

                return (
                  <div key={customer} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{customer}</h4>
                        <span className="text-xs text-slate-500 font-mono">
                          {customerOrders.length} Bulk Orders Booked
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-base font-bold text-indigo-950 font-numeric">{volumeKg.toLocaleString()} KG</span>
                        <span className="text-xs text-slate-500 block font-sans">{pct}% of plant load</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-700 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      {customerOrders.map(o => (
                        <span key={o.bulkOrderNo} className="bg-white px-2 py-1 rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                          {o.bulkOrderNo} ({o.colorName} · {o.orderQtyKg} KG)
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* REPORT 3: BULK QUANTITY BY COLOUR */}
      {activeReportTab === 'by-color' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d1d9e2] rounded-lg shadow-sm p-5">
            <h3 className="font-bold text-sm text-slate-900 font-display mb-4">
              Dyehouse Volume by Shade Family &amp; Dyestuff Consumption
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(colorVolumes).map(([colorName, volumeKg]) => {
                const sampleOrder = bulkOrders.find(b => b.colorName === colorName);
                const pct = Math.round((volumeKg / 12500) * 100);

                return (
                  <div key={colorName} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ColorSwatch colorName={colorName} colorHex={sampleOrder?.colorHex || '#333'} size="md" />
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-base font-bold text-slate-900 font-numeric">{volumeKg.toLocaleString()} KG</span>
                        <span className="text-xs text-slate-500 block font-sans">{pct}% of batch volume</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-800 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>Reactive Dosing: ~{(volumeKg * 0.035).toFixed(1)} KG</span>
                      <span>Auxiliaries: ~{(volumeKg * 0.12).toFixed(1)} KG</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* REPORT 4: PRODUCTION PENDING */}
      {activeReportTab === 'prod-pending' && (
        <div className="bg-white border border-[#d1d9e2] rounded-lg shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Machine Backlog &amp; Vessel Loading Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active lots currently queued or processing across softflow vessels.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-1 rounded border border-indigo-200 font-numeric">
              {pendingBatches.reduce((s, b) => s + b.quantityKg, 0).toLocaleString()} KG Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingBatches.map(batch => (
              <div key={batch.batchId} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{batch.bulkOrderNo}</span>
                    <LabAppBadge labAppNo={batch.labAppNo} size="sm" />
                    <StatusBadge status={batch.stage} size="sm" />
                  </div>
                  <div className="text-slate-600">
                    {batch.customer} — <strong>{batch.colorName}</strong> ({batch.fabric})
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-bold text-slate-900 text-sm font-numeric">{batch.quantityKg.toLocaleString()} KG</div>
                  <div className="text-[11px] text-slate-500">{batch.machineVessel.split('(')[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT 5: DELIVERY PENDING */}
      {activeReportTab === 'delivery-pending' && (
        <div className="bg-white border border-[#d1d9e2] rounded-lg shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Dispatch Pipeline &amp; Finished Warehouse Goods
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rolls in dispatch bay awaiting final delivery and POD sign-off.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-teal-900 bg-teal-50 px-2 py-1 rounded border border-teal-200 font-numeric">
              {pendingDeliveries.reduce((s, d) => s + d.quantityKg, 0).toLocaleString()} KG In Transit / Ready
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingDeliveries.map(del => (
              <div key={del.deliveryId} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{del.deliveryId}</span>
                    <span className="font-mono text-indigo-900 font-semibold">{del.bulkOrderNo}</span>
                    <StatusBadge status={del.deliveryStatus} size="sm" />
                  </div>
                  <div className="text-slate-600">
                    {del.customer} — <strong>{del.colorName}</strong>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-bold text-slate-900 font-numeric">{del.quantityKg.toLocaleString()} KG ({del.rollsCount} Rolls)</div>
                  <div className="text-[11px] text-slate-500">{del.vehicleNo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT 6: DELAYED & RISK DELIVERIES */}
      {activeReportTab === 'delayed' && (
        <div className="bg-white border border-[#d1d9e2] rounded-lg shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Order Compliance &amp; Delivery SLA Risk Report
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Orders requiring priority machine allocation to prevent shipping delays.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200">
              {delayedOrders.length} Watchlist Orders
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {delayedOrders.map(order => (
              <div key={order.bulkOrderNo} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-950">{order.bulkOrderNo}</span>
                    <LabAppBadge labAppNo={order.labAppNo} size="sm" />
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-amber-300">
                      SLA RISK: DUE {order.requiredDeliveryDate}
                    </span>
                  </div>
                  <div className="text-slate-700">
                    Buyer: <strong>{order.customer}</strong> · {order.fabric} ({order.colorName})
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => openTraceFor(order.labAppNo)}
                    className="px-3 py-1 bg-slate-900 text-amber-300 rounded font-mono text-xs font-bold hover:bg-slate-800"
                  >
                    Trace Audit →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
