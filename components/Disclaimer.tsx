'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerProps {
  text?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  text = 'HealthBridge AI provides automated medical health triage assistance and evidence-based guidance only. It DOES NOT diagnose diseases or prescribe treatment. If you are experiencing a life-threatening emergency, call emergency services immediately.'
}) => {
  return (
    <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-xl text-slate-700 text-xs sm:text-sm shadow-xs">
      <div className="flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-1">
            Mandatory Medical Safety Disclaimer
          </h4>
          <p className="leading-relaxed text-slate-600 font-medium">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};
