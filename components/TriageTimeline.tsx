'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriageResult } from '@/types/triage';

interface TriageTimelineProps {
  result: TriageResult;
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export const TriageTimeline: React.FC<TriageTimelineProps> = ({ result }) => {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  const urgencyColor = (() => {
    switch (result.urgency) {
      case 'Emergency': return { bg: 'var(--emergency-light)', text: 'var(--emergency)', border: 'var(--emergency-muted)' };
      case 'High': return { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' };
      case 'Moderate': return { bg: 'var(--warning-light)', text: 'var(--warning)', border: '#FDE68A' };
      case 'Low': return { bg: 'var(--accent-light)', text: 'var(--accent)', border: 'var(--accent-muted)' };
      default: return { bg: 'var(--surface-alt)', text: 'var(--text-secondary)', border: 'var(--border)' };
    }
  })();

  const handleDownload = () => {
    window.print();
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    const text = `${result.next_steps.join('. ')}. ${result.warning_signs.join('. ')}`;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = result.language === 'Hindi' ? 'hi-IN' : result.language === 'Urdu' ? 'ur-PK' : 'en-US';
    window.speechSynthesis.speak(utt);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100%',
        maxWidth: 'var(--content-width)',
        margin: '0 auto',
      }}
    >
      {/* Emergency Protocol */}
      {result.emergency && (
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0 }}
          style={{
            background: 'var(--emergency)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-6)',
            color: 'var(--text-inverse)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: 'var(--space-5) var(--space-6)',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <h2 style={{ font: 'var(--text-heading)', margin: 0 }}>
                Immediate Medical Attention Required
              </h2>
            </div>
            <a
              href="tel:1122"
              aria-label="Call emergency services at 1122"
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                color: 'var(--emergency)',
                font: 'var(--text-body-medium)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              Call 1122 Now
            </a>
          </div>
          
          <div style={{ padding: 'var(--space-5) var(--space-6)' }}>
            <p style={{ font: 'var(--text-body)', marginBottom: 'var(--space-4)', opacity: 0.9 }}>
              Follow these steps while waiting for help:
            </p>
            <ol style={{ 
              listStyle: 'none', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--space-3)' 
            }}>
              {result.next_steps.slice(0, 3).map((s, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  font: 'var(--text-body-medium)',
                  background: 'rgba(255,255,255,0.1)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <span style={{
                    width: 24,
                    height: 24,
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    font: 'var(--text-caption)',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      )}

      {/* Timeline Container */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Header with actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-5) var(--space-6)',
          borderBottom: '1px solid var(--border-light)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span style={{ font: 'var(--text-small-medium)', color: 'var(--text-primary)' }}>
              Triage Report
            </span>
            <span style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
              · {result.model_used}
            </span>
          </div>
          <div className="no-print" style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <ActionBtn label="Listen" onClick={handleSpeak} />
            <ActionBtn label="Download PDF" onClick={handleDownload} />
          </div>
        </div>

        {/* Timeline Items */}
        <div style={{ padding: 'var(--space-2) 0' }}>

          {/* 2. Symptoms */}
          <TimelineItem delay={0.2} label="Identified Symptoms">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              {result.symptoms.map((s, i) => (
                <span key={i} style={{
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  font: 'var(--text-small-medium)',
                }}>
                  {s}
                </span>
              ))}
            </div>
            <span style={{ font: 'var(--text-small)', color: 'var(--text-tertiary)' }}>
              Duration: {result.duration}
            </span>
          </TimelineItem>

          {/* 3. Urgency & Confidence */}
          <TimelineItem delay={0.35} label="Assessment">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-full)',
                  background: urgencyColor.bg,
                  color: urgencyColor.text,
                  border: `1px solid ${urgencyColor.border}`,
                  font: 'var(--text-small-medium)',
                }}>
                  {result.urgency} Urgency
                </span>
                <span style={{
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  font: 'var(--text-small-medium)',
                }}>
                  {Math.round(result.confidence * 100)}% Confidence
                </span>
              </div>
              
              {result.confidence_reasoning && (
                <div style={{
                  font: 'var(--text-small)',
                  color: 'var(--text-secondary)',
                  background: 'var(--surface-alt)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '2px solid var(--border)',
                }}>
                  <strong>Reasoning:</strong> {result.confidence_reasoning}
                </div>
              )}
            </div>
          </TimelineItem>

          {/* 4. Possible Causes */}
          <TimelineItem delay={0.5} label="Possible Considerations">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {result.possible_causes.map((c, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  font: 'var(--text-small)',
                  color: 'var(--text-secondary)',
                }}>
                  <span style={{ color: 'var(--text-tertiary)', marginTop: 2, flexShrink: 0 }}>·</span>
                  {c}
                </li>
              ))}
            </ul>
          </TimelineItem>

          {/* 5. Next Steps (only show if not an emergency, since emergency banner has it) */}
          {!result.emergency && (
            <TimelineItem delay={0.65} label="Recommended Next Steps">
              <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {result.next_steps.map((s, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                    font: 'var(--text-small)',
                    color: 'var(--text-primary)',
                  }}>
                    <span style={{
                      width: 20,
                      height: 20,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--accent-light)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      font: 'var(--text-caption)',
                      flexShrink: 0,
                      marginTop: 1,
                    }}>
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </TimelineItem>
          )}

          {/* 6. Warning Signs */}
          <TimelineItem delay={0.8} label="Watch for these warning signs" isWarning>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {result.warning_signs.map((w, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  font: 'var(--text-small)',
                  color: 'var(--warning)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 3, flexShrink: 0 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span style={{ color: 'var(--text-primary)' }}>{w}</span>
                </li>
              ))}
            </ul>
          </TimelineItem>

          {/* 7. Sources */}
          {result.rag_sources && result.rag_sources.length > 0 && (
            <TimelineItem delay={0.95} label="Clinical Sources Referenced" isLast>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {result.rag_sources.map((src, i) => (
                  <div key={i} style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}>
                    <button
                      onClick={() => setExpandedSource(expandedSource === src.id ? null : src.id)}
                      aria-expanded={expandedSource === src.id}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        background: 'var(--surface)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        font: 'var(--text-small-medium)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                        </svg>
                        {src.source.replace('.md', '').replace(/_/g, ' ')} — {src.title}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedSource === src.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    
                    <AnimatePresence>
                      {expandedSource === src.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div style={{
                            padding: 'var(--space-3)',
                            background: 'var(--surface-alt)',
                            borderTop: '1px solid var(--border-light)',
                            font: 'var(--text-caption)',
                            color: 'var(--text-tertiary)',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                          }}>
                            {src.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </TimelineItem>
          )}
        </div>

        {/* Disclaimer Footer */}
        <div style={{
          padding: 'var(--space-4) var(--space-6)',
          background: 'var(--surface-alt)',
          borderTop: '1px solid var(--border-light)',
          font: 'var(--text-caption)',
          color: 'var(--text-tertiary)',
          lineHeight: '1.5',
        }}>
          <strong>Important:</strong> {result.disclaimer}
        </div>
      </div>
    </motion.div>
  );
};


/* ── Timeline Item ── */
const TimelineItem: React.FC<{
  delay: number;
  label: string;
  isWarning?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}> = ({ delay, label, isWarning, isLast, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
    style={{
      display: 'flex',
      gap: 'var(--space-4)',
      padding: 'var(--space-5) var(--space-6)',
      borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
    }}
  >
    {/* Timeline dot */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 4,
      flexShrink: 0,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: 'var(--radius-full)',
        background: isWarning ? 'var(--warning)' : 'var(--accent)',
      }} />
    </div>

    {/* Content */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        font: 'var(--text-caption)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: 'var(--space-2)',
      }}>
        {label}
      </div>
      {children}
    </div>
  </motion.div>
);


/* ── Action Button ── */
const ActionBtn: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    style={{
      padding: 'var(--space-1) var(--space-3)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      font: 'var(--text-caption)',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      transition: 'all var(--duration-fast) ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--accent)';
      e.currentTarget.style.color = 'var(--accent)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.color = 'var(--text-secondary)';
    }}
  >
    {label}
  </button>
);
