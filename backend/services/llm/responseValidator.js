/**
 * Response Options Validator
 * Validates, sanitizes, and formats Phase 4 Communication Paths.
 */

const STABLE_OPTIONS = [
  { id: 'direct', style: 'Direct', hint: 'Best when clear decisions matter.' },
  { id: 'balanced', style: 'Balanced', hint: 'Best when you want clarity and warmth.' },
  { id: 'gentle', style: 'Gentle', hint: 'Best when preserving the relationship is most important.' }
];

const HEDGED_IMPACT_PREFIXES = ['likely', 'may', 'balances', 'could', 'might', 'helps'];

/**
 * Validates and sanitizes response_options array
 * @param {Array<object>} options 
 * @param {string} scenarioId 
 * @returns {Array<object>} Validated array of 3 communication path objects
 */
export function validateAndSanitizeResponseOptions(options, scenarioId = 'accommodations') {
  if (!Array.isArray(options) || options.length === 0) {
    return createFallbackOptions(scenarioId);
  }

  const validOptions = [];

  for (let i = 0; i < STABLE_OPTIONS.length; i++) {
    const meta = STABLE_OPTIONS[i];
    const candidate = options.find(o => o && (o.id === meta.id || (o.style && o.style.toLowerCase() === meta.style.toLowerCase()))) || options[i];

    if (!candidate || typeof candidate !== 'object') {
      validOptions.push(createSingleFallbackOption(meta.id, scenarioId));
      continue;
    }

    let message = candidate.message ? String(candidate.message).trim() : '';
    let impact = candidate.impact ? String(candidate.impact).trim() : '';
    const hint = candidate.hint ? String(candidate.hint).trim() : meta.hint;

    // 1. Word limit check (max 60 words for message)
    if (message.split(' ').length > 60) {
      message = message.split(' ').slice(0, 60).join(' ') + '.';
    }

    // 2. Word limit check (max 20 words for impact)
    if (impact.split(' ').length > 20) {
      impact = impact.split(' ').slice(0, 20).join(' ');
    }

    // 3. Guarantee hedged wording on impact
    if (impact) {
      const lowerImpact = impact.toLowerCase();
      const isHedged = HEDGED_IMPACT_PREFIXES.some(p => lowerImpact.startsWith(p));
      if (!isHedged) {
        impact = `Likely ${impact.charAt(0).toLowerCase()}${impact.slice(1)}`;
      }
    } else {
      impact = meta.id === 'direct'
        ? 'Likely feels clear, concise, and efficient.'
        : meta.id === 'gentle'
          ? 'May feel reassuring and respectful.'
          : 'Balances clarity with warmth and natural tone.';
    }

    // Fallback message if empty
    if (!message) {
      message = createSingleFallbackOption(meta.id, scenarioId).message;
    }

    validOptions.push({
      id: meta.id,
      style: meta.style,
      hint,
      message,
      impact
    });
  }

  return validOptions;
}

function createSingleFallbackOption(id, scenarioId) {
  if (id === 'direct') {
    return {
      id: 'direct',
      style: 'Direct',
      hint: 'Best when clear decisions matter.',
      message: 'I need a clear timeline for this adjustment so I can plan my work effectively.',
      impact: 'Likely feels clear, concise, and efficient.'
    };
  }
  if (id === 'gentle') {
    return {
      id: 'gentle',
      style: 'Gentle',
      hint: 'Best when preserving the relationship is most important.',
      message: 'Thank you for discussing this with me. If possible, having an extra day would really help.',
      impact: 'May feel reassuring and respectful.'
    };
  }
  return {
    id: 'balanced',
    style: 'Balanced',
    hint: 'Best when you want clarity and warmth.',
    message: 'I appreciate your time on this. Could we review a workable schedule together?',
    impact: 'Balances clarity with warmth and natural tone.'
  };
}

export function createFallbackOptions(scenarioId) {
  return [
    createSingleFallbackOption('direct', scenarioId),
    createSingleFallbackOption('balanced', scenarioId),
    createSingleFallbackOption('gentle', scenarioId)
  ];
}
