import express from 'express';
import { getChatSessionsCollection } from '../config/db.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { getChatResponse } from '../services/aiChatService.js';

const router = express.Router();

/**
 * Common handler for processing chat messages
 * Supports both POST /api/chat and POST /api/chat/message
 */
async function handleChatMessage(req, res) {
  try {
    const { message, conversationId, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const trimmedMessage = message.trim();
    const activeConversationId = conversationId || 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // Generate AI concierge answer
    const responseData = await getChatResponse(trimmedMessage, history || [], req.user);

    // If user is authenticated, persist conversation to MongoDB
    if (req.user && req.user.id) {
      try {
        const chatSessions = getChatSessionsCollection();
        const userMsgRecord = {
          sender: 'user',
          text: trimmedMessage,
          timestamp: new Date(),
        };
        const aiMsgRecord = {
          sender: 'ai',
          text: responseData.message,
          products: responseData.products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            category: p.category,
          })),
          timestamp: new Date(),
        };

        const existingSession = await chatSessions.findOne({
          userId: req.user.id,
          conversationId: activeConversationId,
        });

        if (existingSession) {
          await chatSessions.updateOne(
            { _id: existingSession._id },
            {
              $push: { messages: { $each: [userMsgRecord, aiMsgRecord] } },
              $set: { updatedAt: new Date() },
            }
          );
        } else {
          await chatSessions.insertOne({
            userId: req.user.id,
            conversationId: activeConversationId,
            messages: [userMsgRecord, aiMsgRecord],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (dbErr) {
        console.warn('[Chat Session Save Warning]:', dbErr.message);
      }
    }

    return res.json({
      conversationId: activeConversationId,
      message: responseData.message,
      products: responseData.products,
    });
  } catch (err) {
    console.error('[Chat API Error]:', err);
    return res.status(500).json({
      error: 'The concierge is temporarily indisposed. Please try your request again in a moment.',
      message: 'The concierge is temporarily indisposed. Please try your request again in a moment.',
      products: [],
    });
  }
}

// POST /api/chat
router.post('/', optionalAuth, handleChatMessage);

// POST /api/chat/message (backward compatible)
router.post('/message', optionalAuth, handleChatMessage);

// GET /api/chat/history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const chatSessions = getChatSessionsCollection();
    const sessions = await chatSessions
      .find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .toArray();

    return res.json({ sessions });
  } catch (err) {
    console.error('[Chat History Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve conversation history.' });
  }
});

// DELETE /api/chat/history
router.delete('/history', requireAuth, async (req, res) => {
  try {
    const chatSessions = getChatSessionsCollection();
    await chatSessions.deleteMany({ userId: req.user.id });
    return res.json({ success: true, message: 'Conversation history cleared.' });
  } catch (err) {
    console.error('[Chat Clear Error]:', err);
    return res.status(500).json({ error: 'Failed to clear conversation history.' });
  }
});

export default router;
