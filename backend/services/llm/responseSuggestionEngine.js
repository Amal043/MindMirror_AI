import { config } from '../../config.js';
import { buildStructuredResponsePrompt } from './responsePromptBuilder.js';
import { generate } from './provider.js';
import { validateAndSanitizeOutput } from './outputValidator.js';
import { validateAndSanitizeAnnotations } from './annotationValidator.js';
import { validateAndSanitizeResponseOptions, createFallbackOptions } from './responseValidator.js';

/**
 * Single Structured Pass LLM Engine
 * Generates Persona Reply + Inline Subtext Annotations + Communication Paths in ONE call.
 * @param {Array<object>} llmMessages 
 * @param {string} scenarioId 
 * @param {string} customText 
 * @param {string} sessionId 
 * @returns {Promise<{ persona_message: string, annotations: Array, response_options: Array }>}
 */
export async function generateStructuredPersonaPayload(llmMessages, scenarioId, customText = null, sessionId = 'default') {
  const startTime = Date.now();

  const structuredPrompt = buildStructuredResponsePrompt(scenarioId, customText, llmMessages);

  const requestMessages = [
    { role: 'system', content: structuredPrompt },
    ...llmMessages.filter(m => m.role !== 'system')
  ];

  try {
    const rawOutput = await generate(requestMessages, sessionId);

    let parsed = null;
    let personaMessage = null;
    let annotations = [];
    let responseOptions = [];

    if (rawOutput) {
      let cleanJson = rawOutput.trim();
      cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();

      try {
        parsed = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn(`[Structured LLM Engine] Strict JSON.parse error for session ${sessionId}, trying robust extractor:`, parseErr.message);
        parsed = extractPartialJson(cleanJson);
      }
    }

    if (parsed && parsed.assistant_message) {
      personaMessage = validateAndSanitizeOutput(parsed.assistant_message);
      annotations = validateAndSanitizeAnnotations(JSON.stringify(parsed.annotations || []), personaMessage || '');
      responseOptions = validateAndSanitizeResponseOptions(parsed.response_options || [], scenarioId);
    } else if (rawOutput && !rawOutput.startsWith('{')) {
      // If LLM returned plain text instead of JSON object
      personaMessage = validateAndSanitizeOutput(rawOutput);
      responseOptions = createFallbackOptions(scenarioId);
    }

    // Always guarantee response_options are populated
    if (!responseOptions || responseOptions.length === 0) {
      responseOptions = createFallbackOptions(scenarioId);
    }

    const duration = Date.now() - startTime;
    if (config.nodeEnv !== 'production') {
      console.log(`[Structured Engine Log] Session: ${sessionId} | Time: ${duration}ms | Options: ${responseOptions.length} | Annotations: ${annotations.length}`);
    }

    return {
      persona_message: personaMessage,
      annotations,
      response_options: responseOptions
    };

  } catch (error) {
    console.error(`[Structured LLM Engine Failure] Session ${sessionId}:`, error.message);
    return {
      persona_message: null,
      annotations: [],
      response_options: createFallbackOptions(scenarioId)
    };
  }
}

/**
 * Robust regex extractor for partial JSON strings
 */
function extractPartialJson(jsonStr) {
  const result = {
    assistant_message: null,
    annotations: [],
    response_options: []
  };

  // Extract assistant_message
  const msgMatch = jsonStr.match(/"assistant_message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (msgMatch && msgMatch[1]) {
    result.assistant_message = msgMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ');
  }

  // Extract response_options array block if present
  const optionsMatch = jsonStr.match(/"response_options"\s*:\s*(\[\s*\{.*?\}\s*\])/s);
  if (optionsMatch && optionsMatch[1]) {
    try {
      result.response_options = JSON.parse(optionsMatch[1]);
    } catch (e) {
      // Ignored
    }
  }

  return result;
}
