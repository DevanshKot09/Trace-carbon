import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiChatBot() {
  const { user, activities, goals } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi ${user?.name || 'there'}! 👋 I'm CarbonWise AI. Ask me anything about reducing your carbon footprint, green options, food choices, or audit details matching your ledger!`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (!user) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    setInput('');
    
    // Add user message locally
    const updatedMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessageContent, timestamp: new Date() }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Structure specific context from activities and goals for Retrieval-Augmented Generation (RAG)
      const formattedRecentActivities = (activities || []).slice(0, 15).map(act => ({
        category: act.category,
        title: act.title,
        co2Value: act.co2Value,
        unit: act.unit,
        date: act.date,
        details: act.details
      }));

      const formattedGoals = (goals || []).map(g => ({
        title: g.title,
        category: g.category,
        targetValue: g.targetValue,
        currentValue: g.currentValue,
        unit: g.unit,
        completed: g.completed,
        deadline: g.deadline
      }));

      // Gather user context safely to feed system instructions
      const userContext = {
        name: user?.name,
        sustainabilityScore: user?.sustainabilityScore,
        totalCo2: user?.stats?.totalCo2,
        monthlyCo2: user?.stats?.monthlyCo2,
        reductionPercentage: user?.stats?.reductionPercentage,
        occupation: user?.occupation,
        recentActivities: formattedRecentActivities,
        goals: formattedGoals
      };

      // Request server-side Gemini API Proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          userContext
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error status');
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.response || "I didn't receive a clean response. Let's try again!",
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "❌ Sorry, I encountered a connection issue contacting the CarbonWise server. Please ensure your dev server is active and try again.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: `History cleared. How can I assist you in reducing your greenhouse emissions today?`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-chatbot-root">
      <AnimatePresence>
        {!isOpen ? (
          // Float Button
          <motion.button
            id="chatbot_trigger_btn"
            key="trigger"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-xl shadow-emerald-700/20 hover:bg-emerald-600 transition-all cursor-pointer border border-[#E2EAE5]/35 dark:border-emerald-500/20 relative group"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white text-[8px] text-white font-extrabold items-center justify-center">AI</span>
            </div>
            <MessageSquare className="h-6 w-6" />
          </motion.button>
        ) : (
          // Chat View Window Panel
          <motion.div
            id="chatbot_panel"
            key="panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-[#07130D] rounded-2xl border border-[#E2EAE5] dark:border-emerald-900/30 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-emerald-700 dark:bg-emerald-950 p-4 flex items-center justify-between text-white border-b border-[#E2EAE5]/10">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                  <Bot className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-1.5">
                    CarbonWise Copilot
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h4>
                  <p className="text-[10px] text-emerald-300/80">Real-time green energy advisor</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-200 hover:text-white transition-colors cursor-pointer"
                  title="Clear chat records"
                >
                  <Trash2 className="h-3.8 w-3.8" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-200 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* User Stats Snapshot ribbon */}
            <div className="bg-[#EAF5EF] dark:bg-emerald-950/20 px-4 py-2 border-b border-[#E2EAE5]/40 dark:border-emerald-950/30 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Score: <strong>{user?.sustainabilityScore || 50} pts</strong>
              </span>
              <span>Streak: <strong>🔥 {user?.streakCount || 0} days</strong></span>
              <span>CO₂ Tracker: <strong>{(user?.stats?.totalCo2 || 0).toFixed(0)} kg</strong></span>
            </div>

            {/* Message Pane Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-[#07130D]/40 scrollbar-thin">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed shadow-xs ${
                    m.role === 'user' 
                      ? 'bg-emerald-700 text-white rounded-br-xs' 
                      : 'bg-white dark:bg-[#0C1E14] border border-[#E2EAE5] dark:border-emerald-900/30 text-[#1A2E22] dark:text-[#E2EAE5] rounded-bl-xs'
                  }`}>
                    <p className="whitespace-pre-line">{m.content}</p>
                    <span className="block text-[8px] text-right mt-1 opacity-60">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Typing loader state */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-white dark:bg-[#0C1E14] border border-[#E2EAE5] dark:border-emerald-900/40 rounded-2xl rounded-bl-xs px-3.5 py-3 text-xs flex items-center gap-1 text-gray-400">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    <span className="ml-1 text-[10px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">Formulating recommendation...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E2EAE5] dark:border-emerald-950/20 bg-white dark:bg-[#07130D] flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask CarbonWise AI..."
                className="flex-1 bg-slate-50 dark:bg-[#0C1E14] border border-[#E2EAE5] dark:border-emerald-900/30 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-emerald-600 focus:bg-white dark:focus:bg-[#07130D] text-[#1A2E22] dark:text-[#E2EAE5]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-emerald-750 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-750 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
