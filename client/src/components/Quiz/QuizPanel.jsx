import React from 'react';
import useTutorStore from '../../store/useTutorStore';
import { ClipboardList, Trophy, CheckCircle2, AlertCircle, X, Lightbulb } from 'lucide-react';

export default function QuizPanel() {
  const {
    activeQuiz, quizAnswers, quizSubmitted,
    setQuizAnswer, submitQuiz, clearQuiz,
  } = useTutorStore();

  if (!activeQuiz) return null;

  const total = activeQuiz.questions.length;
  const answered = Object.keys(quizAnswers).length;
  const score = quizSubmitted
    ? activeQuiz.questions.filter((q) => quizAnswers[q.id] === q.correctAnswer).length
    : 0;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-[#7ed300]" /> {activeQuiz.topic}
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium bg-[#f4fce6] text-[#4a8000] inline-block px-3 py-1 rounded-full border border-[#d0f38f]">{total} questions · Test your knowledge!</p>
        </div>
        <button
          id="close-quiz-btn"
          onClick={clearQuiz}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm bg-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Result banner */}
      {quizSubmitted && (
        <div className={`flex items-center gap-5 p-6 rounded-[2rem] border-2 shadow-md animate-fade-in ${
          pct >= 60
            ? 'bg-[#f4fce6] border-[#98e033] text-[#4a8000] shadow-[#e5f8c0]/50'
            : 'bg-amber-50 border-amber-200 text-amber-800 shadow-amber-100/50'
        }`}>
          <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border ${pct >= 60 ? 'border-[#d0f38f] text-[#7ed300]' : 'border-amber-200 text-amber-500'}`}>
            {pct >= 80 ? <Trophy className="w-8 h-8" /> : pct >= 60 ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>
          <div>
            <p className="font-extrabold text-2xl mb-1">{score}/{total} correct — {pct}%</p>
            <p className="text-sm font-medium opacity-90">
              {pct >= 80 ? 'Poa sana! Excellent work!' : pct >= 60 ? 'Sawa! Good job!' : 'Keep studying, utafika! 💪'}
            </p>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="flex flex-col gap-6">
        {activeQuiz.questions.map((q, qi) => {
          const userAnswer = quizAnswers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          return (
            <div
              key={q.id}
              className={`bg-white rounded-[2rem] p-6 md:p-8 shadow-sm transition-all border-2 ${
                quizSubmitted
                  ? isCorrect ? 'border-[#98e033] bg-[#f4fce6]' : 'border-rose-300 bg-rose-50/50'
                  : 'border-slate-200 hover:border-[#d0f38f] hover:shadow-md'
              }`}
            >
              <p className="text-lg font-bold text-slate-800 mb-6 leading-relaxed flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#7ed300] text-white shrink-0 shadow-sm mt-0.5">
                  {qi + 1}
                </span>
                <span className="pt-0.5">{q.question}</span>
              </p>
              
              <div className="flex flex-col gap-3 pl-11">
                {q.options.map((opt) => {
                  const letter = opt[0];
                  const isSelected = userAnswer === letter;
                  const showCorrect = quizSubmitted && letter === q.correctAnswer;
                  const showWrong = quizSubmitted && isSelected && !isCorrect;
                  return (
                    <button
                      key={letter}
                      id={`q${q.id}-opt-${letter}`}
                      onClick={() => !quizSubmitted && setQuizAnswer(q.id, letter)}
                      disabled={quizSubmitted}
                      aria-pressed={isSelected}
                      className={`text-left px-5 py-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                        showCorrect
                          ? 'border-[#7ed300] bg-[#7ed300] text-white shadow-sm'
                          : showWrong
                          ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-sm'
                          : isSelected
                          ? 'border-[#7ed300] bg-[#f4fce6] text-[#4a8000] shadow-md ring-4 ring-[#7ed300]/10 scale-[1.01]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-[#98e033] hover:bg-slate-50'
                      } disabled:cursor-default`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              
              {quizSubmitted && (
                <div className="mt-6 ml-11 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-600 font-medium leading-relaxed relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${isCorrect ? 'bg-[#7ed300]' : 'bg-rose-500'}`} />
                  <span className="font-extrabold text-slate-800 mr-2 flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" /> Explanation
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-center pb-8 pt-4 sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10">
        {!quizSubmitted ? (
          <button
            id="submit-quiz-btn"
            onClick={submitQuiz}
            disabled={answered < total}
            className="px-10 py-4 rounded-2xl bg-[#7ed300] text-white font-bold text-base hover:bg-[#62aa00] shadow-[0_8px_30px_rgba(126,211,0,0.3)] hover:shadow-[0_8px_30px_rgba(126,211,0,0.4)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
          >
            Submit Quiz ({answered}/{total} answered)
          </button>
        ) : (
          <button
            id="retry-quiz-btn"
            onClick={clearQuiz}
            className="px-10 py-4 rounded-2xl bg-[#7ed300] text-white font-bold text-base hover:bg-[#62aa00] shadow-[0_8px_30px_rgba(126,211,0,0.3)] hover:shadow-[0_8px_30px_rgba(126,211,0,0.4)] hover:-translate-y-1 transition-all"
          >
            ← Back to Chat
          </button>
        )}
      </div>
    </div>
  );
}
