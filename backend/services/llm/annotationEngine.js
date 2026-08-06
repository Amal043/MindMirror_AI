import { config } from '../../config.js';
import { buildAnnotationPrompt } from './annotationPromptBuilder.js';
import { generate } from './provider.js';
import { validateAndSanitizeAnnotations } from './annotationValidator.js';

/**
 * Annotation Engine Service (LLM Call #2)
 * Independent interpretation pass extracting subtext annotations.
 * @param {string} assistantText 
 * @param {string} scenarioContext 
 * @param {string} sessionId 
 * @returns {Promise<Array<object>>} Array of validated annotation objects
 */
export async function generateAnnotations(assistantText, scenarioContext = '', sessionId = 'default') {
  if (!assistantText || !assistantText.trim()) return [];

  const startTime = Date.now();

  try {
    const prompt = buildAnnotationPrompt(assistantText, scenarioContext);
    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: 'Generate structured subtext annotations in raw JSON format.' }
    ];

    const rawJson = await generate(messages, `${sessionId}_ann`);
    const annotations = validateAndSanitizeAnnotations(rawJson, assistantText);

    const duration = Date.now() - startTime;
    if (config.nodeEnv !== 'production') {
      console.log(`[Annotation Log] Session: ${sessionId} | Count: ${annotations.length} | Time: ${duration}ms | Valid: ${annotations.length > 0}`);
    }

    return annotations;
  } catch (error) {
    console.warn(`[Annotation Engine Error] Session ${sessionId}:`, error.message);
    return [];
  }
}
