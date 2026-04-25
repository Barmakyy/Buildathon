import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SUBJECTS = [
  { id: 'mathematics', label: 'Mathematics', icon: 'Calculator', color: '#7ed300' },
  { id: 'physics', label: 'Physics', icon: 'Atom', color: '#65a800' },
  { id: 'chemistry', label: 'Chemistry', icon: 'FlaskConical', color: '#98e033' },
  { id: 'biology', label: 'Biology', icon: 'Dna', color: '#4a8000' },
  { id: 'computer_science', label: 'Computer Science', icon: 'Monitor', color: '#62aa00' },
];

const LANGUAGE_MODES = [
  { id: 'sheng', label: 'Sheng Mix', flag: '🇰🇪', desc: 'English + Kiswahili + Sheng' },
  { id: 'english', label: 'English', flag: '🇬🇧', desc: 'Formal English only' },
  { id: 'swahili', label: 'Kiswahili', flag: '🇹🇿', desc: 'Kiswahili safi' },
];

export { SUBJECTS, LANGUAGE_MODES };

const useTutorStore = create(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      messages: [],
      subject: 'mathematics',
      languageMode: 'sheng',
      isSidebarOpen: true,
      isStreaming: false,
      isLoadingSession: false,
      activeQuiz: null,
      quizAnswers: {},
      quizSubmitted: false,
      isGeneratingQuiz: false,

      setSubject: (subject) => set({ subject }),
      setLanguageMode: (languageMode) => set({ languageMode }),
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      setStreaming: (isStreaming) => set({ isStreaming }),
      setSessions: (sessions) => set({ sessions }),
      setActiveSession: (sessionId, messages = []) => set({ activeSessionId: sessionId, messages }),
      addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
      updateLastMessage: (text) => set((s) => {
        const msgs = [...s.messages];
        if (msgs.length > 0 && msgs[msgs.length - 1].role === 'model') {
          msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: text };
        }
        return { messages: msgs };
      }),
      startNewSession: () => set({ activeSessionId: null, messages: [], activeQuiz: null, quizAnswers: {}, quizSubmitted: false }),
      setActiveQuiz: (quiz) => set({ activeQuiz: quiz, quizAnswers: {}, quizSubmitted: false }),
      clearQuiz: () => set({ activeQuiz: null, quizAnswers: {}, quizSubmitted: false }),
      setQuizAnswer: (questionId, answer) => set((s) => ({ quizAnswers: { ...s.quizAnswers, [questionId]: answer } })),
      submitQuiz: () => set({ quizSubmitted: true }),
      setGeneratingQuiz: (v) => set({ isGeneratingQuiz: v }),
      deleteSessionFromList: (id) => set((s) => ({
        sessions: s.sessions.filter((sess) => sess._id !== id),
        ...(s.activeSessionId === id ? { activeSessionId: null, messages: [] } : {}),
      })),
    }),
    {
      name: 'elimu-ai-store',
      partialize: (state) => ({
        subject: state.subject,
        languageMode: state.languageMode,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);

export default useTutorStore;
