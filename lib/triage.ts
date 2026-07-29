import { TriageRequest, TriageResult, ConversationMessage } from '@/types/triage';
import { searchVectorStore } from './vector-store';
import { buildGemmaSystemPrompt, buildUserPrompt } from './prompt';
import { generateGemmaResponse, checkOllamaHealth, DEFAULT_MODEL } from './ollama';
import { parseAndValidateTriageResponse } from './parser';
import { executeToolCall } from './tools';
import { saveConversationSession } from './db';
import { screenForCrisis } from './safety';

export async function processTriage(req: TriageRequest): Promise<TriageResult> {
  const message = req.message.trim();
  if (!message) {
    throw new Error('Symptom description query cannot be empty.');
  }

  // 0. SAFETY FIRST: Pre-screen for mental health crisis
  const safetyResult = screenForCrisis(message);

  // 1. REAL RAG: Vector search top 5 document chunks from /docs
  const ragResults = searchVectorStore(message, 5);
  const ragContextText = ragResults
    .map(r => `[Doc Chunk ID: ${r.chunk.id} | Source: ${r.chunk.sourceFile} | Section: ${r.chunk.title}]\n${r.chunk.content}`)
    .join('\n\n---\n\n');

  // 2. STRICT OLLAMA CHECK: Verify local Ollama server is running gemma4
  const health = await checkOllamaHealth();
  if (!health.isAvailable) {
    throw new Error('OLLAMA_UNAVAILABLE: Ollama service is not running on http://localhost:11434. Please start Ollama with: ollama run gemma4');
  }

  const modelToUse = health.modelName || DEFAULT_MODEL;

  // 3. PROMPT BUILDER: Inject RAG context + safety addendum + conversation history
  const sysPrompt = buildGemmaSystemPrompt(
    ragContextText,
    safetyResult.isCrisis ? safetyResult.safetyPromptAddendum : undefined
  );
  const userPrompt = buildUserPrompt(message, req.conversationHistory);

  // 4. REAL OLLAMA GEMMA 4 CALL: Send prompt directly to Ollama REST API
  const rawLLMOutput = await generateGemmaResponse(sysPrompt, userPrompt, modelToUse);

  // 5. VALIDATE JSON SCHEMA: Zod validation
  const triageData = parseAndValidateTriageResponse(rawLLMOutput);

  // 6. FUNCTION CALLING: Execute requested tool if Gemma requested one or if emergency
  let toolResult = undefined;
  let selectedToolName = triageData.tool_call;

  if (triageData.emergency && (selectedToolName === 'none' || !selectedToolName)) {
    selectedToolName = 'findNearbyHospitals';
  }

  if (safetyResult.isCrisis && (selectedToolName === 'none' || !selectedToolName)) {
    selectedToolName = 'lookupEmergencyContacts';
  }

  if (selectedToolName && selectedToolName !== 'none') {
    toolResult = executeToolCall(selectedToolName, {
      message,
      location: req.location || { address: 'Current Device Location' }
    });
  }

  const finalResult: TriageResult = {
    language: triageData.language,
    symptoms: triageData.symptoms,
    duration: triageData.duration,
    severity: triageData.severity,
    urgency: triageData.urgency,
    possible_causes: triageData.possible_causes,
    next_steps: triageData.next_steps,
    warning_signs: triageData.warning_signs,
    emergency: triageData.emergency,
    confidence: triageData.confidence,
    confidence_reasoning: triageData.confidence_reasoning,
    disclaimer: triageData.disclaimer,
    tool_call_name: selectedToolName,
    tool_result: toolResult,
    rag_sources: ragResults.map(r => ({
      id: r.chunk.id,
      title: r.chunk.title,
      source: r.chunk.sourceFile,
      score: Math.round(r.score * 10) / 10,
      content: r.chunk.content
    })),
    model_used: modelToUse,
    timestamp: new Date().toISOString(),
    // Attach crisis resources if detected
    ...(safetyResult.isCrisis ? {
      crisisResources: safetyResult.resources,
      crisisType: safetyResult.crisisType,
    } : {}),
  };

  // 7. DB SAVE: Persist session to disk
  try {
    const savedSession = saveConversationSession(message, finalResult);
    finalResult.id = savedSession.id;
  } catch (err) {
    console.warn('[Triage] Failed to save session to DB:', err);
  }

  return finalResult;
}
