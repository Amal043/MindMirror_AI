import { config } from '../../config.js';
import { buildSystemPrompt } from './promptBuilder.js';
import { generateStructuredPersonaPayload } from './responseSuggestionEngine.js';
import { formatMessage } from './conversationFormatter.js';
import { createFallbackOptions } from './responseValidator.js';

// In-memory sessions store (Map)
const sessions = new Map();

// Hardcoded fallbacks if API provider fails
const HARDCODED_FALLBACKS = {
  accommodations: "Hi there. I noticed you requested some time to talk about your schedule and work environment. How can I help support your needs?",
  plan_change: "Hey! I know we had planned to go over the project timeline today, but our team priority just shifted and we need to rebuild the module structure immediately. How are you feeling about pivoting?",
  boundary: "Can you quickly finish this extra client report by 8 PM tonight? It shouldn't take more than a couple of hours.",
  custom: "Thank you for sharing your situation with me. Let's practice communicating through this scenario together. Where would you like to start?"
};

const DEFAULT_FALLBACK_REPLY = "I'm sorry, I couldn't respond right now. Please try again.";

/**
 * Starts a new persona rehearsal session with single structured LLM pass (Persona + Annotations + Communication Paths)
 * @param {string} scenarioId 
 * @param {string|null} customText 
 * @returns {Promise<{ session_id: string, persona_message: string }>}
 */
export async function startPersonaSession(scenarioId, customText = null) {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const systemPrompt = buildSystemPrompt(scenarioId, customText);
  const llmMessages = [{ role: 'system', content: systemPrompt }];

  // Single Structured LLM Pass
  let { persona_message, annotations, response_options } = await generateStructuredPersonaPayload(
    llmMessages,
    scenarioId,
    customText,
    sessionId
  );

  if (!persona_message) {
    persona_message = HARDCODED_FALLBACKS[scenarioId] || HARDCODED_FALLBACKS.custom;
    if (scenarioId === 'custom' && customText && customText.trim()) {
      persona_message = `I read your situation: "${customText.trim()}". Let's work through this practice scenario together. How would you like to begin?`;
    }
    response_options = createFallbackOptions(scenarioId);
  }

  // Store internal history
  const initialHistory = [{ role: 'assistant', content: persona_message }];

  // Create frontend message object with segments, annotations, and response_options
  const initialSegmentedMsg = formatMessage(persona_message, 'persona', annotations, response_options);

  const sessionObj = {
    session_id: sessionId,
    scenario_id: scenarioId || 'custom',
    custom_text: customText || null,
    created_at: new Date().toISOString(),
    history: initialHistory,
    messages: [initialSegmentedMsg]
  };

  sessions.set(sessionId, sessionObj);

  return {
    session_id: sessionId,
    persona_message
  };
}

/**
 * Sends a user message and generates structured persona reply + annotations + response options
 * @param {string} sessionId 
 * @param {string} userMessage 
 * @returns {Promise<{ persona_message: string }>}
 */
export async function sendPersonaMessage(sessionId, userMessage) {
  const session = sessions.get(sessionId);

  if (!session) {
    return {
      persona_message: DEFAULT_FALLBACK_REPLY
    };
  }

  const trimmedUserMessage = userMessage ? userMessage.trim() : '';

  // Append user message to frontend messages list & internal history
  const userSegmentedMsg = formatMessage(trimmedUserMessage, 'user');
  session.messages.push(userSegmentedMsg);
  session.history.push({ role: 'user', content: trimmedUserMessage });

  const slicedHistory = session.history.slice(-config.maxHistoryMessages);
  const systemPrompt = buildSystemPrompt(session.scenario_id, session.custom_text);

  const llmMessages = [
    { role: 'system', content: systemPrompt },
    ...slicedHistory
  ];

  // Single Structured LLM Pass
  let { persona_message, annotations, response_options } = await generateStructuredPersonaPayload(
    llmMessages,
    session.scenario_id,
    session.custom_text,
    sessionId
  );

  if (!persona_message) {
    persona_message = DEFAULT_FALLBACK_REPLY;
    response_options = createFallbackOptions(session.scenario_id);
  }

  session.history.push({ role: 'assistant', content: persona_message });

  // Format message into frontend object
  const personaSegmentedMsg = formatMessage(persona_message, 'persona', annotations, response_options);
  session.messages.push(personaSegmentedMsg);

  return {
    persona_message
  };
}

/**
 * Retrieves session history for GET /api/session/:session_id
 * @param {string} sessionId 
 * @returns {{ session_id: string, messages: Array } | null}
 */
export function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  return {
    session_id: session.session_id,
    messages: session.messages
  };
}
