'use client';

import React from 'react';
import { 
  Stethoscope, 
  Activity, 
  HelpCircle, 
  ListCheck, 
  AlertTriangle, 
  Globe, 
  Gauge,
  Clock,
  Sparkles,
  Download,
  Printer
} from 'lucide-react';
import { TriageResult } from '@/types/triage';
import { UrgencyBadge } from './UrgencyBadge';
import { LanguageBadge } from './LanguageBadge';
import { Disclaimer } from './Disclaimer';
import { EmergencyCard } from './EmergencyCard';
import { ToolResultsView } from './ToolResultsView';
import { VoiceController } from './VoiceController';
import { MedicalRagViewer } from './MedicalRagViewer';

interface ResultCardProps {
  triage: TriageResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ triage }) => {
  const {
    language,
    symptoms,
    duration,
    severity,
    urgency,
    possible_causes,
    next_steps,
    warning_signs,
    emergency,
    confidence,
    disclaimer,
    tool_result,
    rag_sources,
    model_used,
    timestamp
  } = triage;

  const audioReadText = `Health triage in ${language}. Symptoms: ${symptoms.join(', ')}. Urgency: ${urgency}. Care plan: ${next_steps.join('. ')}. Warning signs: ${warning_signs.join('. ')}.`;

  const handleDownloadTxtReport = async () => {
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(triage)
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `healthbridge_triage_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      window.print();
    }
  };

  return (
    <div id="triage-report-section" className="space-y-6 animate-fade-in">
      
      {/* Emergency Alert Card (If emergency is true) */}
      {emergency && (
        <EmergencyCard emergencyAction="Seek immediate medical attention. Call emergency services (911 / 112 / 108) or proceed to the nearest trauma hospital." />
      )}

      {/* Speech Audio & Export Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span className="font-extrabold text-slate-900 text-sm sm:text-base">
            Gemma 4 Triage Evaluation
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">({model_used})</span>
        </div>

        <div className="flex items-center space-x-2">
          <VoiceController textToRead={audioReadText} language={language} onSpeechResult={() => {}} />
          <button
            onClick={handleDownloadTxtReport}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold border border-slate-300 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Real CDC / WHO RAG Guidelines Citation */}
      <MedicalRagViewer sources={rag_sources} />

      {/* Grid of Beautiful Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1: Detected Language */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card 1</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Detected Language</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Gemma 4 native multilingual output</p>
            <LanguageBadge language={language} />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Model:</span>
            <strong className="text-slate-800">{model_used}</strong>
          </div>
        </div>

        {/* Card 2: Symptoms & Duration */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card 2</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Parsed Symptoms</h3>
            <div className="flex items-center space-x-1 text-xs text-slate-500 font-semibold mb-3">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Duration: <strong className="text-slate-800">{duration}</strong></span>
            </div>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((sym, idx) => (
                <span key={idx} className="bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold px-3 py-1.5 rounded-xl">
                  {sym}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Severity & Urgency */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card 3</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Triage & Severity</h3>
            <p className="text-xs text-slate-500 mb-3 font-medium">Severity: <strong className="text-slate-800">{severity}</strong></p>
            <UrgencyBadge urgency={urgency} />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Emergency Flag: <strong className={emergency ? 'text-red-600' : 'text-emerald-700'}>{emergency ? 'TRUE' : 'FALSE'}</strong></span>
          </div>
        </div>

        {/* Card 4: Possible Causes */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <HelpCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card 4</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Possible Causes</h3>
            <p className="text-xs text-slate-500 mb-3 font-medium">Educational guidance only</p>
            <ul className="space-y-2">
              {possible_causes.map((cause, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-semibold bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 5: Recommended Next Steps */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <ListCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card 5</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Recommended Next Steps</h3>
            <p className="text-xs text-slate-500 mb-3 font-medium">Actionable care plan</p>
            <ol className="space-y-2">
              {next_steps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-800 font-medium bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Card 6: Emergency Warning Signs */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card 6</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Emergency Warning Signs</h3>
            <p className="text-xs text-slate-500 mb-3 font-medium">Red flags to watch for</p>
            <ul className="space-y-2">
              {warning_signs.map((sign, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-800 font-semibold bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Gemma Tool Call Execution Result */}
      {tool_result && (
        <ToolResultsView toolCall={tool_result} />
      )}

      {/* Card 7: Confidence Score & Disclaimer */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase text-purple-700 tracking-wider">Gemma 4 Confidence Score</span>
            <div className="text-2xl font-black text-slate-900">{(confidence * 100).toFixed(0)}%</div>
          </div>
        </div>

        <div className="flex-1 max-w-xl">
          <Disclaimer text={disclaimer} />
        </div>
      </div>

    </div>
  );
};
