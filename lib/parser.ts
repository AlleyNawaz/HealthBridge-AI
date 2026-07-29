import { z } from 'zod';

export const TriageSchema = z.object({
  language: z.string().default('English'),
  symptoms: z.array(z.string()).default([]),
  duration: z.string().default('Unspecified'),
  severity: z.enum(['Mild', 'Moderate', 'Severe', 'Critical']).default('Moderate'),
  urgency: z.enum(['Emergency', 'High', 'Moderate', 'Low']).default('Moderate'),
  possible_causes: z.array(z.string()).default([]),
  next_steps: z.array(z.string()).default([]),
  warning_signs: z.array(z.string()).default([]),
  follow_up_questions: z.array(z.string()).optional().default([]),
  emergency: z.boolean().default(false),
  confidence: z.number().min(0).max(1).default(0.92),
  confidence_reasoning: z.string().optional(),
  disclaimer: z.string().default('HealthBridge AI provides health triage guidance only and is not a substitute for professional medical advice.'),
  tool_call: z.enum(['findNearbyHospitals', 'lookupEmergencyContacts', 'lookupFirstAid', 'lookupMedicineInformation', 'saveConversation', 'none']).optional().default('none')
});

export function parseAndValidateTriageResponse(rawOutput: string): z.infer<typeof TriageSchema> {
  let cleaned = rawOutput.trim();

  // Remove markdown code fence ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    const jsonParsed = JSON.parse(cleaned);
    
    // Normalize boolean / tool_call types if Gemma returned boolean or string
    if (typeof jsonParsed.tool_call === 'boolean') {
      jsonParsed.tool_call = jsonParsed.tool_call ? 'findNearbyHospitals' : 'none';
    }

    const validated = TriageSchema.parse(jsonParsed);
    return validated;
  } catch (error: any) {
    console.error('[Parser] Zod / JSON parse error:', error?.message, 'Raw text:', rawOutput);
    throw new Error(`Failed to parse Gemma 4 JSON output: ${error?.message}`);
  }
}
