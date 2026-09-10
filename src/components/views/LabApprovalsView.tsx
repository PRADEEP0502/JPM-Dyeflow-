import React, { useState } from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { LabAppBadge } from '../common/LabAppBadge';
import { ColorSwatch } from '../common/ColorSwatch';
import { StatusBadge } from '../common/StatusBadge';
import { 
  FlaskConical, 
  Plus, 
  FileSpreadsheet, 
  Printer, 
  Layers
} from 'lucide-react';

export const LabApprovalsView: React.FC = () => {
  const { 
    labApprovals, 
    selectedLabAppNo, 
    setSelectedLabAppNo, 
    bulkOrders,
    createLabApproval,
    createBulkOrderFromLab,
    openTraceFor,
    addToast
  } = useDyeFlow();

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showNewSampleModal, setShowNewSampleModal] = useState(false);
  const [showBulkOrderModal, setShowBulkOrderModal] = useState(false);

  // New Lab Sample Form
  const [newCustomer, setNewCustomer] = useState('Prime Global Industries');
  const [newColorName, setNewColorName] = useState('CRIMSON RED');
  const [newColorHex, setNewColorHex] = useState('#b91c1c');
  const [newTargetHex, setNewTargetHex] = useState('#991b1b');
  const [newFabric, setNewFabric] = useState('LOOPKNIT');
  const [newSampleWeight, setNewSampleWeight] = useState(250);
  const [newMachineNo, setNewMachineNo] = useState('P6073 / PSK6072');
  const [newCdcNo, setNewCdcNo] = useState('1402');

  // New Bulk Order Form
  const [bulkQtyKg, setBulkQtyKg] = useState(2000);
  const [bulkDeliveryDate, setBulkDeliveryDate] = useState('2026-09-18');
  const [bulkYarnLot, setBulkYarnLot] = useState('Y-9988-PGI');

  const filteredLabList = labApprovals.filter(lab => {
    if (statusFilter !== 'ALL' && lab.approvalStatus !== statusFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const match = 
        lab.labAppNo.toLowerCase().includes(q) ||
        lab.customer.toLowerCase().includes(q) ||
        lab.colorName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const selectedLab = labApprovals.find(l => l.labAppNo === selectedLabAppNo) || filteredLabList[0] || labApprovals[0];
  const linkedBulkOrder = bulkOrders.find(
    b => b.labAppNo === selectedLab?.labAppNo || b.bulkOrderNo === selectedLab?.linkedBulkOrderNo
  );

  const handleCreateSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLabApproval({
      customer: newCustomer,
      colorName: newColorName.toUpperCase(),
      colorHex: newColorHex,
      targetHex: newTargetHex,
      deltaE: 0.45,
      fabric: newFabric,
      sampleWeightKg: Number(newSampleWeight),
      machineNo: newMachineNo,
      cdcNo: newCdcNo,
      requestDate: '2026-09-09',
      dyesmith: 'K. Ramachandran',
      lightSources: ['D65', 'TL84'],
      fastness: { washing: 4.5, rubbingDry: 4.5, rubbingWet: 4.0, light: 4.5 },
      dyestuffRecipe: [
        { dyeName: 'Reactive Red RGB', code: 'RR-108', percentage: 2.5, ratio: '1:8' },
        { dyeName: 'Glauber Salt', code: 'GS-01', percentage: 50.0, ratio: 'g/l' },
        { dyeName: 'Soda Ash', code: 'SA-99', percentage: 15.0, ratio: 'g/l' }
      ]
    });
    setShowNewSampleModal(false);
  };

  const handleCreateBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLab) return;
    createBulkOrderFromLab(selectedLab.labAppNo, {
      orderQtyKg: Number(bulkQtyKg),
      requiredDeliveryDate: bulkDeliveryDate,
      yarnLotNo: bulkYarnLot,
      gsm: 240,
      diaInches: 32
    });
    setShowBulkOrderModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Lab Approvals &amp; Recipe Cards
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any Lab Approval Number to view its complete Recipe Card (RC) and Bulk Linkage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewSampleModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Lab Sample</span>
        </button>
      </div>

      {/* Split Layout: Left List | Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter list..."
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 text-xs rounded px-2 py-1.5 font-medium focus:outline-none"
            >
              <option value="ALL">All ({labApprovals.length})</option>
              <option value="Approved">Approved</option>
              <option value="Awaiting Customer">Awaiting</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredLabList.map((lab) => {
              const isSelected = selectedLab?.labAppNo === lab.labAppNo;
              return (
                <button
                  key={lab.labAppNo}
                  type="button"
                  onClick={() => setSelectedLabAppNo(lab.labAppNo)}
                  className={`w-full text-left p-3.5 flex items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-slate-100 border-l-4 border-l-slate-900 font-medium' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <LabAppBadge labAppNo={lab.labAppNo} size="sm" clickable={false} />
                    <div className="font-semibold text-xs text-slate-900">{lab.customer}</div>
                    <ColorSwatch colorName={lab.colorName} colorHex={lab.colorHex} size="sm" />
                  </div>

                  <div className="flex flex-col items-end gap-1 text-right">
                    <StatusBadge status={lab.approvalStatus} size="sm" />
                    <span className="text-[11px] text-slate-400 font-mono">{lab.requestDate}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail: Lab RC */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          {selectedLab ? (
            <div>
              {/* RC Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                    LAB RECIPE CARD (LAB RC)
                  </div>
                  <h3 className="text-xl font-bold font-mono text-white mt-0.5">
                    {selectedLab.labAppNo}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-2.5 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded text-xs font-medium flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openTraceFor(selectedLab.labAppNo)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Trace</span>
                  </button>
                </div>
              </div>

              {/* RC Body */}
              <div className="p-5 space-y-5 text-xs">
                
                {/* 6 Core Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Customer</span>
                    <strong className="text-slate-900 text-xs">{selectedLab.customer}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Colour</span>
                    <strong className="text-slate-900 text-xs">{selectedLab.colorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Fabric</span>
                    <strong className="text-slate-900 text-xs">{selectedLab.fabric}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Weight</span>
                    <strong className="text-slate-900 text-xs">{selectedLab.sampleWeightKg} KG</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">M.No (Machine No)</span>
                    <strong className="text-slate-900 text-xs">{selectedLab.machineNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">C.D.C No</span>
                    <strong className="text-slate-900 text-xs">{selectedLab.cdcNo}</strong>
                  </div>
                </div>

                {/* Swatch Compare */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-800">Shade Matching</span>
                    <span className="text-emerald-700 font-mono font-bold text-xs">
                      ΔE = {selectedLab.deltaE.toFixed(2)} (Tolerance &lt; 0.80)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[11px] text-slate-500 block mb-1">Original Shade</span>
                      <div className="h-12 rounded border border-black/10" style={{ backgroundColor: selectedLab.targetHex }} />
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[11px] text-slate-500 block mb-1">Lab Approved Shade</span>
                      <div className="h-12 rounded border border-black/10" style={{ backgroundColor: selectedLab.colorHex }} />
                    </div>
                  </div>
                </div>

                {/* Approval Status & Date */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Approval Status</span>
                    <div className="mt-0.5">
                      <StatusBadge status={selectedLab.approvalStatus} size="sm" />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[11px] block">Approved Date</span>
                    <strong className="text-slate-800 font-mono text-xs">{selectedLab.approvalDate || 'Pending Customer'}</strong>
                  </div>
                </div>

                {/* BULK ORDER LINK BOX */}
                <div className="p-4 rounded-lg bg-indigo-50/70 border-2 border-indigo-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-indigo-950">
                      BULK ORDER LINK
                    </span>
                    {linkedBulkOrder ? (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        ✓ Linked
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">Not Booked</span>
                    )}
                  </div>

                  {linkedBulkOrder ? (
                    <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded border border-indigo-100 font-mono">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Bulk Order</span>
                        <strong className="text-indigo-900 text-sm">{linkedBulkOrder.bulkOrderNo}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Bulk Quantity</span>
                        <strong className="text-slate-900 text-sm">{linkedBulkOrder.orderQtyKg.toLocaleString()} KG</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-slate-600">Ready for bulk order conversion.</p>
                      <button
                        type="button"
                        onClick={() => setShowBulkOrderModal(true)}
                        className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded text-xs font-semibold"
                      >
                        Book Bulk Order
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : null}
        </div>

      </div>

      {/* Modal: New Sample */}
      {showNewSampleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-slate-900">Register New Lab Sample</h3>
            <form onSubmit={handleCreateSampleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Customer</label>
                <input
                  type="text"
                  required
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Colour</label>
                  <input
                    type="text"
                    required
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Fabric</label>
                  <input
                    type="text"
                    required
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSampleModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded"
                >
                  Create Lab Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Book Bulk */}
      {showBulkOrderModal && selectedLab && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-slate-900">Book Bulk Order: {selectedLab.labAppNo}</h3>
            <form onSubmit={handleCreateBulkSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Quantity (KG)</label>
                <input
                  type="number"
                  required
                  value={bulkQtyKg}
                  onChange={(e) => setBulkQtyKg(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Required Delivery Date</label>
                <input
                  type="date"
                  required
                  value={bulkDeliveryDate}
                  onChange={(e) => setBulkDeliveryDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkOrderModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-900 text-white font-semibold rounded"
                >
                  Confirm Bulk Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
