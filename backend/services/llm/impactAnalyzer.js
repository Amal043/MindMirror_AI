/**
 * Impact Analyzer Service (User-Triggered "Review Draft")
 * Analyzes custom user drafts and returns strengths, advisory concerns, and communication dimensions.
 * STRICTLY NO NUMERIC SCORES, PERCENTAGES, OR GRADES.
 */

/**
 * Evaluates custom user draft text and returns advisory observations + dimension levels
 * @param {string} userDraft - The draft text typed by the user
 * @param {string} assistantMessage - Previous persona reply
 * @returns {object} Advisory impact feedback
 */
export function analyzeDraftImpact(userDraft, assistantMessage = '') {
  if (!userDraft || !userDraft.trim()) {
    return {
      strengths: ['✓ Ready to type your message'],
      concerns: [],
      dimensions: {
        clarity: 'moderate',
        warmth: 'moderate',
        assertiveness: 'moderate',
        specificity: 'moderate'
      }
    };
  }

  const text = userDraft.trim();
  const lower = text.toLowerCase();
  const wordCount = text.split(' ').length;

  const strengths = [];
  const concerns = [];

  // 1. Analyze Strengths
  if (lower.includes('please') || lower.includes('thank') || lower.includes('appreciate')) {
    strengths.push('✓ Respectful and appreciative wording');
  }
  if (wordCount >= 5 && (lower.includes('need') || lower.includes('require') || lower.includes('would work') || lower.includes('prefer'))) {
    strengths.push('✓ Clear expression of your personal need');
  }
  if (/\b(hours|days|notice|schedule|deadline|timeline|report|email|meeting)\b/i.test(text)) {
    strengths.push('✓ Specific request details included');
  }
  if (strengths.length === 0) {
    strengths.push('✓ Direct and concise communication');
  }

  // 2. Analyze Advisory Concerns (Hedged & Non-Judgmental)
  if (wordCount < 4) {
    concerns.push('⚠ May sound more brief than intended.');
  }
  if (lower.includes('asap') || lower.includes('now') || lower.includes('immediately')) {
    concerns.push('⚠ Could be interpreted as urgent or firm.');
  }
  if (text.includes('!') && text.split('!').length > 2) {
    concerns.push('⚠ Exclamation points may add extra emotional emphasis.');
  }
  if (wordCount > 40) {
    concerns.push('⚠ Longer messages might require extra reading effort.');
  }

  // 3. Compute Communication Dimensions (Simple Qualitative Levels: 'moderate' | 'high' | 'very_high')
  // STRICTLY NO NUMERIC SCORES
  let clarityLevel = wordCount > 6 ? 'high' : 'moderate';
  let warmthLevel = (lower.includes('thank') || lower.includes('appreciate') || lower.includes('hope')) ? 'high' : 'moderate';
  let assertivenessLevel = (lower.includes('need') || lower.includes('cannot') || lower.includes('firm')) ? 'high' : 'moderate';
  let specificityLevel = /\b(hours|days|notice|schedule|deadline|tomorrow|today)\b/i.test(text) ? 'high' : 'moderate';

  if (wordCount > 15 && (lower.includes('thank') || lower.includes('please'))) {
    warmthLevel = 'very_high';
  }
  if (wordCount > 10 && /\b(hours|days|deadline)\b/i.test(text)) {
    specificityLevel = 'very_high';
    clarityLevel = 'very_high';
  }

  return {
    strengths,
    concerns,
    dimensions: {
      clarity: clarityLevel,
      warmth: warmthLevel,
      assertiveness: assertivenessLevel,
      specificity: specificityLevel
    }
  };
}
