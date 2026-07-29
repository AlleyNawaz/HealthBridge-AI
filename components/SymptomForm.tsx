'use client';

import React, { useState, useEffect } from 'react';
import { Send, Trash2, Sparkles, AlertCircle, Globe, Stethoscope, ArrowRight } from 'lucide-react';
import { VoiceController } from './VoiceController';

interface SymptomFormProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  { label: 'English', text: 'I have fever and headache for two days.' },
  { label: 'Hindi', text: 'मुझे 2 दिन से बुखार और सिरदर्द है।' },
  { label: 'Urdu', text: 'مجھے دو دنوں سے بخار اور سر میں درد ہے۔' },
  { label: 'Bengali', text: 'আমার দুই দিন ধরে জ্বর ও মাথা ব্যথা করছে।' },
  { label: 'Tamil', text: 'எனக்கு இரண்டு நாட்களாக காய்ச்சலும் தலைவலியும் உள்ளது.' },
  { label: 'Spanish', text: 'Tengo fiebre y dolor de cabeza desde hace dos días.' },
  { label: 'Red-Flag Emergency', text: 'I have severe crushing chest pain and difficulty breathing.' }
];

export const SymptomForm: React.FC<SymptomFormProps> = ({ onSubmit, isLoading }) => {
  const [symptomText, setSymptomText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [detectedScript, setDetectedScript] = useState('English');

  // Real-time script detection preview
  useEffect(() => {
    if (!symptomText) {
      setDetectedScript('Auto Detect');
      return;
    }
    if (/[\u0900-\u097F]/.test(symptomText)) setDetectedScript('Hindi (हिंदी)');
    else if (/[\u0600-\u06FF]/.test(symptomText)) setDetectedScript('Urdu (اردو)');
    else if (/[\u0980-\u09FF]/.test(symptomText)) setDetectedScript('Bengali (বাংলা)');
    else if (/[\u0B80-\u0BFF]/.test(symptomText)) setDetectedScript('Tamil (தமிழ்)');
    else if (/[\u0A00-\u0A7F]/.test(symptomText)) setDetectedScript('Punjabi (ਪੰਜਾਬੀ)');
    else if (/\b(tengo|fiebre|dolor|cabeza|tos)\b/i.test(symptomText)) setDetectedScript('Spanish (Español)');
    else setDetectedScript('English');
  }, [symptomText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) {
      setErrorMsg('Please describe your symptoms before analyzing.');
      return;
    }
    setErrorMsg('');
    onSubmit(symptomText.trim());
  };

  const handleClear = () => {
    setSymptomText('');
    setErrorMsg('');
  };

  const handleSampleClick = (sampleText: string) => {
    setSymptomText(sampleText);
    setErrorMsg('');
  };

  const handleVoiceInput = (recognizedText: string) => {
    setSymptomText((prev) => (prev ? `${prev} ${recognizedText}` : recognizedText));
    setErrorMsg('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-emerald-500/10 border border-slate-200/80 mb-10 transition-all hover:border-emerald-300/80">
      
      {/* Input Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Describe Your Symptoms
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Write or record in your native language. Gemma 4 auto-detects and responds matching your tongue.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Live Script Detection Tag */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Script:</span>
            <span className="text-emerald-700 font-extrabold">{detectedScript}</span>
          </div>

          <VoiceController onSpeechResult={handleVoiceInput} />
        </div>
      </div>

      {/* Textarea Input Container */}
      <div className="relative mb-6">
        <textarea
          id="symptoms-textarea"
          rows={4}
          value={symptomText}
          onChange={(e) => {
            setSymptomText(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          placeholder="Describe your symptoms (e.g. 'I have fever and headache for two days', 'मुझे 2 दिन से बुखार और सिरदर्द है', 'severe chest pain')..."
          className="w-full rounded-2xl border-2 border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 p-5 text-slate-900 placeholder-slate-400 font-medium text-base sm:text-lg transition-all outline-none resize-y leading-relaxed bg-slate-50/50 focus:bg-white"
          disabled={isLoading}
        />
        {symptomText && (
          <span className="absolute bottom-4 right-4 text-xs font-bold text-slate-400 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200">
            {symptomText.length} chars
          </span>
        )}
      </div>

      {/* Validation Error Message */}
      {errorMsg && (
        <div className="flex items-center space-x-2 text-red-600 text-sm font-semibold mb-6 bg-red-50 p-4 rounded-2xl border border-red-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Multilingual Example Prompt Chips */}
      <div className="mb-8 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-3">
          Or Select Example Prompt:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample.text)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all transform hover:scale-[1.02] active:scale-95 ${
                sample.label === 'Red-Flag Emergency'
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400 hover:text-emerald-900 shadow-xs'
              }`}
            >
              <span className="text-slate-400 mr-1.5 font-semibold">[{sample.label}]</span>
              <span>"{sample.text}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Gemma 4 evaluates symptoms, safety red-flags, and CDC/WHO guidelines</span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading || !symptomText}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4 text-slate-500" />
            <span>Clear</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || !symptomText.trim()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-base shadow-xl shadow-emerald-600/25 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:transform-none"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? 'Analyzing...' : 'Analyze Symptoms'}</span>
          </button>
        </div>
      </div>

    </form>
  );
};
