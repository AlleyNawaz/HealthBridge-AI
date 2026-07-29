'use client';

import React, { useState, useEffect } from 'react';
import { History, X, Clock, Trash2, ArrowRight, Activity, ChevronRight, Stethoscope } from 'lucide-react';
import { ConversationSession } from '@/types/triage';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (session: ConversationSession) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  onSelectSession
}) => {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (e) {
      console.warn('[HistorySidebar] Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('[HistorySidebar] Error deleting session:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Triage History</h3>
              <p className="text-xs text-slate-500 font-medium">Saved Gemma 4 clinical sessions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading stored triage sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <Stethoscope className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No saved triage sessions yet. Submit symptoms to record history.</p>
            </div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => {
                  onSelectSession(sess);
                  onClose();
                }}
                className="bg-slate-50 hover:bg-emerald-50/70 p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group flex items-start justify-between"
              >
                <div className="space-y-1 max-w-[85%]">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(sess.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{sess.result.language}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                    "{sess.userQuery}"
                  </h4>

                  <div className="flex items-center space-x-2 pt-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      sess.result.urgency === 'Emergency' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Urgency: {sess.result.urgency}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Severity: {sess.result.severity}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(sess.id, e)}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500 font-medium">
          Saved locally in PostgreSQL / DB Store
        </div>

      </div>
    </div>
  );
};
