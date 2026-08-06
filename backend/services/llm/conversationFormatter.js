/**
 * Conversation Formatter Utility
 * Formats persona & user messages, ordered segments, subtext annotations, Communication Paths, conversation_pace, and cached perspective.
 */

/**
 * Formats message into segmented structure
 * @param {string} rawText 
 * @param {string} sender 
 * @param {Array<object>} annotations 
 * @param {Array<object>} responseOptions 
 * @param {object} conversationPace 
 * @param {object} perspective 
 * @returns {object} Formatted frontend message object
 */
export function formatMessage(
  rawText,
  sender = 'persona',
  annotations = [],
  responseOptions = [],
  conversationPace = { pace: 'Calm', reasons: ['Initial dialogue'] },
  perspective = null
) {
  const cleanText = rawText ? rawText.trim() : '';

  if (!cleanText) {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      timestamp: new Date().toISOString(),
      segments: [{ text: '', annotations: [] }],
      response_options: sender === 'persona' ? responseOptions : [],
      conversation_pace: conversationPace,
      perspective
    };
  }

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

  if (!Array.isArray(annotations) || annotations.length === 0) {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      timestamp: new Date().toISOString(),
      segments: [{ text: cleanText, annotations: [] }],
      response_options: responseOptions,
      conversation_pace: conversationPace,
      perspective
    };
  }

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

  matches.sort((a, b) => a.start - b.start);

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
      response_options: responseOptions,
      conversation_pace: conversationPace,
      perspective
    };
  }

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
    response_options: responseOptions,
    conversation_pace: conversationPace,
    perspective
  };
}

function formatTypeTitle(type) {
  if (!type) return 'Possible Meaning';
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
