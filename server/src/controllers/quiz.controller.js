import { generateQuiz, getSuggestedTopics } from '../services/gemini.service.js';

export async function generateQuizHandler(req, res) {
  const { topic, subject, languageMode } = req.body;
  if (!topic || !subject) {
    return res.status(400).json({ error: 'topic and subject are required' });
  }
  try {
    const quiz = await generateQuiz(topic, subject, languageMode || 'sheng');
    res.json(quiz);
  } catch (error) {
    console.error('Quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
}

export async function getTopicsHandler(req, res) {
  const { subject } = req.params;
  try {
    const topics = await getSuggestedTopics(subject);
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
