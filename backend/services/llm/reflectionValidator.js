/**
 * Reflection Validator Service
 * Validates, sanitizes, and filters structured reflection payload.
 */

const FORBIDDEN_WORDS = [
  'grade',
  'score',
  'percent',
  '%',
  'failing',
  'poorly',
  'diagnosis',
  'therapy',
  'treatment',
  'disorder',
  'patient'
];

/**
 * Creates fallback reflection payload for scenario
 */
export function createFallbackReflection(scenarioId = 'accommodations') {
  return {
    conversation_journey: [
      "Started by introducing your practice situation.",
      "Engaged in dialogue to clarify needs and constraints.",
      "Concluded after exploring workable next steps."
    ],
    communication_patterns: [
      {
        title: "Direct Phrasing",
        description: "You expressed your core needs clearly during practice."
      },
      {
        title: "Collaborative Engagement",
        description: "You maintained open dialogue while working through options."
      }
    ],
    paths_used: ["Balanced", "Gentle"],
    practice_takeaways: [
      "Stating specific timelines helps reduce uncertainty.",
      "Acknowledging situational constraints keeps conversations constructive."
    ],
    next_practice_focus: [
      "Try experimenting with the Direct communication path.",
      "Practice setting boundary expectations earlier in the discussion."
    ]
  };
}

/**
 * Validates and sanitizes raw JSON string for reflection
 */
export function validateAndSanitizeReflection(rawJsonString, scenarioId = 'accommodations') {
  const fallback = createFallbackReflection(scenarioId);

  if (!rawJsonString || typeof rawJsonString !== 'string') return fallback;

  let parsed = null;
  try {
    let cleanJson = rawJsonString.trim();
    cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    console.warn('[Reflection Validator] Failed to parse JSON:', err.message);
    return fallback;
  }

  if (!parsed || typeof parsed !== 'object') return fallback;

  // Check for forbidden score/therapy words
  const jsonStr = JSON.stringify(parsed).toLowerCase();
  const hasForbidden = FORBIDDEN_WORDS.some(w => jsonStr.includes(w));
  if (hasForbidden) {
    console.warn('[Reflection Validator] Forbidden score/therapy word detected, using fallback.');
    return fallback;
  }

  return {
    conversation_journey: Array.isArray(parsed.conversation_journey) && parsed.conversation_journey.length > 0
      ? parsed.conversation_journey.slice(0, 4)
      : fallback.conversation_journey,
    communication_patterns: Array.isArray(parsed.communication_patterns) && parsed.communication_patterns.length > 0
      ? parsed.communication_patterns.slice(0, 3)
      : fallback.communication_patterns,
    paths_used: Array.isArray(parsed.paths_used) && parsed.paths_used.length > 0
      ? parsed.paths_used
      : fallback.paths_used,
    practice_takeaways: Array.isArray(parsed.practice_takeaways) && parsed.practice_takeaways.length > 0
      ? parsed.practice_takeaways.slice(0, 3)
      : fallback.practice_takeaways,
    next_practice_focus: Array.isArray(parsed.next_practice_focus) && parsed.next_practice_focus.length > 0
      ? parsed.next_practice_focus.slice(0, 2)
      : fallback.next_practice_focus
  };
}
