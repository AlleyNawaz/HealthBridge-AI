'use client';

import React from 'react';
import { ShieldAlert, PhoneCall, MapPin, X } from 'lucide-react';

interface EmergencyOverlayProps {
  onDismiss?: () => void;
  onLocateHospitals?: () => void;
}

export const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({ onDismiss, onLocateHospitals }) => {
  return (
    <div className="fixed inset-0 z-50 bg-red-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-gradient-to-b from-red-600 to-rose-700 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-white shadow-2xl border-4 border-red-400 relative text-center">
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-red-800/60 hover:bg-red-800 text-white"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Pulsing Shield Icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white/20 animate-ping absolute" />
          <div className="w-20 h-20 rounded-full bg-white text-red-600 flex items-center justify-center shadow-xl relative">
            <ShieldAlert className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <span className="px-3.5 py-1 rounded-full text-xs font-black bg-white text-red-700 uppercase tracking-widest block w-fit mx-auto mb-3">
          CRITICAL MEDICAL ALERT
        </span>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
          SEEK EMERGENCY CARE IMMEDIATELY
        </h2>

        <p className="text-red-100 font-medium text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Gemma 4 has classified your symptoms as a life-threatening medical emergency. Do not attempt to drive yourself. Request immediate emergency medical dispatch.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:911"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-white text-red-700 font-extrabold text-lg shadow-xl hover:bg-red-50 transition-all transform hover:scale-105"
          >
            <PhoneCall className="w-6 h-6 animate-pulse text-red-600" />
            <span>CALL EMERGENCY SERVICES (911 / 112 / 108)</span>
          </a>

          {onLocateHospitals && (
            <button
              onClick={onLocateHospitals}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-red-900/80 hover:bg-red-900 text-white font-extrabold text-sm border border-red-400/40 transition-all"
            >
              <MapPin className="w-5 h-5 text-red-300" />
              <span>Locate Nearest Emergency Rooms</span>
            </button>
          )}
        </div>

        {/* Emergency First-Aid Guidelines */}
        <div className="mt-8 pt-6 border-t border-red-500/50 text-left text-xs font-semibold text-red-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-red-900/40 p-3 rounded-xl border border-red-400/30">
            • Unlock front door so emergency responders can enter.
          </div>
          <div className="bg-red-900/40 p-3 rounded-xl border border-red-400/30">
            • Sit comfortably upright and avoid physical exertion.
          </div>
        </div>

      </div>
    </div>
  );
};
