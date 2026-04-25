import React, { useEffect } from 'react';
import useTutorStore, { SUBJECTS, LANGUAGE_MODES } from '../../store/useTutorStore';
import { useChat } from '../../hooks/useChat';
import { GraduationCap, MessageSquarePlus, X, Trash2, Calculator, Atom, FlaskConical, Dna, Monitor } from 'lucide-react';

const IconMap = { Calculator, Atom, FlaskConical, Dna, Monitor };

export default function Sidebar() {
  const {
    sessions, subject, languageMode, activeSessionId,
    isSidebarOpen, setSubject, setLanguageMode, toggleSidebar,
  } = useTutorStore();
  const { loadSessions, loadSession, removeSession, startNewSession } = useChat();

  useEffect(() => { loadSessions(); }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`
        flex flex-col flex-shrink-0 bg-white border-r border-slate-200 z-50 h-full
        transition-all duration-300 ease-in-out overflow-hidden shadow-sm
        fixed lg:relative
        ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0'}
      `}>
        <div className="flex flex-col h-full w-72">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-8 h-8 text-[#7ed300] drop-shadow-sm" />
              <span className="text-xl font-extrabold gradient-text-brand tracking-tight">Elimu AI</span>
            </div>
            <button onClick={toggleSidebar} aria-label="Close sidebar" className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat */}
          <div className="p-4 border-b border-slate-100">
            <button
              id="new-chat-btn"
              onClick={startNewSession}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#7ed300] text-white text-sm font-bold shadow-md shadow-[#e5f8c0] hover:bg-[#62aa00] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <MessageSquarePlus className="w-4 h-4" /> New Session
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Subject */}
            <div className="px-4 py-4 border-b border-slate-100">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-3 px-1">Subject Focus</p>
              <div className="flex flex-col gap-1.5">
                {SUBJECTS.map((s) => {
                  const IconComponent = IconMap[s.icon] || Calculator;
                  return (
                    <button
                      key={s.id}
                      id={`sidebar-subject-${s.id}`}
                      onClick={() => setSubject(s.id)}
                      aria-pressed={subject === s.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all font-semibold ${
                        subject === s.id
                          ? 'bg-[#f4fce6] text-[#4a8000] shadow-sm border border-[#d0f38f]'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${subject === s.id ? 'text-[#62aa00]' : 'text-slate-400'}`} /> {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Language */}
            <div className="px-4 py-4 border-b border-slate-100">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-3 px-1">Language Mode</p>
              <div className="flex flex-col gap-1.5">
                {LANGUAGE_MODES.map((l) => (
                  <button
                    key={l.id}
                    id={`sidebar-lang-${l.id}`}
                    onClick={() => setLanguageMode(l.id)}
                    aria-pressed={languageMode === l.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all font-semibold ${
                      languageMode === l.id
                        ? 'bg-[#f4fce6] text-[#4a8000] shadow-sm border border-[#d0f38f]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{l.flag}</span> {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Session History */}
            <div className="px-4 py-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-3 px-1">Recent Sessions</p>
              {sessions.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-5 text-center border border-slate-200 border-dashed">
                  <p className="text-xs text-slate-500 font-medium">No previous sessions.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Start a chat to save it here!</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {sessions.map((sess) => {
                    const color = SUBJECTS.find((s) => s.id === sess.subject)?.color || '#7ed300';
                    return (
                      <li key={sess._id} className={`group flex items-center rounded-xl overflow-hidden transition-colors ${activeSessionId === sess._id ? 'bg-[#f4fce6] border border-[#d0f38f] shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}>
                        <button
                          className={`flex-1 flex items-center gap-3 px-3 py-2.5 text-sm text-left overflow-hidden ${activeSessionId === sess._id ? 'text-[#4a8000] font-bold' : 'text-slate-600 font-medium'}`}
                          onClick={() => loadSession(sess._id)}
                          aria-label={`Open: ${sess.title}`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ background: color }} />
                          <span className="truncate">{sess.title || 'Untitled Session'}</span>
                        </button>
                        <button
                          className="opacity-0 group-hover:opacity-100 px-3 py-2.5 text-slate-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-r-xl"
                          onClick={() => removeSession(sess._id)}
                          aria-label="Delete session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 font-medium text-center leading-relaxed">
            <p>🇰🇪 Built for Kenyan students</p>
            <p className="mt-0.5 font-bold text-slate-400">Gemini 1.5 Flash</p>
          </div>
        </div>
      </aside>
    </>
  );
}
