export { buildSystemPrompt, buildUserPrompt } from './prompt_builder';
export type { ExcuseContext, ExcuseResponse } from './prompt_builder';
export { generateMockExcuse } from './mock_ai';
export { calculateRiskScore } from './risk_scorer';
export { historyManager } from './history_manager';
export type { ExcuseLogEntry } from './history_manager';
export { generateExcuse } from './ai_service';
export { callClaudeAPI } from './api_client';

