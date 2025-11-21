'use client';

import { Message } from '@/lib/gemini';
import { Bot, User } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Bot className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">Start a conversation</p>
        <p className="text-sm">Ask me anything and I'll help you find answers</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex gap-4 ${
            message.role === 'assistant' ? 'bg-muted/30' : ''
          } p-4 rounded-lg`}
        >
          <div className="flex-shrink-0">
            {message.role === 'user' ? (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="font-semibold text-sm">
              {message.role === 'user' ? 'You' : 'AI Assistant'}
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
