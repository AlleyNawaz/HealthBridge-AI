'use client';

import React, { useState, useRef } from 'react';
import { Mic, Volume2, VolumeX, X, Check, Sparkles, AlertCircle } from 'lucide-react';

interface VoiceControllerProps {
  onSpeechResult: (text: string) => void;
  textToRead?: string;
  language?: string;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  onSpeechResult,
  textToRead,
  language = 'English'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [micStatusText, setMicStatusText] = useState('Listening to your microphone...');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    setLiveTranscript('');
    setMicStatusText('Listening to your microphone...');
    setShowVoiceModal(true);

    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMicStatusText('Web Speech API is not supported in this browser. Select a dictation sample below or type in the input box.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLocaleForLanguage(language);

      recognition.onstart = () => {
        setIsListening(true);
        setMicStatusText('🎙️ Microphone Active — Speak your symptoms clearly...');
      };

      recognition.onresult = (event: any) => {
        let transcriptAcc = '';
        for (let i = 0; i < event.results.length; i++) {
          transcriptAcc += event.results[i][0].transcript;
        }
        if (transcriptAcc.trim()) {
          setLiveTranscript(transcriptAcc);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[VoiceController] Speech recognition error:', event?.error);
        if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
          setMicStatusText('⚠️ Microphone permission blocked by browser. Please allow microphone access or click a dictation sample below.');
        } else {
          setMicStatusText(`Notice: ${event?.error || 'Speech input paused'}. You can click any dictation sample below.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      // Call start synchronously within click handler to satisfy browser user gesture rules
      recognition.start();
    } catch (err: any) {
      console.warn('[VoiceController] Failed to start recognition:', err?.message);
      setIsListening(false);
      setMicStatusText('Microphone session initialized. You can click a dictation sample below.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleSelectText = (text: string) => {
    onSpeechResult(text);
    stopListening();
    setShowVoiceModal(false);
  };

  const handleConfirmCurrentText = () => {
    if (liveTranscript.trim()) {
      onSpeechResult(liveTranscript.trim());
    }
    stopListening();
    setShowVoiceModal(false);
  };

  const speakText = () => {
    if (!textToRead || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = getLocaleForLanguage(language);

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Voice Input Trigger Button */}
        <button
          type="button"
          onClick={startListening}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-300/80 hover:bg-emerald-100 transition-all shadow-xs"
          title="Voice Speech-to-Text Input"
        >
          <Mic className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Voice Input</span>
        </button>

        {/* Text-to-Speech Read Aloud */}
        {textToRead && (
          <button
            type="button"
            onClick={speakText}
            className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              isSpeaking
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
            }`}
            title="Listen to Triage Advice in Native Language"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 animate-bounce" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Read Aloud</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Voice Dictation Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-center relative animate-fade-in">
            
            <button
              type="button"
              onClick={() => {
                stopListening();
                setShowVoiceModal(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Listening Wave Visualizer */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className={`w-20 h-20 rounded-full ${isListening ? 'bg-red-500/20 animate-ping' : 'bg-emerald-500/20'} absolute`} />
              <div className={`w-16 h-16 rounded-full ${isListening ? 'bg-gradient-to-tr from-red-600 to-rose-500' : 'bg-gradient-to-tr from-emerald-600 to-teal-500'} flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 relative`}>
                <Mic className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              Voice Dictation Mode
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-3">
              {micStatusText}
            </p>

            {/* Live Transcript Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left min-h-[90px] mb-4 text-sm font-medium text-slate-800">
              {liveTranscript ? (
                <span className="text-emerald-900 font-bold">{liveTranscript}</span>
              ) : (
                <span className="text-slate-400 italic">
                  {isListening ? 'Listening... Speak your symptoms clearly.' : 'No live speech detected. Click any quick sample below.'}
                </span>
              )}
            </div>

            {/* Direct One-Click Speech Dictations */}
            <div className="mb-6 text-left">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block mb-2">
                Click to Insert Speech Dictation:
              </span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectText('I have fever and headache for two days')}
                  className="w-full text-left text-xs p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 font-semibold border border-slate-200 flex items-center justify-between transition-all"
                >
                  <span>🗣️ "I have fever and headache for two days"</span>
                  <span className="text-emerald-600 font-bold">Insert</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectText('मुझे 2 दिन से तेज बुखार और सांस में तकलीफ है')}
                  className="w-full text-left text-xs p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 font-semibold border border-slate-200 flex items-center justify-between transition-all"
                >
                  <span>🗣️ "मुझे 2 दिन से तेज बुखार और सांस में तकलीफ है"</span>
                  <span className="text-emerald-600 font-bold">Insert</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectText('Tengo dolor de cabeza y fiebre alta desde ayer')}
                  className="w-full text-left text-xs p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 font-semibold border border-slate-200 flex items-center justify-between transition-all"
                >
                  <span>🗣️ "Tengo dolor de cabeza y fiebre alta desde ayer"</span>
                  <span className="text-emerald-600 font-bold">Insert</span>
                </button>
              </div>
            </div>

            {/* Footer Controls */}
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setShowVoiceModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCurrentText}
                disabled={!liveTranscript.trim()}
                className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Use Voice Text</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

function getLocaleForLanguage(lang: string): string {
  switch (lang.toLowerCase()) {
    case 'hindi': return 'hi-IN';
    case 'urdu': return 'ur-PK';
    case 'bengali': return 'bn-BD';
    case 'tamil': return 'ta-IN';
    case 'punjabi': return 'pa-IN';
    case 'spanish': return 'es-ES';
    case 'english':
    default:
      return 'en-US';
  }
}
