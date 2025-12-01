'use client';

import { Message } from '@/lib/gemini';
import { formatAIResponse } from '@/lib/response-formatter';
import { Bot, User, Zap } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 neon-glow">
            <Zap className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            AI Answer Generator
          </h2>
          <p className="text-muted-foreground text-sm">
            Ask me anything and receive intelligent, beautifully formatted answers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`animate-fadeInUp ${
            message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
          }`}
        >
          <div
            className={`flex gap-3 max-w-2xl ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className="flex-shrink-0 pt-1">
              {message.role === 'user' ? (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center accent-glow">
                  <Bot className="w-5 h-5 text-accent-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              {message.role === 'user' ? (
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 rounded-xl p-4 futuristic-border">
                  <p className="text-sm leading-relaxed text-foreground">
                    {message.content}
                  </p>
                </div>
              ) : (
                <div className="bg-card border border-border/50 rounded-xl p-4 futuristic-border space-y-4">
                  <FormattedResponse content={message.content} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface FormattedResponseProps {
  content: string;
}

function FormattedResponse({ content }: FormattedResponseProps) {
  const formatted = formatAIResponse(content);

  return (
    <div className="space-y-3">
      {formatted.sections.map((section, idx) => {
        switch (section.type) {
          case 'heading':
            return (
              <div
                key={idx}
                className={`${
                  section.level === 1
                    ? 'text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-4 mb-2'
                    : 'text-base font-semibold text-primary mt-3 mb-2'
                }`}
              >
                {section.content}
              </div>
            );

          case 'paragraph':
            return (
              <p key={idx} className="text-sm leading-relaxed text-foreground/90">
                {section.content}
              </p>
            );

          case 'list':
            return (
              <div key={idx} className="space-y-2 pl-4">
                {section.items?.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex gap-3 text-sm text-foreground/90"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            );

          case 'code':
            return (
              <div
                key={idx}
                className="bg-black/30 border border-primary/20 rounded-lg p-3 font-mono text-xs text-primary overflow-x-auto"
              >
                <pre>{section.content}</pre>
              </div>
            );

          case 'note':
            return (
              <div
                key={idx}
                className="bg-accent/10 border-l-3 border-accent rounded-r-lg p-3 text-sm text-foreground/90"
              >
                <span className="font-semibold text-accent">Note:</span> {section.content}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
