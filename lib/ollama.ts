import { OllamaStatus } from '@/types/triage';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
export const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'gemma4:latest';

let cachedModelName: string | null = null;

export async function getActiveModelName(): Promise<string> {
  if (cachedModelName) return cachedModelName;
  const status = await checkOllamaHealth();
  cachedModelName = status.modelName || DEFAULT_MODEL;
  return cachedModelName;
}

export async function checkOllamaHealth(): Promise<OllamaStatus> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      return { isAvailable: false, modelName: DEFAULT_MODEL, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    const models: string[] = (data.models || []).map((m: any) => m.name);
    
    // Automatically match installed Gemma model tag (e.g., 'gemma4:latest' or 'gemma4')
    const gemmaModel = models.find(m => m.includes('gemma')) || (models.length > 0 ? models[0] : DEFAULT_MODEL);
    cachedModelName = gemmaModel;

    return {
      isAvailable: true,
      modelName: gemmaModel,
      modelsAvailable: models
    };
  } catch (err: any) {
    return {
      isAvailable: false,
      modelName: DEFAULT_MODEL,
      error: err?.message || 'Ollama offline'
    };
  }
}

export async function generateGemmaResponse(
  systemPrompt: string,
  userPrompt: string,
  modelName?: string
): Promise<string> {
  const activeModel = modelName || await getActiveModelName();

  console.log(`[Ollama Client] Sending query to local Gemma 4 model '${activeModel}'...`);

  // Allow 60 seconds for Gemma 4 CPU generation
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: activeModel,
        system: systemPrompt,
        prompt: userPrompt,
        format: 'json',
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.9,
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Ollama returned status ${response.status}: ${errText || response.statusText}`);
    }

    const data = await response.json();
    console.log('[Ollama Client] Successfully received raw Gemma 4 response from local Ollama!');
    return data.response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('[Ollama Client] Execution error with model:', activeModel, error?.message);
    throw error;
  }
}
