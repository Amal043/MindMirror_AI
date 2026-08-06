/**
 * Annotation Validator Service
 * Validates, sanitizes, and filters structured JSON output from LLM Call #2.
 */

const ALLOWED_TYPES = new Set([
  'implicit_uncertainty',
  'boundary',
  'social_expectation',
  'reassurance',
  'hesitation',
  'request',
  'emotion',
  'clarification',
  'positive_signal',
  'neutral_context'
]);

const HEDGED_PREFIXES = [
  'they may',
  'it could',
  'this sometimes',
  "it's possible",
  'they might',
  'this may',
  'this could'
];

const FORBIDDEN_WORDS = [
  'definitely',
  'secretly',
  'manipulating',
  'psychopath',
  'narcissist',
  'lying',
  'malicious'
];

/**
 * Validates and sanitizes raw JSON string from LLM Call #2
 * @param {string} rawJsonString 
 * @param {string} assistantText 
 * @returns {Array<object>} Validated array of max 3 annotation objects
 */
export function validateAndSanitizeAnnotations(rawJsonString, assistantText) {
  if (!rawJsonString || typeof rawJsonString !== 'string') return [];
  if (!assistantText || typeof assistantText !== 'string') return [];

  let parsed = null;

  try {
    // Clean up code block wrappers if model added markdown fences
    let cleanJson = rawJsonString.trim();
    cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();

    parsed = JSON.parse(cleanJson);
  } catch (err) {
    console.warn('[Annotation Validator] Failed to parse JSON:', err.message);
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const validAnnotations = [];
  const lowercaseAssistantText = assistantText.toLowerCase();

  for (const item of parsed) {
    if (validAnnotations.length >= 3) break;
    if (!item || typeof item !== 'object') continue;

    const phrase = item.phrase ? String(item.phrase).trim() : '';
    let explanation = item.explanation ? String(item.explanation).trim() : '';
    let type = item.type ? String(item.type).trim() : 'implicit_uncertainty';

    // 1. Phrase Must Exist in Assistant Text
    if (!phrase || phrase.length < 2) continue;
    if (!lowercaseAssistantText.includes(phrase.toLowerCase())) continue;

    // 2. Reject Forbidden / Unsafe Certainty Words
    const lowercaseExp = explanation.toLowerCase();
    const hasForbidden = FORBIDDEN_WORDS.some(word => lowercaseExp.includes(word));
    if (hasForbidden) continue;

    // 3. Ensure Hedged Wording (If missing, prepend hedged prefix)
    const isHedged = HEDGED_PREFIXES.some(prefix => lowercaseExp.startsWith(prefix));
    if (!isHedged) {
      explanation = `They may be indicating: ${explanation.charAt(0).toLowerCase()}${explanation.slice(1)}`;
    }

    // 4. Validate Type against Controlled Vocabulary
    if (!ALLOWED_TYPES.has(type)) {
      type = 'implicit_uncertainty';
    }

    // 5. Enforce max 40 words explanation limit
    const words = explanation.split(' ');
    if (words.length > 40) {
      explanation = words.slice(0, 40).join(' ') + '...';
    }

    validAnnotations.push({
      phrase,
      type,
      explanation
    });
  }

  return validAnnotations;
}
