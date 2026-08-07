import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try loading .env from current directory, root, backend/.env, and backend/.env.example
const cwd = process.cwd();
const possiblePaths = [
  path.join(cwd, '.env'),
  path.join(cwd, 'backend', '.env'),
  path.join(cwd, 'backend', '.env.example'),
  path.join(cwd, '.env.example')
];

for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

/**
 * Centralized Backend Configuration
 */
export const config = {
  port: process.env.PORT || 3001,
  llmApiKey: (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') 
    ? process.env.GEMINI_API_KEY 
    : (process.env.LLM_API_KEY && process.env.LLM_API_KEY !== 'your_gemini_api_key_here')
      ? process.env.LLM_API_KEY 
      : process.env.OPENAI_API_KEY || '',
  llmModel: process.env.LLM_MODEL || 'gemini-flash-latest',
  timeoutMs: Number(process.env.TIMEOUT_MS) || 15000, // 15 seconds request timeout
  maxHistoryMessages: Number(process.env.MAX_HISTORY) || 20, // 10 exchanges = 20 messages
  maxRetries: 1,
  nodeEnv: process.env.NODE_ENV || 'development'
};
