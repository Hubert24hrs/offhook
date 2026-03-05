// OFFHOOK — Unified AI Service
// Routes between real Claude API and mock AI based on API key availability

import { generateMockExcuse } from './mock_ai';
import { callClaudeAPI } from './api_client';
import type { ExcuseContext, ExcuseResponse } from './prompt_builder';

export async function generateExcuse(
    context: ExcuseContext,
    apiKey?: string | null
): Promise<ExcuseResponse> {
    // Use real API if key is available
    if (apiKey && apiKey.trim().length > 10) {
        try {
            return await callClaudeAPI(context, apiKey);
        } catch (error: any) {
            console.warn('Real API failed, falling back to mock:', error.message);
            // Fall through to mock
        }
    }

    // Fallback to mock AI
    return generateMockExcuse(context);
}

export { generateMockExcuse } from './mock_ai';
export { callClaudeAPI } from './api_client';
