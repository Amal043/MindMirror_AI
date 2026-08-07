import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mindmirror_secret_key_2026_secure';

// Helper middleware to authenticate JWT token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * GET /api/progress/user-stats
 * Retrieve real progress stats for the authenticated user from MongoDB Atlas
 */
router.get('/user-stats', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      stats: {
        totalMessagesSent: user.totalMessagesSent || 0,
        totalTimeSpentMinutes: user.totalTimeSpentMinutes || 0,
        completedSessionsCount: user.completedSessionsCount || 0,
        sessionLogs: user.sessionLogs || []
      }
    });
  } catch (err) {
    console.error('[Progress Fetch Error]:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch user progress stats.' });
  }
});

/**
 * POST /api/progress/track-session
 * Track message sent & record completed practice session in MongoDB Atlas
 */
router.post('/track-session', authenticateUser, async (req, res) => {
  try {
    const { scenarioId, title, exchanges, durationMin, notes } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const messagesInSession = (exchanges || 1) * 2;
    const timeSpent = durationMin || 2;

    user.totalMessagesSent = (user.totalMessagesSent || 0) + 1;
    user.totalTimeSpentMinutes = (user.totalTimeSpentMinutes || 0) + timeSpent;

    if (scenarioId) {
      user.completedSessionsCount = (user.completedSessionsCount || 0) + 1;
      
      const newLog = {
        id: `log_${Date.now()}`,
        scenarioId: scenarioId || 'practice',
        title: title || 'Practice Rehearsal',
        date: new Date().toLocaleDateString(),
        exchanges: exchanges || 1,
        durationMin: timeSpent,
        notes: notes || 'Practiced direct communication mechanics.'
      };

      user.sessionLogs.unshift(newLog);
    }

    await user.save();

    return res.json({
      message: 'Progress recorded in MongoDB Atlas successfully!',
      stats: {
        totalMessagesSent: user.totalMessagesSent,
        totalTimeSpentMinutes: user.totalTimeSpentMinutes,
        completedSessionsCount: user.completedSessionsCount,
        sessionLogs: user.sessionLogs
      }
    });

  } catch (err) {
    console.error('[Progress Track Error]:', err);
    return res.status(500).json({ error: err.message || 'Failed to track user progress.' });
  }
});

export default router;
