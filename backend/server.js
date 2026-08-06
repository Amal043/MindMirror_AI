import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startPersonaSession, sendPersonaMessage, getSession } from './services/llm/personaEngine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
