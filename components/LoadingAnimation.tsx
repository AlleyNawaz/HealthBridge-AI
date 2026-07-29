'use client';

import React, { useState, useEffect } from 'react';
import { Stethoscope, Globe, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

const LOADING_STEPS = [
  { icon: Globe, label: "Detecting & Understanding Input Language..." },
  { icon: Stethoscope, label: "Retrieving CDC & WHO Evidence-Based Guidelines..." },
  { icon: ShieldAlert, label: "Gemma 4 Assessing Urgency & Safety Red-Flags..." },
  { icon: Sparkles, label: "Formulating Multilingual Triage & Action Plan..." },
];

export const LoadingAnimation: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = LOADING_STEPS[currentStepIndex].icon;

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl border border-emerald-500/20 max-w-xl mx-auto my-8">
      
      {/* Animated Pulse Icon */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 animate-ping absolute"></div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 relative">
          <CurrentIcon className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-white">
        Gemma 4 Clinical Triage Active
      </h3>
      
      <div className="flex items-center justify-center space-x-2 text-emerald-300 font-medium text-sm sm:text-base mb-6">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
        <span>{LOADING_STEPS[currentStepIndex].label}</span>
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden max-w-md mx-auto">
        <div 
          className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 flex justify-center space-x-2">
        {LOADING_STEPS.map((_, idx) => (
          <span 
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentStepIndex 
                ? 'w-6 bg-emerald-400' 
                : idx < currentStepIndex 
                ? 'w-2 bg-emerald-600' 
                : 'w-2 bg-slate-700'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
