const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function streamMessage({ sessionId, message, subject, languageMode }, callbacks) {
  const { onChunk, onDone, onError } = callbacks;

  try {
    const response = await fetch(`${BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message, subject, languageMode }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Server error');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) { onError(data.error); return; }
            if (data.done) { onDone(data.sessionId); return; }
            if (data.text) onChunk(data.text);
          } catch (_) {}
        }
      }
    }
  } catch (err) {
    onError(err.message);
  }
}

export async function fetchSessions() {
  const res = await fetch(`${BASE_URL}/api/sessions`);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function fetchSession(id) {
  const res = await fetch(`${BASE_URL}/api/sessions/${id}`);
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

export async function deleteSession(id) {
  const res = await fetch(`${BASE_URL}/api/sessions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete session');
  return res.json();
}

export async function generateQuiz({ topic, subject, languageMode }) {
  const res = await fetch(`${BASE_URL}/api/quiz/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, subject, languageMode }),
  });
  if (!res.ok) throw new Error('Failed to generate quiz');
  return res.json();
}

export async function fetchTopics(subject) {
  const res = await fetch(`${BASE_URL}/api/quiz/topics/${subject}`);
  if (!res.ok) throw new Error('Failed to fetch topics');
  return res.json();
}
