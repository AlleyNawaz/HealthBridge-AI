'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THINKING_STEPS = [
  { label: 'Detecting language', icon: '🌐', delay: 0 },
  { label: 'Extracting symptoms', icon: '🔍', delay: 0.8 },
  { label: 'Retrieving clinical guidelines', icon: '📚', delay: 1.8 },
  { label: 'Evaluating urgency & safety', icon: '⚡', delay: 2.8 },
  { label: 'Generating recommendations', icon: '✨', delay: 3.6 },
];

interface ThinkingStepsProps {
  isVisible: boolean;
}

export const ThinkingSteps: React.FC<ThinkingStepsProps> = ({ isVisible }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setActiveStep(0);
      return;
    }

    const timers = THINKING_STEPS.map((step, i) =>
      setTimeout(() => setActiveStep(i + 1), step.delay * 1000)
    );

    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '100%',
        maxWidth: 'var(--content-width)',
        margin: 'var(--space-10) auto 0',
        padding: 'var(--space-8)',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}>
        {THINKING_STEPS.map((step, i) => {
          const isActive = activeStep > i;
          const isCurrent = activeStep === i + 1 && activeStep <= THINKING_STEPS.length;

          return (
            <AnimatePresence key={i}>
              {activeStep >= i && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: isActive ? 1 : 0.4, x: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    font: 'var(--text-small-medium)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}
                >
                  {isCurrent ? (
                    <span style={{
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          display: 'block',
                          width: 14,
                          height: 14,
                          borderRadius: 'var(--radius-full)',
                          border: '2px solid var(--border)',
                          borderTopColor: 'var(--accent)',
                        }}
                      />
                    </span>
                  ) : isActive ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <span style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: 'var(--border)' }} />
                    </span>
                  )}
                  <span>{step.label}</span>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>
    </motion.div>
  );
};
