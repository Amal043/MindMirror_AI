import { config } from '../../config.js';
import { buildSystemPrompt } from './promptBuilder.js';
import { generateStructuredPersonaPayload } from './responseSuggestionEngine.js';
import { formatMessage } from './conversationFormatter.js';
import { createFallbackOptions } from './responseValidator.js';
import { calculateConversationPace } from '../conversationStateEngine.js';
import { createDefaultPerspective } from './perspectiveEngine.js';

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
 * Starts a new persona rehearsal session
 */
export async function startPersonaSession(scenarioId, customText = null) {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const systemPrompt = buildSystemPrompt(scenarioId, customText);
  const llmMessages = [{ role: 'system', content: systemPrompt }];

  let { persona_message, annotations, response_options, perspective, avatar_expression } = await generateStructuredPersonaPayload(
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
    perspective = createDefaultPerspective(scenarioId);
    avatar_expression = 'empathetic';
  }

  const initialHistory = [{ role: 'assistant', content: persona_message }];
  const initialPace = calculateConversationPace(initialHistory, 'Calm');

  const initialSegmentedMsg = formatMessage(
    persona_message,
    'persona',
    annotations,
    response_options,
    initialPace,
    perspective,
    avatar_expression || 'empathetic'
  );

  const sessionObj = {
    session_id: sessionId,
    scenario_id: scenarioId || 'custom',
    custom_text: customText || null,
    created_at: new Date().toISOString(),
    current_pace: initialPace.pace,
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
 * Sends a user message and generates structured persona reply + annotations + options + perspective + pace
 */
export async function sendPersonaMessage(sessionId, userMessage) {
  const session = sessions.get(sessionId);

  if (!session) {
    return { persona_message: DEFAULT_FALLBACK_REPLY };
  }

  const trimmedUserMessage = userMessage ? userMessage.trim() : '';

  const userSegmentedMsg = formatMessage(trimmedUserMessage, 'user');
  session.messages.push(userSegmentedMsg);
  session.history.push({ role: 'user', content: trimmedUserMessage });

  const slicedHistory = session.history.slice(-config.maxHistoryMessages);
  const systemPrompt = buildSystemPrompt(session.scenario_id, session.custom_text);

  const llmMessages = [
    { role: 'system', content: systemPrompt },
    ...slicedHistory
  ];

  let { persona_message, annotations, response_options, perspective, avatar_expression } = await generateStructuredPersonaPayload(
    llmMessages,
    session.scenario_id,
    session.custom_text,
    sessionId
  );

  if (!persona_message) {
    persona_message = DEFAULT_FALLBACK_REPLY;
    response_options = createFallbackOptions(session.scenario_id);
    perspective = createDefaultPerspective(session.scenario_id);
    avatar_expression = 'calm';
  }

  session.history.push({ role: 'assistant', content: persona_message });

  // Calculate conversation pace with hysteresis over recent 6-8 exchanges
  const paceObj = calculateConversationPace(session.history, session.current_pace || 'Calm');
  session.current_pace = paceObj.pace;

  const personaSegmentedMsg = formatMessage(
    persona_message,
    'persona',
    annotations,
    response_options,
    paceObj,
    perspective,
    avatar_expression || 'empathetic'
  );

  session.messages.push(personaSegmentedMsg);

  return {
    persona_message
  };
}

/**
 * Restarts the last exchange by marking the latest user & assistant messages with restart metadata
 * Never deletes history.
 * @param {string} sessionId 
 * @returns {boolean} Success status
 */
export function restartLastExchange(sessionId) {
  const session = sessions.get(sessionId);
  if (!session || session.messages.length < 2) return false;

  // Mark latest user and assistant messages with metadata
  const lastMsg = session.messages[session.messages.length - 1];
  const prevMsg = session.messages[session.messages.length - 2];

  if (lastMsg && lastMsg.sender === 'persona') {
    lastMsg.status = 'discarded';
    lastMsg.reason = 'user_restart';
  }
  if (prevMsg && prevMsg.sender === 'user') {
    prevMsg.status = 'discarded';
    prevMsg.reason = 'user_restart';
  }

  return true;
}

/**
 * Retrieves session history for GET /api/session/:session_id
 */
export function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  return {
    session_id: session.session_id,
    messages: session.messages,
    current_pace: session.current_pace || 'Calm'
  };
}
