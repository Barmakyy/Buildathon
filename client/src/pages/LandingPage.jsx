import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles, MessageSquareDiff, Languages, MapPin, ClipboardList, Rocket, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-[#e5f8c0]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-8 h-8 text-[#7ed300]" />
          <span className="text-xl font-bold tracking-tight text-slate-800">Elimu AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-500">
          <a href="#features" className="hover:text-[#62aa00] transition-colors">Platform Features</a>
          <a href="#impact" className="hover:text-[#62aa00] transition-colors">Our Impact</a>
        </div>
        <button
          onClick={() => navigate('/tutor')}
          className="px-6 py-2.5 rounded-full bg-[#7ed300] text-white text-sm font-bold shadow-[0_4px_14px_0_rgba(126,211,0,0.39)] hover:bg-[#62aa00] hover:shadow-[0_6px_20px_rgba(126,211,0,0.23)] transition-all hover:-translate-y-0.5"
        >
          Start Learning Free
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-36 flex flex-col items-center text-center overflow-hidden">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium mb-10 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#7ed300]" />
          Powered by Google Gemini 2.5 Flash
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-5xl leading-[1.1]">
          Your Personal STEM Tutor, <br className="hidden md:block" />
          <span className="text-[#62aa00]">Built for Kenya.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl leading-relaxed font-medium">
          Bridge the teacher-student gap. Elimu AI explains complex concepts using local Kenyan analogies in formal English, Kiswahili, and Sheng.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5">
          <button
            onClick={() => navigate('/tutor')}
            className="px-10 py-5 rounded-2xl bg-[#7ed300] text-white text-lg font-bold shadow-[0_8px_30px_rgba(126,211,0,0.3)] hover:bg-[#62aa00] hover:shadow-[0_8px_30px_rgba(126,211,0,0.4)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            Launch Tutor <Rocket className="w-5 h-5" />
          </button>
          <a
            href="#features"
            className="px-10 py-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 text-lg font-bold shadow-sm hover:border-[#7ed300] hover:text-[#62aa00] transition-all flex items-center justify-center gap-3 group"
          >
            Explore Platform <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#7ed300] transition-colors" />
          </a>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section id="features" className="px-6 py-28 bg-white border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Learning that speaks your language.</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Elimu AI is designed specifically for the Kenyan curriculum, tackling the unique challenges of learning complex STEM subjects.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 mb-8">
                <Languages className="w-8 h-8 text-[#62aa00]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Natural Code-Switching</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Most students learn best when taught in the language they think in. Elimu AI seamlessly transitions between Formal English, Kiswahili, and Sheng to ensure maximum comprehension without the language barrier.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="w-5 h-5 text-[#7ed300]" /> Perfect for Form 1-4 students</li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="w-5 h-5 text-[#7ed300]" /> Authentic Nairobi youth parlance</li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="w-5 h-5 text-[#7ed300]" /> Swahili scientific term translation</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 mb-8">
                <MapPin className="w-8 h-8 text-[#62aa00]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Localised Analogies</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Why use snowboards to explain friction when you can use a matatu on Thika Road? We ground abstract, difficult STEM concepts in everyday Kenyan realities that students already deeply understand.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="w-5 h-5 text-[#7ed300]" /> Matatu dynamics for Physics</li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="w-5 h-5 text-[#7ed300]" /> M-Pesa scenarios for Mathematics</li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="w-5 h-5 text-[#7ed300]" /> Farming & Shamba analogies for Biology</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 mb-8">
                <ClipboardList className="w-8 h-8 text-[#62aa00]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Instant KCSE Quizzes</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Test your knowledge immediately after learning. With one click, generate a 5-question multiple-choice quiz aligned with the KCSE curriculum on any topic you are currently discussing.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="w-5 h-5 text-[#7ed300]" /> Real-time generation via Gemini</li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="w-5 h-5 text-[#7ed300]" /> Instant grading and feedback</li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700"><CheckCircle2 className="w-5 h-5 text-[#7ed300]" /> Detailed explanations for wrong answers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="px-6 py-28 bg-[#f4fce6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">Bridging the 1:58 Gap</h2>
          <p className="text-xl text-slate-700 leading-relaxed font-medium mb-12">
            In Kenyan public secondary schools, the average teacher-to-student ratio is 1:58. Personalised, 1-on-1 attention is physically impossible. 
            <br/><br/>
            By leveraging Google's <span className="font-bold text-[#62aa00]">Gemini 2.5 Flash</span>, Elimu AI provides infinite patience, culturally relevant explanations, and 24/7 availability to every student with internet access.
          </p>
          <button
            onClick={() => navigate('/tutor')}
            className="px-12 py-5 rounded-full bg-[#7ed300] text-white text-xl font-bold shadow-[0_8px_30px_rgba(126,211,0,0.3)] hover:bg-[#62aa00] hover:-translate-y-1 transition-all"
          >
            Try Elimu AI Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-slate-500 bg-white border-t border-slate-200">
        <div className="flex items-center justify-center gap-2 mb-6">
          <GraduationCap className="w-6 h-6 text-[#7ed300]" />
          <span className="font-extrabold text-slate-800 text-lg">Elimu AI</span>
        </div>
        <p className="mb-2 font-medium">Built for the AI for Education Hackathon 2026</p>
        <p className="text-sm flex items-center justify-center gap-1.5">
          Powered by <span className="font-bold text-slate-700">Vercel & Render</span> & <span className="font-bold text-[#62aa00]">Gemini 2.5 Flash</span>
        </p>
      </footer>
    </div>
  );
}
