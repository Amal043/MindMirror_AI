import { config } from '../../config.js';
import { buildReflectionPrompt } from './reflectionPromptBuilder.js';
import { generate } from './provider.js';
import { validateAndSanitizeReflection, createFallbackReflection } from './reflectionValidator.js';
import { formatReflectionDebrief } from './reflectionFormatter.js';

/**
 * Reflection Engine Service
 * Generates end-of-session reflection debrief.
 * @param {string} scenarioId 
 * @param {Array<object>} history 
 * @param {object} sessionMetadata 
 * @returns {Promise<object>} Presentation-ready debrief object
 */
export async function generateSessionDebrief(scenarioId, history = [], sessionMetadata = {}) {
  const startTime = Date.now();

  try {
    const prompt = buildReflectionPrompt(scenarioId, history, sessionMetadata);
    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: 'Generate structured session reflection JSON.' }
    ];

    const rawOutput = await generate(messages, `reflection_${Date.now()}`);
    const validated = validateAndSanitizeReflection(rawOutput, scenarioId);
    const formatted = formatReflectionDebrief(validated, sessionMetadata);

    const duration = Date.now() - startTime;
    if (config.nodeEnv !== 'production') {
      console.log(`[Reflection Engine Log] Scenario: ${scenarioId} | Time: ${duration}ms | Patterns: ${validated.communication_patterns.length}`);
    }

    return formatted;

  } catch (error) {
    console.warn(`[Reflection Engine Failure] Scenario ${scenarioId}:`, error.message);
    const fallbackVal = createFallbackReflection(scenarioId);
    return formatReflectionDebrief(fallbackVal, sessionMetadata);
  }
}
