import fs from 'fs';
import path from 'path';
import { ConversationSession, TriageResult } from '@/types/triage';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'conversations.json');

function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf-8');
  }
}

export function getAllConversationSessions(): ConversationSession[] {
  try {
    ensureDbExists();
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('[DB] Failed to read conversation sessions:', err);
    return [];
  }
}

export function getConversationSessionById(id: string): ConversationSession | null {
  const sessions = getAllConversationSessions();
  return sessions.find(s => s.id === id) || null;
}

export function saveConversationSession(userQuery: string, triageResult: TriageResult): ConversationSession {
  ensureDbExists();
  const sessions = getAllConversationSessions();

  const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const session: ConversationSession = {
    id,
    timestamp: new Date().toISOString(),
    userQuery,
    result: { ...triageResult, id }
  };

  // Add to top of list
  sessions.unshift(session);

  // Retain up to 100 recent sessions
  const trimmed = sessions.slice(0, 100);
  fs.writeFileSync(DB_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');

  return session;
}

export function deleteConversationSession(id: string): boolean {
  ensureDbExists();
  const sessions = getAllConversationSessions();
  const filtered = sessions.filter(s => s.id !== id);
  if (filtered.length !== sessions.length) {
    fs.writeFileSync(DB_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}
