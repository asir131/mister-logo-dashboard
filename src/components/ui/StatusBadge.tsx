import React from 'react';
interface StatusBadgeProps {
  status: string;
  type?: 'user' | 'post' | 'issue';
}
export function StatusBadge({
  status,
  type = 'user'
}: StatusBadgeProps) {
  let styles = '';
  // Determine styles based on status string content
  const s = status.toLowerCase();
  if (s === 'active' || s === 'resolved' || s === 'open') {
    styles = 'bg-success-bg text-success-text border-green-500/20';
  } else if (s === 'restricted' || s === 'reported' || s === 'suspended' || s === 'removed') {
    styles = 'bg-error-bg text-error-text border-red-500/20';
  } else if (s === 'in progress') {
    styles = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  } else {
    styles = 'bg-slate-700/50 text-slate-300 border-slate-600';
  }
  return <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${styles}
    `}>
      {status}
    </span>;
}