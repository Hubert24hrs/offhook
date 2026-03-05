// OFFHOOK — AI Prompt Builder
// Builds dynamic system prompts by fusing real-world context

export interface ExcuseContext {
    location: { city: string; country: string; neighborhood?: string };
    weather: { condition: string; temperature: number; description: string };
    currentTime: string;
    dayOfWeek: string;
    contactName: string;
    relationship: string;
    excuseHistory: string[];
    usedThemes: string[];
    culturalRegion: string;
    tone: string;
    situationType: string;
    urgency: string;
    category: string;
}

export interface ExcuseResponse {
    excuse_text: string;
    delivery_tip: string;
    best_send_time: string;
    risk_score: number;
    risk_reason: string;
    supporting_context: string;
    follow_up_suggestion: string;
    category_used: string;
    cultural_tags: string[];
    expires_at: string;
}

export function buildSystemPrompt(context: ExcuseContext): string {
    return `You are OFFHOOK, the world's most sophisticated excuse generation engine. Your job is to generate ONE highly believable, culturally appropriate, contextually accurate excuse.

CRITICAL RULES:
- Use the real-world data provided below to ground the excuse in reality
- Do NOT repeat any theme from the excuse history below
- The excuse must sound natural and human — never robotic or generic
- Tailor language, references, and tone to the user's region and culture
- Return ONLY valid JSON matching the schema below

REAL-TIME CONTEXT:
- Location: ${context.location.city}, ${context.location.country}${context.location.neighborhood ? `, near ${context.location.neighborhood}` : ''}
- Weather: ${context.weather.condition}, ${context.weather.temperature}°C — ${context.weather.description}
- Current Time: ${context.currentTime}
- Day: ${context.dayOfWeek}
- Cultural Region: ${context.culturalRegion}

TARGET:
- Contact: ${context.contactName} (${context.relationship})
- Situation Type: ${context.situationType}
- Desired Tone: ${context.tone}
- Urgency: ${context.urgency}
- Category: ${context.category}

ANTI-REPETITION:
- Last 10 excuses used: ${context.excuseHistory.length > 0 ? context.excuseHistory.join(' | ') : 'None yet'}
- Themes used in last 30 days: ${context.usedThemes.length > 0 ? context.usedThemes.join(', ') : 'None yet'}

RESPONSE JSON SCHEMA:
{
  "excuse_text": "string — the main excuse message",
  "delivery_tip": "string — how to say or send it",
  "best_send_time": "string — when to send for max believability",
  "risk_score": "number 1-100",
  "risk_reason": "string — why this risk level",
  "supporting_context": "string — real-world fact backing the excuse",
  "follow_up_suggestion": "string — what to say 1 hour later",
  "category_used": "string",
  "cultural_tags": ["array of relevant cultural tags"],
  "expires_at": "ISO date — when this excuse theme is safe to reuse"
}`;
}

export function buildUserPrompt(context: ExcuseContext): string {
    return `Generate a ${context.tone} excuse for ${context.contactName} (my ${context.relationship}) about a ${context.situationType} situation. Category: ${context.category}. Urgency: ${context.urgency}. It is currently ${context.currentTime} on ${context.dayOfWeek}. The weather is ${context.weather.condition} at ${context.weather.temperature}°C in ${context.location.city}.`;
}
