/**
 * Safety Layer — Mental Health Crisis Detection & Resource Routing
 * 
 * This module pre-screens every user input BEFORE it reaches Gemma.
 * If crisis indicators are detected, it immediately surfaces help resources
 * while still allowing Gemma to respond with appropriate safety framing.
 */

export interface CrisisResource {
  name: string;
  number: string;
  description: string;
  region: string;
  available: string;
}

export interface SafetyScreenResult {
  isCrisis: boolean;
  crisisType?: 'suicidal' | 'self-harm' | 'abuse' | 'violence' | 'substance';
  resources: CrisisResource[];
  safetyPromptAddendum: string;
}

const CRISIS_PATTERNS: Array<{ pattern: RegExp; type: SafetyScreenResult['crisisType'] }> = [
  // Suicidal ideation — English
  { pattern: /\b(kill\s*(my)?self|end\s*(my)?\s*life|want\s*to\s*die|suicide|suicidal|don'?t\s*want\s*to\s*live|no\s*reason\s*to\s*live|better\s*off\s*dead|take\s*my\s*(own\s*)?life)\b/i, type: 'suicidal' },
  // Suicidal ideation — Hindi/Urdu (transliterated)
  { pattern: /\b(marna\s*chahta|zindagi\s*khatam|khudkushi|mar\s*jana|jeena\s*nahi|maut|suicide)\b/i, type: 'suicidal' },
  // Suicidal ideation — Urdu script
  { pattern: /(خودکشی|مرنا\s*چاہتا|زندگی\s*ختم|جینا\s*نہیں|موت)/i, type: 'suicidal' },
  // Suicidal ideation — Hindi script
  { pattern: /(आत्महत्या|मरना\s*चाहता|जीना\s*नहीं|ज़िंदगी\s*ख़त्म)/i, type: 'suicidal' },
  // Self-harm
  { pattern: /\b(cut(ting)?\s*(my)?self|hurt(ing)?\s*(my)?self|self[\s-]*harm|self[\s-]*injur)/i, type: 'self-harm' },
  // Abuse
  { pattern: /\b(being\s*(abused|beaten|hit|hurt)|domestic\s*violence|someone\s*is\s*hurting\s*me|mujhe\s*maarte)\b/i, type: 'abuse' },
  // Substance crisis
  { pattern: /\b(overdos(e|ed|ing)|took\s*too\s*many\s*pills)\b/i, type: 'substance' },
];

const CRISIS_RESOURCES: Record<string, CrisisResource[]> = {
  suicidal: [
    { name: '988 Suicide & Crisis Lifeline', number: '988', description: 'Free, confidential 24/7 support for people in distress.', region: 'United States', available: '24/7' },
    { name: 'Umang Helpline Pakistan', number: '0311-7786264', description: 'Mental health support and crisis counseling.', region: 'Pakistan', available: '9 AM – 9 PM PKT' },
    { name: 'Vandrevala Foundation', number: '1860-2662-345', description: 'Multilingual mental health helpline.', region: 'India', available: '24/7' },
    { name: 'iCall Psychosocial Helpline', number: '9152987821', description: 'Professional counseling and mental health support.', region: 'India', available: 'Mon–Sat 8AM–10PM' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free crisis counseling via text message.', region: 'United States', available: '24/7' },
    { name: 'Samaritans', number: '116 123', description: 'Emotional support for anyone in distress.', region: 'United Kingdom', available: '24/7' },
  ],
  'self-harm': [
    { name: '988 Suicide & Crisis Lifeline', number: '988', description: 'Free, confidential 24/7 support.', region: 'United States', available: '24/7' },
    { name: 'Umang Helpline Pakistan', number: '0311-7786264', description: 'Mental health support and crisis counseling.', region: 'Pakistan', available: '9 AM – 9 PM PKT' },
    { name: 'Vandrevala Foundation', number: '1860-2662-345', description: 'Multilingual mental health helpline.', region: 'India', available: '24/7' },
  ],
  abuse: [
    { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', description: 'Support for domestic violence survivors.', region: 'United States', available: '24/7' },
    { name: 'Women in Distress (Pakistan)', number: '0800-22444', description: 'Support for women facing violence.', region: 'Pakistan', available: '24/7' },
    { name: 'Women Helpline (India)', number: '181', description: 'Government helpline for women in distress.', region: 'India', available: '24/7' },
  ],
  substance: [
    { name: 'Poison Control', number: '1-800-222-1222', description: 'Immediate guidance for poisoning or overdose.', region: 'United States', available: '24/7' },
    { name: 'Emergency Services', number: '1122 / 911 / 112', description: 'Call emergency medical services immediately.', region: 'Global', available: '24/7' },
  ],
  violence: [
    { name: 'Emergency Services', number: '1122 / 911 / 112', description: 'If you are in immediate danger, call emergency services.', region: 'Global', available: '24/7' },
  ],
};

export function screenForCrisis(userMessage: string): SafetyScreenResult {
  const normalizedInput = userMessage.toLowerCase().trim();

  for (const { pattern, type } of CRISIS_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      const resources = CRISIS_RESOURCES[type || 'suicidal'] || CRISIS_RESOURCES.suicidal;

      return {
        isCrisis: true,
        crisisType: type,
        resources,
        safetyPromptAddendum: `
CRITICAL SAFETY OVERRIDE: The user may be experiencing a mental health crisis (detected pattern: ${type}).

YOUR RESPONSE MUST:
1. Acknowledge their pain with empathy. Do not dismiss or minimize.
2. Encourage them to reach out to a crisis professional.
3. Set "emergency": true and "urgency": "Emergency".
4. In "next_steps", include reaching out to a crisis helpline as the first step.
5. Never provide methods of self-harm.
6. Use warm, supportive, non-judgmental language in the user's own language.
7. Set "tool_call": "lookupEmergencyContacts".
`,
      };
    }
  }

  return {
    isCrisis: false,
    resources: [],
    safetyPromptAddendum: '',
  };
}
