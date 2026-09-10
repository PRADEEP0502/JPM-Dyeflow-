import React from 'react';
import { LabApprovalStatus, ProductionStatus, DeliveryStatus } from '../../types';

interface StatusBadgeProps {
  status: LabApprovalStatus | ProductionStatus | DeliveryStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showDot = true 
}) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (status) {
    // Lab & Customer Approvals
    case 'Approved':
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
      dotColor = 'bg-emerald-500';
      break;
    case 'Awaiting Customer':
      badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300 font-medium';
      dotColor = 'bg-amber-500 animate-pulse';
      break;
    case 'Rejected':
      badgeStyle = 'bg-rose-50 text-rose-800 border-rose-300 font-medium';
      dotColor = 'bg-rose-500';
      break;
    case 'Resubmission Required':
      badgeStyle = 'bg-orange-50 text-orange-800 border-orange-300 font-medium';
      dotColor = 'bg-orange-500';
      break;

    // Production Stages
    case 'Queued':
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
      dotColor = 'bg-slate-400';
      break;
    case 'Dyeing':
      badgeStyle = 'bg-sky-50 text-sky-800 border-sky-300 font-medium';
      dotColor = 'bg-sky-500 animate-pulse';
      break;
    case 'QC':
      badgeStyle = 'bg-purple-50 text-purple-800 border-purple-300 font-medium';
      dotColor = 'bg-purple-500';
      break;
    case 'Completed':
      badgeStyle = 'bg-teal-50 text-teal-800 border-teal-300 font-medium';
      dotColor = 'bg-teal-500';
      break;

    // Delivery
    case 'Production Complete':
      badgeStyle = 'bg-indigo-50 text-indigo-800 border-indigo-300';
      dotColor = 'bg-indigo-500';
      break;
    case 'Ready for Delivery':
      badgeStyle = 'bg-cyan-50 text-cyan-800 border-cyan-300 font-medium';
      dotColor = 'bg-cyan-500';
      break;
    case 'Dispatched':
      badgeStyle = 'bg-blue-50 text-blue-800 border-blue-300 font-medium';
      dotColor = 'bg-blue-500 animate-pulse';
      break;
    case 'Delivered':
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
      dotColor = 'bg-emerald-600';
      break;

    // Order Stages
    case 'In Progress':
      badgeStyle = 'bg-sky-50 text-sky-800 border-sky-300';
      dotColor = 'bg-sky-500';
      break;
    case 'Awaiting Approval':
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300';
      dotColor = 'bg-amber-500';
      break;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 tracking-tight',
    md: 'text-xs px-2.5 py-1 tracking-tight',
    lg: 'text-sm px-3 py-1.5 font-medium'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border ${badgeStyle} ${sizeClasses} whitespace-nowrap`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{status}</span>
    </span>
  );
};
