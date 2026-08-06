/**
 * Conversation Formatter Utility
 * Formats persona & user messages, ordered segments, subtext annotations, and Communication Paths (response options).
 */

/**
 * Formats message into segmented structure with phrase position matching & Phase 4 response_options
 * @param {string} rawText - Full assistant text
 * @param {string} sender - ('persona' | 'user')
 * @param {Array<object>} annotations - Validated annotation objects
 * @param {Array<object>} responseOptions - Phase 4 Communication Paths array
 * @returns {object} Frontend message object with segments and response_options
 */
export function formatMessage(rawText, sender = 'persona', annotations = [], responseOptions = []) {
  const cleanText = rawText ? rawText.trim() : '';

  if (!cleanText) {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      timestamp: new Date().toISOString(),
      segments: [{ text: '', annotations: [] }],
      response_options: sender === 'persona' ? responseOptions : []
    };
  }

  // If user message, return simple user message object
  if (sender === 'user') {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      timestamp: new Date().toISOString(),
      segments: [
        {
          text: cleanText,
          annotations: []
        }
      ],
      response_options: []
    };
  }

  // Handle case where annotations array is empty
  if (!Array.isArray(annotations) || annotations.length === 0) {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      timestamp: new Date().toISOString(),
      segments: [{ text: cleanText, annotations: [] }],
      response_options: responseOptions
    };
  }

  // Phrase location and segment splitting algorithm
  const matches = [];
  const lowerText = cleanText.toLowerCase();

  for (const ann of annotations) {
    if (!ann.phrase) continue;
    const phraseLower = ann.phrase.toLowerCase();
    const startIndex = lowerText.indexOf(phraseLower);

    if (startIndex !== -1) {
      const endIndex = startIndex + ann.phrase.length;
      matches.push({
        start: startIndex,
        end: endIndex,
        phrase: cleanText.substring(startIndex, endIndex),
        annotation: {
          title: formatTypeTitle(ann.type),
          type: ann.type || 'implicit_uncertainty',
          explanation: ann.explanation
        }
      });
    }
  }

  // Sort matches by starting index
  matches.sort((a, b) => a.start - b.start);

  // Filter overlapping matches
  const nonOverlapping = [];
  let lastEnd = 0;
  for (const match of matches) {
    if (match.start >= lastEnd) {
      nonOverlapping.push(match);
      lastEnd = match.end;
    }
  }

  if (nonOverlapping.length === 0) {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      timestamp: new Date().toISOString(),
      segments: [{ text: cleanText, annotations: [] }],
      response_options: responseOptions
    };
  }

  // Construct ordered segments array
  const segments = [];
  let currentIdx = 0;

  for (const match of nonOverlapping) {
    if (match.start > currentIdx) {
      segments.push({
        text: cleanText.substring(currentIdx, match.start),
        annotations: []
      });
    }

    segments.push({
      text: cleanText.substring(match.start, match.end),
      annotations: [match.annotation]
    });

    currentIdx = match.end;
  }

  if (currentIdx < cleanText.length) {
    segments.push({
      text: cleanText.substring(currentIdx),
      annotations: []
    });
  }

  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sender,
    timestamp: new Date().toISOString(),
    segments,
    response_options: responseOptions
  };
}

/**
 * Converts snake_case type to readable Title format
 * @param {string} type 
 * @returns {string} Human readable title
 */
function formatTypeTitle(type) {
  if (!type) return 'Possible Meaning';
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
