'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CrisisResource } from '@/lib/safety';

interface CrisisAlertProps {
  crisisType: string;
  resources: CrisisResource[];
}

export const CrisisAlert: React.FC<CrisisAlertProps> = ({ crisisType, resources }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      role="alert"
      aria-live="assertive"
      style={{
        width: '100%',
        maxWidth: 'var(--content-width)',
        margin: 'var(--space-6) auto 0',
      }}
    >
      {/* Warm Header */}
      <div style={{
        background: '#F5F0FF',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        padding: 'var(--space-8) var(--space-8) var(--space-6)',
        borderTop: '3px solid #7C3AED',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-full)',
            background: '#EDE9FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div>
            <h2 style={{
              font: 'var(--text-heading)',
              color: '#4C1D95',
              margin: 0,
              marginBottom: 'var(--space-2)',
            }}>
              You're not alone
            </h2>
            <p style={{
              font: 'var(--text-body)',
              color: '#6D28D9',
              margin: 0,
              lineHeight: 1.6,
              opacity: 0.85,
            }}>
              What you're feeling matters, and there are people who want to help. Please reach out to one of these confidential resources — they're available right now.
            </p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid #E9E5F5',
        borderTop: 'none',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
      }}>
        {resources.map((resource, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              padding: 'var(--space-4) var(--space-6)',
              borderBottom: i < resources.length - 1 ? '1px solid var(--border-light)' : 'none',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                font: 'var(--text-small-medium)',
                color: 'var(--text-primary)',
                marginBottom: 2,
              }}>
                {resource.name}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                font: 'var(--text-caption)',
                color: 'var(--text-tertiary)',
              }}>
                <span>{resource.region}</span>
                <span>·</span>
                <span>{resource.available}</span>
              </div>
            </div>

            <a
              href={resource.number.startsWith('Text') ? undefined : `tel:${resource.number.replace(/[^\d+]/g, '')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                background: '#7C3AED',
                color: '#FFFFFF',
                font: 'var(--text-small-medium)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'background var(--duration-fast) ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#6D28D9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#7C3AED'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {resource.number}
            </a>
          </motion.div>
        ))}

        {/* Footer note */}
        <div style={{
          padding: 'var(--space-4) var(--space-6)',
          borderTop: '1px solid var(--border-light)',
          font: 'var(--text-caption)',
          color: 'var(--text-tertiary)',
          lineHeight: 1.5,
        }}>
          All resources listed are free and confidential. HealthBridge AI is not a crisis service. If you are in immediate danger, please call your local emergency number (1122 · 911 · 112).
        </div>
      </div>
    </motion.div>
  );
};
