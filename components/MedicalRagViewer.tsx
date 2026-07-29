'use client';

import React, { useState } from 'react';
import { BookOpen, ShieldCheck, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface MedicalRagViewerProps {
  sources?: Array<{
    id: string;
    title: string;
    source: string;
    relevance: string;
    guidanceText?: string;
  }>;
}

export const MedicalRagViewer: React.FC<MedicalRagViewerProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 my-6">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                Clinical RAG Context Injected
              </span>
              <span className="bg-emerald-200 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {sources.length} Guideline{sources.length > 1 ? 's' : ''} Matched
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              Verified clinical protocols from {sources.map(s => s.source).join(', ')} injected into Gemma 4 reasoning prompt
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-emerald-700 text-xs font-bold">
          <span>{isOpen ? 'Hide Details' : 'View Guidelines'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3">
          {sources.map((src, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {src.source} Guidance
                </span>
                <span className="text-slate-500 font-medium">{src.relevance}</span>
              </div>
              <h5 className="font-bold text-slate-900 text-sm mb-1">{src.title}</h5>
              {src.guidanceText && (
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {src.guidanceText}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
