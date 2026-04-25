import React, { useState, useRef } from 'react';
import useTutorStore, { SUBJECTS } from '../../store/useTutorStore';
import { useChat } from '../../hooks/useChat';
import { generateQuiz } from '../../utils/api';
import { Send, ClipboardList, Loader2, Sparkles } from 'lucide-react';

export default function InputBar() {
  const [input, setInput] = useState('');
  const { subject, languageMode, isStreaming, setActiveQuiz, setGeneratingQuiz, isGeneratingQuiz } = useTutorStore();
  const { sendMessage } = useChat();
  const textareaRef = useRef(null);
  const currentSubject = SUBJECTS.find((s) => s.id === subject);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const handleGenerateQuiz = async () => {
    const topic = input.trim() || `${currentSubject?.label} fundamentals`;
    setGeneratingQuiz(true);
    setInput('');
    try {
      const quiz = await generateQuiz({ topic, subject, languageMode });
      setActiveQuiz(quiz);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white px-4 pt-5 pb-5 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] z-10 relative">
      <div className="max-w-4xl mx-auto">
        <div className={`flex items-end gap-3 bg-white border-2 rounded-2xl px-5 py-3.5 transition-all duration-300 shadow-sm ${
          input ? 'border-[#7ed300] shadow-[#e5f8c0] ring-4 ring-[#7ed300]/10' : 'border-slate-200 focus-within:border-[#7ed300] focus-within:shadow-[#e5f8c0] focus-within:ring-4 focus-within:ring-[#7ed300]/10'
        }`}>
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${currentSubject?.label || 'STEM'}… (Shift+Enter for new line)`}
            rows={1}
            disabled={isStreaming}
            aria-label="Chat message input"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 text-base font-medium leading-relaxed placeholder-slate-400 resize-none min-h-[26px] max-h-[160px] disabled:opacity-50 font-sans py-1.5"
          />
          <div className="flex items-end gap-2.5 pb-0.5">
            {/* Quiz button */}
            <button
              id="quiz-btn"
              onClick={handleGenerateQuiz}
              disabled={isStreaming || isGeneratingQuiz}
              title="Generate a quiz on this topic"
              aria-label="Generate quiz"
              className="w-11 h-11 rounded-[14px] bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              {isGeneratingQuiz ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardList className="w-5 h-5" />}
            </button>
            {/* Send button */}
            <button
              id="send-btn"
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              aria-label="Send message"
              className="w-11 h-11 rounded-[14px] bg-[#7ed300] text-white flex items-center justify-center hover:bg-[#62aa00] hover:shadow-lg hover:shadow-[#7ed300]/30 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-md"
            >
              {isStreaming
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Send className="w-5 h-5 ml-0.5" />
              }
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400 font-semibold">
          <span>Powered by</span>
          <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            <Sparkles className="w-3 h-3 text-[#7ed300]" /> Google Gemini 1.5
          </span>
          <span className="mx-1">·</span>
          <span>Elimu AI © 2026</span>
        </div>
      </div>
    </div>
  );
}
