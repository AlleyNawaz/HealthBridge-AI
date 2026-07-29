'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationMessage } from '@/types/triage';
import { TriageTimeline } from './TriageTimeline';
import { CrisisAlert } from './CrisisAlert';

interface ConversationThreadProps {
  messages: ConversationMessage[];
  isLoading: boolean;
}

export const ConversationThread: React.FC<ConversationThreadProps> = ({ messages, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading]);

  if (messages.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      maxWidth: 'var(--content-width)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      paddingBottom: 'var(--space-10)',
    }}>
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => (
          <motion.div
            key={`${msg.timestamp}-${idx}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.role === 'user' ? (
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: 'var(--space-4) var(--space-5)',
                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 var(--radius-xl)',
                maxWidth: '85%',
                boxShadow: 'var(--shadow-sm)',
                font: 'var(--text-body)',
                color: 'var(--text-primary)',
              }}>
                {msg.content}
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {msg.result?.crisisResources && msg.result.crisisResources.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <CrisisAlert
                      crisisType={msg.result.crisisType || 'support'}
                      resources={msg.result.crisisResources}
                    />
                  </div>
                )}
                
                {msg.result && (
                  <TriageTimeline result={msg.result} />
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={containerRef} style={{ height: 1 }} />
    </div>
  );
};
