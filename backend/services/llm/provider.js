import { config } from '../../config.js';

/**
 * Single provider-agnostic LLM Generator function
 * Accepts messages array: [{ role: 'system' | 'user' | 'assistant', content: string }]
 * Implements timeout with AbortController and retries with active models.
 */
export async function generate(messages, sessionId = 'default') {
  const apiKey = config.llmApiKey;
  const modelName = config.llmModel || 'gemini-2.5-flash';
  const startTime = Date.now();

  if (config.nodeEnv !== 'production') {
    console.log(`[LLM Provider Log] Requesting generation | Session: ${sessionId} | Model: ${modelName} | Key Set: ${Boolean(apiKey && apiKey.length > 5)}`);
  }

  // Fallback if no valid API key is present
  if (!apiKey || apiKey === 'your_gemini_or_openai_api_key_here') {
    console.warn(`[LLM Provider] Missing or default API key in config. Using fallback response.`);
    return null;
  }

  // Retry logic across attempts
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const result = await executeSingleLLMCall({ messages, apiKey, modelName, timeoutMs: config.timeoutMs });
      if (result) {
        if (config.nodeEnv !== 'production') {
          console.log(`[LLM Provider Log] AI Generation Success | Session: ${sessionId} | Time: ${Date.now() - startTime}ms`);
        }
        return result;
      }
    } catch (err) {
      console.warn(`[LLM Provider Attempt ${attempt + 1}/${config.maxRetries + 1} Failed] Session ${sessionId}: ${err.message}`);
      
      if (attempt === config.maxRetries) {
        return null;
      }
      
      await new Promise(res => setTimeout(res, 500));
    }
  }

  return null;
}

/**
 * Single LLM fetch request guarded by AbortController timeout
 */
async function executeSingleLLMCall({ messages, apiKey, modelName, timeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let generatedText = null;

    // 1. OpenAI Endpoint (if sk- prefix)
    if (apiKey.startsWith('sk-')) {
      const apiMessages = messages.map(m => ({
        role: m.role === 'persona' || m.role === 'assistant' ? 'assistant' : m.role,
        content: m.content
      }));

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelName.includes('gpt') ? modelName : 'gpt-3.5-turbo',
          messages: apiMessages,
          max_tokens: 1200,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API status ${response.status}: ${errText}`);
      }

      const data = await response.json();
      generatedText = data.choices?.[0]?.message?.content?.trim();

    } else {
      // 2. Google Gemini REST API (Default)
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');

      const contents = conversationMessages.map(m => ({
        role: m.role === 'persona' || m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const requestBody = {
        systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
        contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Begin practice.' }] }],
        generationConfig: {
          maxOutputTokens: 1200,
          temperature: 0.7
        }
      };

      // Model candidate sequence to guarantee active endpoints
      const candidateModels = [modelName, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
      let response = null;
      let lastErrText = '';

      for (const mName of candidateModels) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${apiKey}`;
        
        try {
          const res = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: controller.signal
          });

          if (res.ok) {
            response = res;
            break;
          } else {
            lastErrText = await res.text();
          }
        } catch (e) {
          lastErrText = e.message;
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Gemini API call failed: ${lastErrText}`);
      }

      const data = await response.json();
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    }

    return generatedText || null;

  } finally {
    clearTimeout(timer);
  }
}
