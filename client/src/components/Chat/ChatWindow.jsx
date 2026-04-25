import React, { useEffect, useRef } from 'react';
import useTutorStore from '../../store/useTutorStore';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import TypingIndicator from './TypingIndicator';
import WelcomeScreen from './WelcomeScreen';
import QuizPanel from '../Quiz/QuizPanel';

export default function ChatWindow() {
  const { messages, isStreaming, activeQuiz } = useTutorStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-slate-50/50">
      {activeQuiz ? (
        <div className="flex-1 overflow-y-auto">
          <QuizPanel />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col gap-6">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {isStreaming && messages[messages.length - 1]?.content === '' && (
                <TypingIndicator />
              )}
              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>
      )}
      <InputBar />
    </div>
  );
}
