'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, generateAnswer } from '@/lib/gemini';
import { MessageList } from '@/components/message-list';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateAnswer(userMessage.content);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to generate answer.');
      console.error('Error generating answer:', error);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/40 border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-gray-800">
            AI Answer Assistant
          </h1>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pt-6">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 animate-fadeIn">
              <MessageList messages={messages} />
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="border-t backdrop-blur-xl bg-white/60 shadow-2xl sticky bottom-0">
          <div className="container mx-auto px-4 py-5 max-w-3xl">

            <form onSubmit={handleSubmit} className="space-y-3">

              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Start typing your question…"
                className="min-h-[90px] resize-none rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-md shadow-md focus:ring-2 focus:ring-purple-400 transition-all"
                disabled={isLoading}
              />

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Enter to send · Shift + Enter for a new line
                </p>

                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="gap-2 rounded-xl px-6 py-2 h-[42px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:opacity-90 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </Button>

              </div>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
}
