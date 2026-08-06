/**
 * Deterministic Conversation Pace Engine
 * Analyzes observable interaction patterns over the recent 6-8 exchanges (max 16 messages).
 * Implements State Hysteresis for smooth, realistic step-down transitions.
 * Instant execution (< 5ms, 0 LLM token cost).
 */

const PACE_LEVELS = ['Calm', 'Uncertain', 'Tense', 'Escalating'];

const NEGATION_WORDS = ['no', 'not', 'cannot', "can't", "won't", "don't", 'never', 'refuse', 'unable'];

/**
 * Calculates conversation pace with hysteresis
 * @param {Array<object>} fullHistory - Complete conversation history [{ role, content }]
 * @param {string} previousPace - Previous recorded pace ('Calm', 'Uncertain', 'Tense', 'Escalating')
 * @returns {{ pace: string, reasons: Array<string> }} Calculated pace & observable reasons
 */
export function calculateConversationPace(fullHistory = [], previousPace = 'Calm') {
  if (!Array.isArray(fullHistory) || fullHistory.length < 2) {
    return {
      pace: 'Calm',
      reasons: ['Initial practice dialogue']
    };
  }

  // 1. Slice to recent 6-8 exchanges (last 16 messages)
  const recentHistory = fullHistory.slice(-16);
  const reasons = [];

  let negationCount = 0;
  let exclamationCount = 0;
  let totalWords = 0;

  recentHistory.forEach(msg => {
    const text = (msg.content || '').toLowerCase();
    const words = text.split(/\s+/);
    totalWords += words.length;

    words.forEach(w => {
      if (NEGATION_WORDS.includes(w)) negationCount++;
    });

    const excls = (text.match(/!/g) || []).length;
    exclamationCount += excls;
  });

  const avgMessageWords = Math.round(totalWords / recentHistory.length);

  // 2. Evaluate Target Raw Pace
  let rawPace = 'Calm';

  if (negationCount >= 4 || exclamationCount >= 3 || (recentHistory.length >= 8 && avgMessageWords > 55)) {
    rawPace = 'Escalating';
    if (negationCount >= 4) reasons.push('Direct boundary or disagreement markers detected.');
    if (exclamationCount >= 3) reasons.push('Higher emotional emphasis detected.');
    if (avgMessageWords > 55) reasons.push('Message length has increased significantly.');
  } else if (negationCount >= 2 || exclamationCount >= 1 || avgMessageWords > 40) {
    rawPace = 'Tense';
    if (negationCount >= 2) reasons.push('Multiple boundary or negotiation markers.');
    if (avgMessageWords > 40) reasons.push('Detailed exchanges in recent dialogue.');
  } else if (recentHistory.length >= 4) {
    rawPace = 'Uncertain';
    reasons.push('Active ongoing exchange.');
  } else {
    rawPace = 'Calm';
    reasons.push('Balanced interaction pace.');
  }

  // 3. Apply State Hysteresis (Step down at most 1 level per message)
  const prevIdx = PACE_LEVELS.indexOf(previousPace) !== -1 ? PACE_LEVELS.indexOf(previousPace) : 0;
  const rawIdx = PACE_LEVELS.indexOf(rawPace);

  let finalIdx = rawIdx;

  if (rawIdx < prevIdx - 1) {
    // If raw pace drops by more than 1 step (e.g. Escalating -> Calm), step down by only 1 step
    finalIdx = prevIdx - 1;
  }

  const finalPace = PACE_LEVELS[finalIdx] || 'Calm';

  return {
    pace: finalPace,
    reasons: reasons.length > 0 ? reasons : ['Observable interaction pattern.']
  };
}
