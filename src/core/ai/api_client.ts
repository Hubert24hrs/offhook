// OFFHOOK — Claude API Client
// Direct HTTP calls to Anthropic's Messages API

import { buildSystemPrompt, buildUserPrompt, type ExcuseContext, type ExcuseResponse } from './prompt_builder';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 15000;

export async function callClaudeAPI(
    context: ExcuseContext,
    apiKey: string
): Promise<ExcuseResponse> {
    const systemPrompt = buildSystemPrompt(context);
    const userPrompt = buildUserPrompt(context);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(ANTHROPIC_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1024,
                    system: systemPrompt,
                    messages: [
                        {
                            role: 'user',
                            content: userPrompt,
                        },
                    ],
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error ${response.status}: ${errorData}`);
            }

            const data = await response.json();
            const content = data.content?.[0]?.text;

            if (!content) {
                throw new Error('Empty response from Claude API');
            }

            // Parse JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const excuseData = JSON.parse(jsonMatch[0]);

            // Validate and return
            return validateExcuseResponse(excuseData);
        } catch (error: any) {
            lastError = error;

            if (error.name === 'AbortError') {
                lastError = new Error('Request timed out. Please try again.');
            }

            // Exponential backoff before retry
            if (attempt < MAX_RETRIES - 1) {
                await new Promise(resolve =>
                    setTimeout(resolve, Math.pow(2, attempt) * 1000)
                );
            }
        }
    }

    throw lastError || new Error('Failed to generate excuse after retries');
}

function validateExcuseResponse(data: any): ExcuseResponse {
    return {
        excuse_text: data.excuse_text || 'Something came up and I need to handle it urgently.',
        delivery_tip: data.delivery_tip || 'Send via text. Keep it brief and natural.',
        best_send_time: data.best_send_time || 'Now',
        risk_score: Math.max(1, Math.min(100, Number(data.risk_score) || 25)),
        risk_reason: data.risk_reason || 'Moderate risk level.',
        supporting_context: data.supporting_context || 'Real-world conditions support this excuse.',
        follow_up_suggestion: data.follow_up_suggestion || 'Check in an hour later with a short update.',
        category_used: data.category_used || 'general',
        cultural_tags: Array.isArray(data.cultural_tags) ? data.cultural_tags : ['general'],
        expires_at: data.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
}
