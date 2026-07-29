'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { SymptomInput } from '@/components/SymptomInput';
import { ThinkingSteps } from '@/components/ThinkingSteps';
import { ConversationThread } from '@/components/ConversationThread';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { HospitalMap } from '@/components/HospitalMap';
import { TriageResult, ConversationSession, ConversationMessage } from '@/types/triage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  // Fetch history count on mount
  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(d => setHistoryCount(d.sessions?.length || 0))
      .catch(() => {});
  }, [messages]);

  const handleSubmit = async (messageText: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: ConversationMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };
    
    // Optimistic update
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          // Pass the previous messages as history (excluding the one we just added optimistically)
          conversationHistory: messages
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || `Error ${res.status}`);
      }

      const data: TriageResult = await res.json();
      
      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        result: data,
        crisisDetected: !!data.crisisResources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Gemma 4. Is Ollama running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (session: ConversationSession) => {
    // If the session has messages, load them. Otherwise fall back to a 2-turn simulation
    if (session.messages) {
      setMessages(session.messages);
    } else {
      setMessages([
        { role: 'user', content: session.userQuery, timestamp: session.timestamp },
        { role: 'assistant', content: '', timestamp: session.timestamp, result: session.result }
      ]);
    }
    setError(null);
  };

  const handleReset = () => {
    setMessages([]);
    setError(null);
  };

  const hasStarted = messages.length > 0;
  // Get the last result to decide if we should show the hospital map
  const lastResult = messages.length > 0 && messages[messages.length - 1].role === 'assistant' 
    ? messages[messages.length - 1].result 
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header
        ollamaConnected={true}
        onHistoryClick={() => setShowHistory(true)}
        historyCount={historyCount}
        onLogoClick={handleReset}
      />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: hasStarted ? 88 : '20vh',
        paddingBottom: hasStarted ? 160 : 'var(--space-20)', // Extra padding for fixed input
        paddingLeft: 'var(--space-6)',
        paddingRight: 'var(--space-6)',
        transition: 'padding-top 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* Title — only when no results */}
        {!hasStarted && (
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--space-10)',
          }}>
            <h1 
              id="main-heading"
              style={{
                font: 'var(--text-display)',
                letterSpacing: 'var(--tracking-tight)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              What are your symptoms?
            </h1>
            <p style={{
              font: 'var(--text-body)',
              color: 'var(--text-tertiary)',
            }}>
              Describe in any language. Gemma 4 provides evidence-based triage guidance.
            </p>
          </div>
        )}

        {/* Conversation Thread */}
        {hasStarted && (
          <ConversationThread 
            messages={messages} 
            isLoading={isLoading} 
            onSuggestionClick={handleSubmit}
          />
        )}

        {/* Error */}
        {error && (
          <div 
            role="alert"
            aria-live="assertive"
            style={{
              width: '100%',
              maxWidth: 'var(--content-width)',
              margin: 'var(--space-6) auto 0',
              padding: 'var(--space-4) var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--emergency-light)',
              border: '1px solid var(--emergency-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
            }}
          >
            <span style={{ font: 'var(--text-small)', color: 'var(--emergency)' }}>
              {error}
            </span>
            <button
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--emergency)',
                cursor: 'pointer',
                font: 'var(--text-caption)',
                flexShrink: 0,
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Thinking Steps */}
        <AnimatePresence>
          {isLoading && <ThinkingSteps isVisible={isLoading} />}
        </AnimatePresence>

        {/* Hospital Map — only when the latest result implies a location search or emergency */}
        {lastResult && !isLoading && (lastResult.emergency || lastResult.tool_call === 'findNearbyHospitals') && (
          <HospitalMap />
        )}

      </main>

      {/* Input - fixed at bottom if started, inline if not */}
      <div style={{
        position: hasStarted ? 'fixed' : 'relative',
        bottom: hasStarted ? 0 : 'auto',
        left: 0,
        right: 0,
        padding: hasStarted ? 'var(--space-4) var(--space-6) var(--space-8)' : 0,
        background: hasStarted ? 'linear-gradient(to top, var(--bg) 80%, transparent)' : 'transparent',
        zIndex: 30,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}>
        <div style={{ width: '100%', maxWidth: 'var(--content-width)' }}>
          <SymptomInput onSubmit={handleSubmit} isLoading={isLoading} hideExamples={hasStarted} />
        </div>
      </div>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelect={handleSelectHistory}
      />
    </div>
  );
}
