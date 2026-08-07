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

const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
export const geminiKeysPool = rawKeys
  .split(',')
  .map(k => k.trim())
  .filter(k => k && k !== 'your_gemini_api_key_here');

export const config = {
  port: process.env.PORT || 3001,
  llmApiKey: geminiKeysPool[0] || '',
  llmModel: process.env.LLM_MODEL || 'gemini-flash-latest',
  timeoutMs: Number(process.env.TIMEOUT_MS) || 15000,
  maxHistoryMessages: Number(process.env.MAX_HISTORY) || 20,
  maxRetries: 1,
  nodeEnv: process.env.NODE_ENV || 'development'
};
