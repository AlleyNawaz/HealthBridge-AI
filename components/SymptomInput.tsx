'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SymptomInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  'I have fever and headache for two days',
  'मुझे 2 दिन से तेज बुखार और सिरदर्द है',
  'مجھے سر درد اور بخار ہے',
  'Severe chest pain and difficulty breathing',
];

export const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmit, isLoading }) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return;
    onSubmit(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      style={{ width: '100%', maxWidth: 'var(--content-width)', margin: '0 auto' }}
    >
      {/* Input Container */}
      <div
        style={{
          position: 'relative',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
          boxShadow: focused ? 'var(--shadow-focus), var(--shadow-md)' : 'var(--shadow-sm)',
          transition: 'all var(--duration-normal) var(--ease-out)',
          overflow: 'hidden',
        }}
      >
        <textarea
          ref={textareaRef}
          aria-label="Describe your symptoms"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Describe your symptoms in any language..."
          rows={1}
          style={{
            width: '100%',
            padding: 'var(--space-5) var(--space-6)',
            paddingBottom: 'var(--space-12)',
            border: 'none',
            outline: 'none',
            resize: 'none',
            font: 'var(--text-body)',
            color: 'var(--text-primary)',
            background: 'transparent',
            lineHeight: '1.6',
            minHeight: 56,
          }}
        />

        {/* Bottom toolbar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-2) var(--space-3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            {/* Toolbar left empty */}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {value.length > 0 && (
              <span style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
                {value.length}
              </span>
            )}
            <button
              onClick={handleSubmit}
              aria-label="Analyze symptoms"
              disabled={!value.trim() || isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: value.trim() ? 'var(--accent)' : 'var(--surface-alt)',
                color: value.trim() ? 'var(--text-inverse)' : 'var(--text-tertiary)',
                cursor: value.trim() ? 'pointer' : 'default',
                transition: 'all var(--duration-fast) ease',
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        marginTop: 'var(--space-3)',
        font: 'var(--text-caption)',
        color: 'var(--text-tertiary)',
      }}>
        <kbd style={{
          padding: '1px 5px',
          borderRadius: 4,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          fontSize: 10,
          fontFamily: 'var(--font-sans)',
        }}>⌘</kbd>
        <kbd style={{
          padding: '1px 5px',
          borderRadius: 4,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          fontSize: 10,
          fontFamily: 'var(--font-sans)',
        }}>Enter</kbd>
        <span>to analyze</span>
      </div>

      {/* Example pills */}
      <AnimatePresence>
        {!value && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-5)',
            }}
          >
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setValue(ex)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  font: 'var(--text-caption)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) ease',
                  whiteSpace: 'nowrap',
                  maxWidth: 280,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.background = 'var(--accent-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'var(--surface)';
                }}
              >
                {ex}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


