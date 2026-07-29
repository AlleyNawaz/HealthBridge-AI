'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  ollamaConnected?: boolean;
  onHistoryClick?: () => void;
  historyCount?: number;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ ollamaConnected = true, onHistoryClick, historyCount = 0, onLogoClick }) => {
  return (
    <motion.header
      role="banner"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-6)',
        background: 'rgba(250, 251, 252, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      {/* Logo */}
      <button 
        onClick={onLogoClick}
        aria-label="HealthBridge AI - Return to home"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-3)',
          background: 'none',
          border: 'none',
          cursor: onLogoClick ? 'pointer' : 'default',
          padding: 0
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <span style={{
          font: 'var(--text-body-medium)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--text-primary)',
        }}>
          HealthBridge AI
        </span>
      </button>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {/* Connection Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          font: 'var(--text-caption)',
          color: ollamaConnected ? 'var(--accent)' : 'var(--text-tertiary)',
        }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: 'var(--radius-full)',
            background: ollamaConnected ? 'var(--accent)' : 'var(--text-tertiary)',
            display: 'inline-block',
          }} className={ollamaConnected ? 'animate-pulse-dot' : ''} />
          <span>{ollamaConnected ? 'Gemma 4 Connected' : 'Disconnected'}</span>
        </div>

        {/* History Button */}
        {onHistoryClick && (
          <button
            onClick={onHistoryClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>History{historyCount > 0 ? ` (${historyCount})` : ''}</span>
          </button>
        )}
      </div>
    </motion.header>
  );
};
