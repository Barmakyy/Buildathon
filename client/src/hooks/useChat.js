import { useCallback } from 'react';
import useTutorStore from '../store/useTutorStore';
import { streamMessage, fetchSessions, fetchSession, deleteSession } from '../utils/api';

export function useChat() {
  const {
    subject, languageMode, activeSessionId,
    addMessage, updateLastMessage, setStreaming,
    setSessions, setActiveSession, startNewSession,
    deleteSessionFromList,
  } = useTutorStore();

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Optimistically add user message
    addMessage({ role: 'user', content: text, timestamp: new Date().toISOString() });
    // Placeholder for AI response
    addMessage({ role: 'model', content: '', timestamp: new Date().toISOString() });
    setStreaming(true);

    let accumulated = '';

    await streamMessage(
      { sessionId: activeSessionId, message: text, subject, languageMode },
      {
        onChunk: (chunk) => {
          accumulated += chunk;
          updateLastMessage(accumulated);
        },
        onDone: async (newSessionId) => {
          setStreaming(false);
          // If new session was created, refresh sessions list
          const sessions = await fetchSessions();
          setSessions(sessions);
          if (!activeSessionId && newSessionId) {
            useTutorStore.setState({ activeSessionId: newSessionId });
          }
        },
        onError: (err) => {
          setStreaming(false);
          updateLastMessage(`❌ Error: ${err}`);
        },
      }
    );
  }, [subject, languageMode, activeSessionId, addMessage, updateLastMessage, setStreaming, setSessions]);

  const loadSession = useCallback(async (id) => {
    const session = await fetchSession(id);
    setActiveSession(id, session.messages);
    useTutorStore.setState({ subject: session.subject, languageMode: session.languageMode });
  }, [setActiveSession]);

  const loadSessions = useCallback(async () => {
    const sessions = await fetchSessions();
    setSessions(sessions);
  }, [setSessions]);

  const removeSession = useCallback(async (id) => {
    await deleteSession(id);
    deleteSessionFromList(id);
  }, [deleteSessionFromList]);

  return { sendMessage, loadSession, loadSessions, removeSession, startNewSession };
}
