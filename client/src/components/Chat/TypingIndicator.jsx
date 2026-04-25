import React from 'react';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 self-start w-full max-w-[85%]">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#7ed300] text-white shadow-md">
        <Bot className="w-6 h-6" />
      </div>
      <div className="bg-white border border-slate-200 shadow-sm rounded-[1.5rem] rounded-tl-sm px-6 py-5">
        <span className="text-slate-500 text-sm">Typing...</span>
      </div>
    </div>
  );
}
