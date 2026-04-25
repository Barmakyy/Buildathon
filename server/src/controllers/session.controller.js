import Session from '../models/Session.model.js';

export async function getSessions(req, res) {
  try {
    const sessions = await Session.find({}, 'title subject languageMode lastActivity createdAt')
      .sort({ lastActivity: -1 })
      .limit(50);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getSession(req, res) {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createSession(req, res) {
  try {
    const { subject, languageMode } = req.body;
    const session = new Session({ subject, languageMode });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteSession(req, res) {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
