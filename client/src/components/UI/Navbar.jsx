import React from 'react';
import useTutorStore, { SUBJECTS, LANGUAGE_MODES } from '../../store/useTutorStore';
import { GraduationCap, Menu, Zap } from 'lucide-react';

export default function Navbar() {
  const { subject, languageMode, toggleSidebar } = useTutorStore();
  const currentSubject = SUBJECTS.find((s) => s.id === subject);
  const currentLang = LANGUAGE_MODES.find((l) => l.id === languageMode);

  return (
    <nav className="flex items-center justify-between h-16 min-h-[64px] px-5 bg-white border-b border-slate-200 shadow-sm z-10" role="navigation">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          id="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 -ml-2 text-slate-500 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-[#7ed300] drop-shadow-sm" />
          <span className="text-lg font-extrabold gradient-text-brand tracking-tight md:hidden">Elimu AI</span>
        </div>
      </div>

      {/* Center badges */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f4fce6] text-[#4a8000] border border-[#d0f38f] shadow-sm">
          <span className="text-sm font-bold text-[#62aa00]">{currentSubject?.label.charAt(0)}</span> 
          <span className="hidden sm:inline">{currentSubject?.label}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 shadow-sm">
          <span className="text-sm">{currentLang?.flag}</span>
          <span className="hidden sm:inline">{currentLang?.label}</span>
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-[#7ed300] fill-[#7ed300]" />
          <span className="hidden md:inline">Gemini 2.0 Flash</span>
        </span>
      </div>
    </nav>
  );
}
