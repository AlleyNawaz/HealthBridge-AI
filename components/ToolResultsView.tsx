'use client';

import React from 'react';
import { Hospital, PhoneCall, HeartHandshake, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { ToolCallResult } from '@/types/triage';

interface ToolResultsViewProps {
  toolCall?: ToolCallResult;
}

export const ToolResultsView: React.FC<ToolResultsViewProps> = ({ toolCall }) => {
  if (!toolCall || !toolCall.output) return null;

  const { toolName, output } = toolCall;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700 my-6">
      
      {/* Tool Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            {toolName === 'findNearbyHospitals' && <Hospital className="w-6 h-6" />}
            {toolName === 'lookupEmergencyContacts' && <PhoneCall className="w-6 h-6" />}
            {toolName === 'lookupFirstAid' && <HeartHandshake className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemma 4 Function Calling Executed
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {toolName === 'findNearbyHospitals' && 'Nearby Emergency Medical Facilities'}
              {toolName === 'lookupEmergencyContacts' && 'Emergency Dispatch Directory'}
              {toolName === 'lookupFirstAid' && `First-Aid Protocol: ${output.condition || 'Emergency Care'}`}
            </h3>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center space-x-1 text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time Tool Output</span>
        </span>
      </div>

      {/* Render Output: Nearby Hospitals */}
      {toolName === 'findNearbyHospitals' && output.hospitals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {output.hospitals.map((hosp: any, idx: number) => (
            <div key={idx} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
                  <span>{hosp.distance}</span>
                  <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">{hosp.openStatus}</span>
                </div>
                <h4 className="font-bold text-white text-base mb-1">{hosp.name}</h4>
                <p className="text-xs text-slate-400 mb-2">{hosp.type}</p>
                <div className="flex items-center text-xs text-slate-300 gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{hosp.address}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Wait: <strong className="text-white">{hosp.emergencyWaitTime}</strong></span>
                <a
                  href={hosp.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-emerald-400 font-bold hover:text-emerald-300"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Output: Emergency Contacts */}
      {toolName === 'lookupEmergencyContacts' && output.specializedHotlines && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {output.specializedHotlines.map((hotline: any, idx: number) => (
            <div key={idx} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">{hotline.service}</span>
                <span className="text-lg font-black text-emerald-400">{hotline.number}</span>
              </div>
              <a
                href={`tel:${hotline.number.split('/')[0].trim()}`}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Render Output: First Aid */}
      {toolName === 'lookupFirstAid' && output.steps && (
        <div className="space-y-3">
          {output.steps.map((step: string, idx: number) => (
            <div key={idx} className="flex items-start space-x-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
