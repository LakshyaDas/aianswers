'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, generateAnswer } from '@/lib/gemini';
import { MessageList } from '@/components/message-list';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Zap, Sparkles } from 'lucide-react';
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

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateAnswer(userMessage.content);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to generate answer. Please check your API key.');
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
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <header className="relative border-b border-border/50 bg-card/50 backdrop-blur-md futuristic-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AI Answer Generator
                </h1>
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground">
                Powered by advanced AI technology
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="container mx-auto px-4 py-8 max-w-3xl h-full flex flex-col">
            <div className="flex-1">
              <MessageList messages={messages} />
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-border/50 bg-card/50 backdrop-blur-md futuristic-border">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent pointer-events-none" />
          <div className="container mx-auto px-4 py-4 max-w-3xl relative z-10">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative group">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything... (Shift + Enter for new line)"
                  className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {isLoading
                    ? 'Generating your answer...'
                    : 'Press Enter to send'}
                </p>
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold neon-glow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating
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
