'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationSession } from '@/types/triage';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (session: ConversationSession) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, onSelect }) => {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) loadHistory();
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (e) {
      console.warn('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'rgba(0,0,0,0.08)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 380,
              maxWidth: '90vw',
              zIndex: 51,
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-5) var(--space-6)',
              borderBottom: '1px solid var(--border-light)',
            }}>
              <span style={{ font: 'var(--text-body-medium)', color: 'var(--text-primary)' }}>
                History
              </span>
              <button
                onClick={onClose}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'var(--surface-alt)',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: 'var(--text-small)',
                }}
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'var(--space-3)',
            }}>
              {loading ? (
                <div style={{ padding: 'var(--space-10)', textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-tertiary)' }}>
                  Loading…
                </div>
              ) : sessions.length === 0 ? (
                <div style={{ padding: 'var(--space-10)', textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-tertiary)' }}>
                  No history yet. Submit symptoms to start.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => { onSelect(sess); onClose(); }}
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'background var(--duration-fast) ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 'var(--space-3)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-alt)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          font: 'var(--text-small-medium)',
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {sess.userQuery}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          marginTop: 'var(--space-1)',
                          font: 'var(--text-caption)',
                          color: 'var(--text-tertiary)',
                        }}>
                          <span>{sess.result.language}</span>
                          <span>·</span>
                          <span>{sess.result.urgency}</span>
                          <span>·</span>
                          <span>{new Date(sess.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(sess.id, e)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--text-tertiary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          opacity: 0.5,
                          transition: 'opacity var(--duration-fast) ease',
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--emergency)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
