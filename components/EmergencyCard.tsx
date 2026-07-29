'use client';

import React from 'react';
import { PhoneCall, ShieldAlert, Navigation, ArrowRight } from 'lucide-react';

interface EmergencyCardProps {
  emergencyAction?: string;
  onCallClick?: () => void;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({
  emergencyAction = "Seek immediate emergency medical attention. Call emergency services or visit the nearest hospital emergency room immediately.",
  onCallClick
}) => {
  return (
    <div className="bg-gradient-to-r from-red-600 via-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-red-600/30 border-2 border-red-400 relative overflow-hidden my-6">
      
      {/* Subtle Background Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-red-400/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shrink-0 animate-bounce-light">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-red-700 tracking-wider uppercase">
                CRITICAL ALERT
              </span>
              <span className="text-red-100 text-xs font-semibold">Red Flag Emergency Symptoms Detected</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              EMERGENCY MEDICAL ATTENTION REQUIRED
            </h2>
            <p className="text-red-100 font-medium text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {emergencyAction}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 mt-4 sm:mt-0">
          <a
            href="tel:911"
            onClick={onCallClick}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-white text-red-700 font-extrabold hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg shadow-black/20 text-center"
          >
            <PhoneCall className="w-5 h-5 animate-pulse text-red-600" />
            <span>CALL EMERGENCY (911 / 112 / 108)</span>
          </a>
        </div>

      </div>

      {/* Immediate Guidance Bullet Checklist */}
      <div className="mt-6 pt-6 border-t border-red-500/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-semibold text-red-50">
        <div className="flex items-center space-x-2 bg-red-800/40 p-2.5 rounded-xl border border-red-400/30">
          <ArrowRight className="w-4 h-4 text-red-200 shrink-0" />
          <span>Do not attempt to drive yourself</span>
        </div>
        <div className="flex items-center space-x-2 bg-red-800/40 p-2.5 rounded-xl border border-red-400/30">
          <ArrowRight className="w-4 h-4 text-red-200 shrink-0" />
          <span>Keep airways clear & lie or sit comfortably</span>
        </div>
        <div className="flex items-center space-x-2 bg-red-800/40 p-2.5 rounded-xl border border-red-400/30">
          <ArrowRight className="w-4 h-4 text-red-200 shrink-0" />
          <span>Unlock front door for paramedical responders</span>
        </div>
      </div>

    </div>
  );
};
