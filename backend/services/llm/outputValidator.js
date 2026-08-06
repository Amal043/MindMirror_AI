/**
 * LLM Output Validation & Sanitization Utility
 * Enforces: non-empty string, <=150 words, complete sentences, no markdown/bullets, no narration (*smiles*, *pauses*).
 */

export function validateAndSanitizeOutput(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return null;
  }

  let text = rawText.trim();

  // 1. Remove stage directions / narration in asterisks or brackets (e.g. *smiles*, *pauses*, [sighs])
  text = text.replace(/\*.*?\*/g, '');
  text = text.replace(/\[.*?\]/g, '');

  // 2. Remove markdown formatting (bold **, italics _, headers #, bullet points -, *)
  text = text.replace(/^#+\s+/gm, '');
  text = text.replace(/^[\*\-\+]\s+/gm, '');
  text = text.replace(/\*\*/g, '');
  text = text.replace(/`/g, '');

  // 3. Remove AI leakage phrases
  text = text.replace(/as an ai language model,?/gi, '');
  text = text.replace(/as an ai,?/gi, '');

  // Clean up duplicate spaces or blank lines
  text = text.replace(/\s+/g, ' ').trim();

  if (!text) return null;

  // 4. Enforce max 150 words rule without cutting mid-sentence
  const words = text.split(' ');
  if (words.length > 150) {
    const truncatedWords = words.slice(0, 150).join(' ');
    // Attempt to end cleanly at last sentence boundary (. ! ?)
    const lastSentenceIndex = Math.max(
      truncatedWords.lastIndexOf('.'),
      truncatedWords.lastIndexOf('!'),
      truncatedWords.lastIndexOf('?')
    );

    if (lastSentenceIndex > 50) {
      text = truncatedWords.substring(0, lastSentenceIndex + 1);
    } else {
      text = truncatedWords + '.';
    }
  }

  // Ensure text ends with proper punctuation
  text = text.trim();
  if (!/[.!?]$/.test(text)) {
    text += '.';
  }

  return text;
}
