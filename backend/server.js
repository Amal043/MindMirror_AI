import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startPersonaSession, sendPersonaMessage, getSession } from './services/llm/personaEngine.js';

import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://amalsrivastava1200_db_user:PsQc4UOGL9BRYTdc@mindmirrorai.5hzdl3d.mongodb.net/mindmirror?retryWrites=true&w=majority&appName=MindMirrorAI';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('[MongoDB Atlas] Connected successfully to MongoDB Cloud Database! 🍃'))
  .catch((err) => console.error('[MongoDB Atlas Error] Connection failed:', err.message));

// Mount Authentication & Progress Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

/**
 * POST /api/scenario/start
 * Request:  { "scenario_id": string, "custom_text": string | null }
 * Response: { "session_id": string, "persona_message": string }
 */
app.post('/api/scenario/start', async (req, res) => {
  try {
    const { scenario_id, custom_text } = req.body;
    const result = await startPersonaSession(scenario_id, custom_text);
    return res.json(result);
  } catch (error) {
    console.error('[API Error] /api/scenario/start:', error);
    return res.status(500).json({
      persona_message: "I'm sorry, I couldn't respond right now. Please try again."
    });
  }
});

/**
 * POST /api/message
 * Request:  { "session_id": string, "user_message": string }
 * Response: { "persona_message": string }
 */
app.post('/api/message', async (req, res) => {
  try {
    const { session_id, user_message } = req.body;
    if (!session_id) {
      return res.status(400).json({ error: "session_id is required" });
    }
    const result = await sendPersonaMessage(session_id, user_message);
    return res.json(result);
  } catch (error) {
    console.error('[API Error] /api/message:', error);
    return res.status(500).json({
      persona_message: "I'm sorry, I couldn't respond right now. Please try again."
    });
  }
});

/**
 * GET /api/session/:session_id
 * Response: { "session_id": string, "messages": [...] }
 */
/**
 * POST /api/pebblue/chat
 * Request:  { "user_message": string, "history": Array }
 * Response: { "reply": string }
 */
app.post('/api/pebblue/chat', async (req, res) => {
  try {
    const { user_message, history } = req.body;
    const systemInstruction = 
      "You are Pebblue, a warm, soothing, and extremely gentle cartoon sloth companion for neurodivergent individuals. " +
      "Your purpose is to provide a calm, safe, and validating space. " +
      "Respond in a very supportive, cozy, and non-judgmental tone. " +
      "Keep your responses short, simple, and comforting (1 to 3 sentences max). " +
      "Focus on emotional validation, grounding exercises (like suggesting a slow breath or naming something in the room), " +
      "or simply offering to sit together. Never break character. Never mention you are an AI assistant.";

    const messages = [
      { role: 'system', content: systemInstruction }
    ];

    if (Array.isArray(history)) {
      history.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    if (user_message) {
      messages.push({ role: 'user', content: user_message });
    }

    const { generate } = await import('./services/llm/provider.js');
    const aiReply = await generate(messages, 'pebblue_session');
    
    return res.json({ reply: aiReply });
  } catch (error) {
    console.error('[API Error] /api/pebblue/chat:', error);
    return res.json({ reply: null });
  }
});

app.get('/api/session/:session_id', (req, res) => {
  try {
    const { session_id } = req.params;
    const sessionData = getSession(session_id);

    if (!sessionData) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.json(sessionData);
  } catch (error) {
    console.error('[API Error] /api/session/:session_id:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`[MindMirror AI Persona Engine] Listening on http://localhost:${PORT}`);
});
