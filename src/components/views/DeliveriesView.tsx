import React, { useState } from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { LabAppBadge } from '../common/LabAppBadge';
import { ColorSwatch } from '../common/ColorSwatch';
import { StatusBadge } from '../common/StatusBadge';
import { Truck, CheckCircle2, Send, PackageCheck } from 'lucide-react';
import { DeliveryRecord } from '../../types';

export const DeliveriesView: React.FC = () => {
  const { 
    deliveryRecords, 
    dispatchDelivery, 
    recordProofOfDelivery, 
    openTraceFor 
  } = useDyeFlow();

  const [dispatchItem, setDispatchItem] = useState<DeliveryRecord | null>(null);
  const [vehicleNo, setVehicleNo] = useState('TN 39 BK 4821');
  const [driverName, setDriverName] = useState('P. Murugesan');

  const [podItem, setPodItem] = useState<DeliveryRecord | null>(null);
  const [receiverName, setReceiverName] = useState('S. Karthik (Stores Head)');

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchItem) return;
    dispatchDelivery(dispatchItem.deliveryId, vehicleNo, driverName, '+91 98421 88301', '331092817462');
    setDispatchItem(null);
  };

  const handleConfirmPod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podItem) return;
    recordProofOfDelivery(podItem.deliveryId, receiverName, 'Received in good condition.');
    setPodItem(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Delivery &amp; Logistics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Production Complete → Ready for Delivery → Dispatched → Delivered
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-3 px-4">Delivery ID</th>
                <th className="py-3 px-4">Bulk Order</th>
                <th className="py-3 px-4">Lab App No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Colour</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Vehicle / Driver</th>
                <th className="py-3 px-4">Dispatch Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveryRecords.map((del) => {
                const isReady = del.deliveryStatus === 'Ready for Delivery' || del.deliveryStatus === 'Production Complete';
                const isDispatched = del.deliveryStatus === 'Dispatched';
                const isDelivered = del.deliveryStatus === 'Delivered';

                return (
                  <tr key={del.deliveryId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{del.deliveryId}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{del.bulkOrderNo}</td>
                    <td className="py-3.5 px-4"><LabAppBadge labAppNo={del.labAppNo} size="sm" /></td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{del.customer}</td>
                    <td className="py-3.5 px-4"><ColorSwatch colorName={del.colorName} colorHex={del.colorHex} size="sm" /></td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">{del.quantityKg.toLocaleString()} KG</td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono">
                      <div>{del.vehicleNo}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{del.driverName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{del.dispatchDate}</td>
                    <td className="py-3.5 px-4 text-center"><StatusBadge status={del.deliveryStatus} size="sm" /></td>
                    <td className="py-3.5 px-4 text-right">
                      {isReady && (
                        <button
                          type="button"
                          onClick={() => setDispatchItem(del)}
                          className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold"
                        >
                          Dispatch
                        </button>
                      )}
                      {isDispatched && (
                        <button
                          type="button"
                          onClick={() => setPodItem(del)}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold"
                        >
                          Mark Delivered (POD)
                        </button>
                      )}
                      {isDelivered && (
                        <span className="text-emerald-700 font-bold font-mono text-[11px]">✓ POD Signed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-slate-900">Dispatch Delivery: {dispatchItem.deliveryId}</h3>
            <form onSubmit={handleConfirmDispatch} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Vehicle Registration No</label>
                <input
                  type="text"
                  required
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Driver Name</label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchItem(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-700 text-white font-semibold rounded"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POD Modal */}
      {podItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-slate-900">Confirm Delivery: {podItem.deliveryId}</h3>
            <form onSubmit={handleConfirmPod} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Receiver Name / Designation</label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPodItem(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 text-white font-semibold rounded"
                >
                  Save POD Sign-off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
