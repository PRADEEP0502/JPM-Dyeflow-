import { X } from 'lucide-react';
import { LdnItem } from '../../types';
import { LRN_DATA } from '../../data/mockData';
import { daysBetween, parseDisplayDate } from '../../utils/format';

interface LdnDetailModalProps {
  item: LdnItem;
  onClose: () => void;
}

export function LdnDetailModal({ item, onClose }: LdnDetailModalProps) {
  const isConverted = item.result === 'Bulk Order Found';
  const lrn = LRN_DATA.find((record) => record.lrnNo === item.lrnNo);

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-900/40 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-5 my-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">Record Detail</span>
            <h3 className="text-lg font-semibold text-neutral-900 font-mono uppercase tracking-wide mt-0.5">{item.ldnNo}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl">
          <div>
            <span className="text-neutral-400 block">Customer</span>
            <strong className="text-neutral-900 text-sm font-medium block mt-0.5 truncate">{item.customer}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">Colour / Shade</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {item.colorHex && (
                <span
                  className="w-3 h-3 rounded-full border border-neutral-200 shrink-0"
                  style={{ backgroundColor: item.colorHex }}
                />
              )}
              <strong className="text-neutral-900 text-sm font-medium truncate">{item.colorName}</strong>
            </div>
          </div>
          <div>
            <span className="text-neutral-400 block">Fabric</span>
            <strong className="text-neutral-900 text-sm font-medium block mt-0.5 truncate">{item.fabric}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">Lab Approval Ref</span>
            <strong className="text-neutral-900 font-mono text-sm block mt-0.5 truncate">{item.labAppNo}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">Delivered Date</span>
            <strong className="text-neutral-700 font-mono text-sm block mt-0.5">{item.deliveredDate}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">Elapsed</span>
            <strong className="text-neutral-700 font-mono text-sm block mt-0.5">{item.daysWaiting} days</strong>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-medium text-neutral-900">LRN Inward</span>
                <div className="text-neutral-400 text-[11px]">Lab receive entry ({item.lrnNo})</div>
              </div>
              <span className="text-emerald-700 font-medium">Received</span>
            </div>

            {lrn && (
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-neutral-500 bg-neutral-50 rounded-lg p-3">
                <div>
                  Date <span className="block text-neutral-800 font-medium">{lrn.date}</span>
                </div>
                <div>
                  Party Group <span className="block text-neutral-800 font-medium">{lrn.partyGroup}</span>
                </div>
                <div>
                  Contact <span className="block text-neutral-800 font-medium">{lrn.contact}</span>
                </div>
                <div>
                  Contact No <span className="block text-neutral-800 font-medium">{lrn.contactNo}</span>
                </div>
                <div>
                  Buyer <span className="block text-neutral-800 font-medium">{lrn.buyer}</span>
                </div>
                <div>
                  Mark No <span className="block text-neutral-800 font-medium">{lrn.markNo}</span>
                </div>
                <div>
                  Order No <span className="block text-neutral-800 font-medium">{lrn.orderNo}</span>
                </div>
                <div>
                  Match Source <span className="block text-neutral-800 font-medium">{lrn.matchSource}</span>
                </div>
                <div>
                  MLR <span className="block text-neutral-800 font-medium">{lrn.mlr}</span>
                </div>
                <div>
                  Expected Delivery <span className="block text-neutral-800 font-medium">{lrn.expectedDeliveryDate}</span>
                </div>
                {lrn.remarks && (
                  <div className="col-span-2">
                    Remarks <span className="block text-neutral-800 font-medium">{lrn.remarks}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-medium text-neutral-900">Lab Processing</span>
              <div className="text-neutral-400 text-[11px]">Dye trial & shade match</div>
            </div>
            <span className="text-emerald-700 font-medium">Completed</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-medium text-neutral-900">LDN Delivered</span>
              <div className="text-neutral-400 text-[11px]">Sample handed to customer ({item.ldnNo})</div>
            </div>
            <span className="text-emerald-700 font-medium">Delivered</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-medium text-neutral-900">ERP Bulk Order Check</span>
              <div className="text-neutral-400 text-[11px]">
                {isConverted ? 'Matched with sales order in ERP' : 'Pending sales order entry'}
              </div>
            </div>
            <span className={`font-medium ${isConverted ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isConverted ? 'Matched' : 'Waiting'}
            </span>
          </div>
        </div>

        {isConverted ? (
          <div className="p-3.5 bg-emerald-50 rounded-xl text-xs">
            <div className="font-semibold text-emerald-800">Final Result: Bulk Order Confirmed</div>
            <div className="mt-1 text-neutral-700 font-mono text-xs">
              {item.bulkOrderNo} · {item.bulkQty}
            </div>
            {item.bulkOrderDate && (
              <div className="mt-1 text-emerald-700 text-xs">
                Converted on {item.bulkOrderDate} —{' '}
                {daysBetween(parseDisplayDate(item.deliveredDate), parseDisplayDate(item.bulkOrderDate))}d after delivery
              </div>
            )}
          </div>
        ) : (
          <div className="p-3.5 bg-amber-50 rounded-xl text-xs">
            <div className="font-semibold text-amber-800">Final Result: Pending Bulk Order</div>
            <div className="text-amber-700 mt-1 text-xs">
              Delivered {item.daysWaiting} days ago. No sales order logged in ERP yet.
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
