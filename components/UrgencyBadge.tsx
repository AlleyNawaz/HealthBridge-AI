'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { UrgencyLevel } from '@/types/triage';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, className = '' }) => {
  switch (urgency) {
    case 'Emergency':
      return (
        <span className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-red-100 text-red-700 border border-red-300 shadow-sm animate-pulse ${className}`}>
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Urgency: Emergency Care Required</span>
        </span>
      );

    case 'High':
      return (
        <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-orange-100 text-orange-800 border border-orange-300 ${className}`}>
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <span>Urgency: High Concern</span>
        </span>
      );

    case 'Moderate':
      return (
        <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-amber-100 text-amber-900 border border-amber-300 ${className}`}>
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Urgency: Moderate Attention</span>
        </span>
      );

    case 'Low':
    default:
      return (
        <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Urgency: Low / Routine Care</span>
        </span>
      );
  }
};
