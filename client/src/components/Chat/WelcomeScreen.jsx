import React from 'react';
import useTutorStore, { SUBJECTS, LANGUAGE_MODES } from '../../store/useTutorStore';
import { useChat } from '../../hooks/useChat';
import { GraduationCap, Calculator, Atom, FlaskConical, Dna, Monitor } from 'lucide-react';

const IconMap = { Calculator, Atom, FlaskConical, Dna, Monitor };

const STARTER_PROMPTS = {
  mathematics: ['Explain quadratic equations using matatu fares', 'How does BODMAS work?', 'What is a logarithm?', 'Explain Pythagoras theorem'],
  physics:     ['Explain Newton\'s 3 laws using bodaboda', 'What is Ohm\'s Law?', 'How do waves work?', 'Explain projectile motion'],
  chemistry:   ['What is ionic bonding?', 'Explain the periodic table', 'How does titration work?', 'What is oxidation?'],
  biology:     ['How does photosynthesis work?', 'What is DNA replication?', 'Explain cell division (mitosis)', 'How does the heart work?'],
  computer_science: ['What is an algorithm?', 'Explain OOP concepts', 'How does the internet work?', 'What is recursion?'],
};

export default function WelcomeScreen() {
  const { subject, languageMode, setSubject, setLanguageMode } = useTutorStore();
  const { sendMessage } = useChat();
  const prompts = STARTER_PROMPTS[subject] || [];
  const currentSubject = SUBJECTS.find((s) => s.id === subject);

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full pt-8 pb-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-6 animate-float">
          <GraduationCap className="w-12 h-12 text-[#7ed300]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold gradient-text-brand mb-4 tracking-tight">Karibu Elimu AI</h1>
        <p className="text-slate-500 text-lg font-medium">Your personal STEM tutor · Powered by Gemini 1.5 · Built for Kenya 🇰🇪</p>
      </div>

      <div className="w-full bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-10 space-y-10">
        {/* Subject selector */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-[#f4fce6] border border-[#d0f38f] flex items-center justify-center text-[#62aa00] font-bold">1</div>
            <p className="text-sm uppercase tracking-wider text-slate-700 font-bold">Select Subject</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SUBJECTS.map((s) => {
              const IconComponent = IconMap[s.icon] || Calculator;
              return (
                <button
                  key={s.id}
                  id={`subject-${s.id}`}
                  onClick={() => setSubject(s.id)}
                  aria-pressed={subject === s.id}
                  className={`flex flex-col items-center gap-3 py-6 px-2 rounded-[1.5rem] border text-xs font-bold transition-all duration-300 ${
                    subject === s.id
                      ? 'border-[#98e033] bg-[#f4fce6] text-[#4a8000] shadow-md shadow-[#e5f8c0] ring-4 ring-[#7ed300]/10 scale-[1.02]'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-[#98e033] hover:bg-slate-50 hover:text-slate-800 hover:shadow-sm'
                  }`}
                >
                  <IconComponent className={`w-8 h-8 ${subject === s.id ? 'text-[#7ed300]' : 'text-slate-400'}`} />
                  <span className="text-center">{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Language mode */}
        <div className="w-full pt-8 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-[#f4fce6] border border-[#d0f38f] flex items-center justify-center text-[#62aa00] font-bold">2</div>
            <p className="text-sm uppercase tracking-wider text-slate-700 font-bold">Select Language Mode</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LANGUAGE_MODES.map((l) => (
              <button
                key={l.id}
                id={`lang-${l.id}`}
                onClick={() => setLanguageMode(l.id)}
                aria-pressed={languageMode === l.id}
                className={`flex flex-col items-center gap-2 py-6 px-4 rounded-[1.5rem] border transition-all duration-300 ${
                  languageMode === l.id
                    ? 'border-[#98e033] bg-[#f4fce6] shadow-md shadow-[#e5f8c0] ring-4 ring-[#7ed300]/10 scale-[1.02]'
                    : 'border-slate-200 bg-white hover:border-[#98e033] hover:bg-slate-50 hover:shadow-sm'
                }`}
              >
                <span className="text-4xl mb-2 drop-shadow-sm">{l.flag}</span>
                <span className={`font-extrabold text-base ${languageMode === l.id ? 'text-[#4a8000]' : 'text-slate-700'}`}>{l.label}</span>
                <span className={`text-xs text-center font-medium leading-relaxed ${languageMode === l.id ? 'text-[#62aa00]' : 'text-slate-500'}`}>{l.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick start prompts */}
        <div className="w-full pt-8 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-[#f4fce6] border border-[#d0f38f] flex items-center justify-center text-[#62aa00] font-bold">3</div>
            <p className="text-sm uppercase tracking-wider text-slate-700 font-bold">
              Quick Start Questions
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {prompts.map((p, i) => (
              <button
                key={i}
                id={`prompt-${i}`}
                onClick={() => sendMessage(p)}
                className="px-6 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-600 text-sm font-semibold hover:border-[#7ed300] hover:text-[#4a8000] hover:bg-[#f4fce6] hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
