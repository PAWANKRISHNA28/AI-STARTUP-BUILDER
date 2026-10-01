import { useAuthStore } from '../store/useAuthStore';
import React, { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Paperclip, Globe, Image as ImageIcon, Mic, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { ChatMessage } from '../components/chat/ChatMessage';
import { AIThinking } from '../components/chat/AIThinking';
import { t } from '../utils/i18n';
import { api } from '../services/api';

export const AIChatPage: React.FC = () => {
  const chatMessages = useChatStore(state => state.chatMessages);
  const addChatMessage = useChatStore(state => state.addChatMessage);
  const isAIThinking = useChatStore(state => state.isAIThinking);
  const setAIThinking = useChatStore(state => state.setAIThinking);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAIThinking]);

  const handleSend = React.useCallback(async (text: string) => {
    if (!text.trim() || useChatStore.getState().isAIThinking) return;
    
    // Add user message
    useChatStore.getState().addChatMessage({ role: 'user', content: text });
    setInputValue('');
    useChatStore.getState().setAIThinking(true);

    try {
      const response = await api.sendChatMessage("default_project", text);
      useChatStore.getState().setAIThinking(false);
      
      useChatStore.getState().addChatMessage({
        role: 'assistant',
        content: response.message || "Response received.",
        cards: ['business-analysis', 'location', 'competitor', 'financial', 'visualization', 'workspace-tabs']
      });
    } catch (error) {
      useChatStore.getState().setAIThinking(false);
      console.error(error);
    }
  }, []);

  const suggestions = [
    { title: 'Start a Coffee Shop', icon: '☕' },
    { title: 'Create an AI SaaS', icon: '🧠' },
    { title: 'Open a Bakery', icon: '🥐' },
    { title: 'Start a Restaurant', icon: '🍕' },
    { title: 'Launch a Pharmacy', icon: '💊' },
    { title: 'Build an Ecommerce Business', icon: '🛍️' }
  ];

  return (
    <div className="flex flex-col h-full relative max-w-5xl mx-auto w-full z-10">
      <AnimatePresence>
        {isAIThinking && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <div className="absolute inset-0 bg-background/80 z-10 backdrop-blur-[2px]"></div>
            <img 
              src="/futuristic_bg.webp" 
              alt="Futuristic Processing" 
              loading="lazy"
              fetchPriority="low"
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen scale-105 animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            {/* Ambient scanning line */}
            <m.div 
              initial={{ top: 0, y: '-10vh' }}
              animate={{ y: '110vh' }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_var(--primary)] z-20 opacity-50"
            />
          </m.div>
        )}
      </AnimatePresence>
      
      {chatMessages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-32">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 max-w-2xl w-full"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center mb-8">
              <Cpu className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-4xl font-bold text-foreground">AI Startup Builder</h1>
            <p className="text-xl text-muted-foreground">Build your startup with AI.</p>
            <p className="text-muted-foreground">Everything begins with one conversation.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-12">
              {suggestions.map(s => (
                <button
                  key={s.title}
                  onClick={() => handleSend(s.title)}
                  className="p-4 border border-border/50 rounded-2xl bg-card hover:border-primary/50 hover:shadow-md transition-all text-left flex flex-col gap-2 group"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{s.title}</span>
                </button>
              ))}
            </div>
          </m.div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-none pb-40 px-4">
          <div className="py-4">
            {chatMessages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} cards={msg.cards} />
            ))}
            
            {isAIThinking && (
              <div className="py-4 flex gap-4 bg-transparent max-w-4xl mx-auto w-full px-4 justify-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-sky text-white flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <AIThinking agents={[
                    { name: 'Planner Agent', status: 'completed' },
                    { name: 'Market Research Agent', status: 'completed' },
                    { name: 'Competitor Agent', status: 'running' },
                    { name: 'Financial Agent', status: 'pending' },
                    { name: 'Location Agent', status: 'pending' },
                    { name: 'Branding Agent', status: 'pending' },
                  ]} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-10" />
          </div>
        </div>
      )}

      {/* Fixed Bottom Input */}
      <div className="absolute bottom-0 left-0 right-0 pb-6 pt-10 px-4 bg-gradient-to-t from-background/90 to-transparent pointer-events-none z-20">
        <div className="max-w-4xl mx-auto relative pointer-events-auto">
          <div className="glass-panel bg-white/50 backdrop-blur-3xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[32px] p-2 flex flex-col transition-all duration-300 focus-within:shadow-[0_10px_40px_rgba(79,140,255,0.15)] focus-within:bg-white/70">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputValue);
                }
              }}
              placeholder="Message AI Startup Builder..."
              className="w-full max-h-40 min-h-[44px] bg-transparent border-none resize-none focus:ring-0 py-3 px-4 text-[15px] font-medium text-heading placeholder-muted-foreground scrollbar-none"
              rows={1}
            />
            
            <div className="flex justify-between items-center px-2 pb-1 pt-1">
              <div className="flex items-center gap-1">
                <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-white/60 rounded-full transition-all">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-white/60 rounded-full transition-all">
                  <Globe className="w-5 h-5" />
                </button>
                <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-white/60 rounded-full transition-all">
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-white/60 rounded-full transition-all">
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSend(inputValue)}
                  disabled={!inputValue.trim() || isAIThinking}
                  className={`p-3 rounded-full transition-all shadow-md ${
                    inputValue.trim() && !isAIThinking 
                      ? 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 hover:shadow-lg shadow-primary/30' 
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4 text-xs font-medium text-muted-foreground">
            AI Startup Builder can make mistakes. Consider verifying critical business insights.
          </div>
        </div>
      </div>
    </div>
  );
};
