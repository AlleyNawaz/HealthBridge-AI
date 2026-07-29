'use client';

import React from 'react';
import { Download, Printer } from 'lucide-react';
import { TriageResult } from '@/types/triage';

interface PdfExportButtonProps {
  triage: TriageResult;
}

export const PdfExportButton: React.FC<PdfExportButtonProps> = ({ triage }) => {
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrintReport}
      className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 transition-all shadow-xs"
      title="Download or Print PDF Triage Summary"
    >
      <Printer className="w-4 h-4 text-slate-600" />
      <span>Print / PDF Export</span>
    </button>
  );
};
