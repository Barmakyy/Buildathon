import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bot, User } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 animate-fade-in w-full ${isUser ? 'flex-row-reverse self-end max-w-[85%]' : 'self-start max-w-[95%] md:max-w-[85%]'}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
        isUser
          ? 'bg-white border border-slate-200 text-slate-500'
          : 'bg-[#7ed300] text-white shadow-md shadow-[#e5f8c0]'
      }`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
      </div>

      {/* Bubble */}
      <div className={`rounded-[1.5rem] px-5 py-4 shadow-sm relative ${
        isUser
          ? 'bg-[#f4fce6] border-2 border-[#e5f8c0] text-slate-800 rounded-tr-sm shadow-sm'
          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
      }`}>
        {isUser ? (
          <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="my-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <SyntaxHighlighter style={oneLight} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1rem', background: '#f8fafc' }} {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-[#f4fce6] text-[#4a8000] px-1.5 py-0.5 rounded-md font-mono text-sm border border-[#e5f8c0]" {...props}>{children}</code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {message.timestamp && (
          <span className={`text-[11px] mt-2 block text-right font-bold ${isUser ? 'text-[#62aa00]' : 'text-slate-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
