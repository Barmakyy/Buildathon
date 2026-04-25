import Session from '../models/Session.model.js';
import { streamChat } from '../services/gemini.service.js';

export async function sendMessage(req, res) {
  const { sessionId, message, subject, languageMode } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    let session;
    if (sessionId) {
      session = await Session.findById(sessionId);
      if (!session) return res.status(404).json({ error: 'Session not found' });
      // Update subject/language if changed
      session.subject = subject || session.subject;
      session.languageMode = languageMode || session.languageMode;
    } else {
      session = new Session({
        subject: subject || 'mathematics',
        languageMode: languageMode || 'sheng',
        messages: [],
      });
    }

    // Add user message
    session.messages.push({ role: 'user', content: message.trim() });

    // Build messages array for Gemini
    const geminiMessages = session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Set up SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Session-Id', session._id.toString());
    res.flushHeaders();

    // Stream from Gemini
    const stream = await streamChat(geminiMessages, session.subject, session.languageMode);

    let fullResponse = '';
    for await (const chunk of stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    // Save AI response to session
    session.messages.push({ role: 'model', content: fullResponse });
    await session.save();

    res.write(`data: ${JSON.stringify({ done: true, sessionId: session._id })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process message', details: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
}
