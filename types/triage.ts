export type UrgencyLevel = 'Emergency' | 'High' | 'Moderate' | 'Low';
export type SeverityLevel = 'Mild' | 'Moderate' | 'Severe' | 'Critical';

export interface RagGuideline {
  id: string;
  title: string;
  category: string;
  source: string;
  content: string;
  keySymptoms: string[];
}

export interface TriageRequest {
  message: string;
  model?: string;
  location?: { latitude?: number; longitude?: number; address?: string };
  conversationHistory?: ConversationMessage[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  result?: TriageResult;
  crisisDetected?: boolean;
}

export interface ToolCallResult {
  toolName: 'findNearbyHospitals' | 'lookupEmergencyContacts' | 'lookupFirstAid' | 'lookupMedicineInformation' | 'saveConversation';
  parameters: Record<string, any>;
  output: any;
  status: 'executed';
}

export interface TriageResult {
  id?: string;
  language: string;
  symptoms: string[];
  duration: string;
  severity: SeverityLevel;
  urgency: UrgencyLevel;
  possible_causes: string[];
  next_steps: string[];
  warning_signs: string[];
  follow_up_questions?: string[];
  emergency: boolean;
  confidence: number;
  confidence_reasoning?: string;
  disclaimer: string;
  tool_call?: string;
  tool_result?: ToolCallResult;
  rag_sources?: Array<{
    id: string;
    title: string;
    source: string;
    score: number;
    content: string;
  }>;
  model_used: string;
  timestamp: string;
  crisisResources?: import('@/lib/safety').CrisisResource[];
  crisisType?: string;
}

export interface OllamaStatus {
  isAvailable: boolean;
  modelName: string;
  modelsAvailable?: string[];
  error?: string;
}

export interface ConversationSession {
  id: string;
  timestamp: string;
  userQuery: string;
  result: TriageResult;
  messages?: ConversationMessage[];
}
