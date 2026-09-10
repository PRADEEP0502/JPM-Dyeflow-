import React, { useState } from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { LabAppBadge } from '../common/LabAppBadge';
import { ColorSwatch } from '../common/ColorSwatch';
import { StatusBadge } from '../common/StatusBadge';
import { 
  CheckCircle2, 
  XCircle, 
  Plus, 
  AlertTriangle
} from 'lucide-react';
import { LabApproval, LabApprovalStatus } from '../../types';

export const CustomerApprovalsView: React.FC = () => {
  const { 
    labApprovals, 
    updateLabApprovalStatus, 
    createBulkOrderFromLab, 
    setActiveTab
  } = useDyeFlow();

  const [activeTabFilter, setActiveTabFilter] = useState<string>('ALL');
  const [rejectModalLab, setRejectModalLab] = useState<LabApproval | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  const filteredApprovals = labApprovals.filter(lab => {
    if (activeTabFilter !== 'ALL' && lab.approvalStatus !== activeTabFilter) return false;
    return true;
  });

  const handleApprove = (labAppNo: string) => {
    updateLabApprovalStatus(labAppNo, 'Approved');
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalLab) return;
    updateLabApprovalStatus(rejectModalLab.labAppNo, 'Rejected', rejectionReasonText);
    setRejectModalLab(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Customer Approvals
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review lab strike-offs, capture customer feedback, and book bulk lots.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['ALL', 'Awaiting Customer', 'Approved', 'Rejected'].map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTabFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTabFilter === tab
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'ALL' ? `All (${labApprovals.length})` : tab}
          </button>
        ))}
      </div>

      {/* Clean Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApprovals.map((lab) => {
          const isAwaiting = lab.approvalStatus === 'Awaiting Customer';
          const isApproved = lab.approvalStatus === 'Approved';
          const isRejected = lab.approvalStatus === 'Rejected' || lab.approvalStatus === 'Resubmission Required';

          return (
            <div 
              key={lab.labAppNo}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <LabAppBadge labAppNo={lab.labAppNo} size="sm" />
                  <StatusBadge status={lab.approvalStatus} size="sm" />
                </div>

                <div className="mt-2">
                  <h3 className="font-bold text-sm text-slate-900">{lab.customer}</h3>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <ColorSwatch colorName={lab.colorName} colorHex={lab.colorHex} size="sm" />
                    <span className="text-slate-500 font-mono text-[11px]">{lab.fabric}</span>
                  </div>
                </div>

                {/* Swatches & Dates */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Submitted</span>
                    <span className="font-medium text-slate-800">{lab.requestDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Delta E</span>
                    <span className="font-medium text-emerald-700">ΔE {lab.deltaE.toFixed(2)}</span>
                  </div>
                </div>

                {/* Rejection reason if rejected */}
                {isRejected && lab.rejectionReason && (
                  <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900">
                    <strong className="block text-[11px]">Rejection Reason:</strong>
                    <span>{lab.rejectionReason}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {isAwaiting && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(lab.labAppNo)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectModalLab(lab);
                        setRejectionReasonText('Shade off-tone under store lighting.');
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 rounded text-xs font-semibold"
                    >
                      Reject
                    </button>
                  </>
                )}

                {isApproved && (
                  <div className="w-full flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold font-mono">Approved {lab.approvalDate}</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('bulk-orders')}
                      className="text-slate-900 font-semibold hover:underline"
                    >
                      View Bulk PO →
                    </button>
                  </div>
                )}

                {isRejected && (
                  <button
                    type="button"
                    onClick={() => handleApprove(lab.labAppNo)}
                    className="text-xs text-slate-700 hover:underline font-semibold"
                  >
                    Re-approve Revision
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Rejection Reason */}
      {rejectModalLab && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-slate-900">
              Reject Lab Sample: {rejectModalLab.labAppNo}
            </h3>
            <form onSubmit={handleConfirmRejection} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReasonText}
                  onChange={(e) => setRejectionReasonText(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalLab(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-700 text-white font-semibold rounded"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
