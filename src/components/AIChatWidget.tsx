import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hi there! I'm your CollegeConnect AI Assistant. I can help you find assignments, summarize announcements, or answer questions about your classes. What do you need help with?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let aiResponse = "I'm a mock assistant! But if I were real, I'd say: That sounds like a great question. Check your dashboard for more details.";
      
      const lowerInput = userText.toLowerCase();
      if (lowerInput.includes('due') || lowerInput.includes('assignment')) {
        aiResponse = "You have 2 pending assignments due this week for CSE-301 and CSE-305. Would you like me to open the Classroom view?";
      } else if (lowerInput.includes('attendance')) {
        aiResponse = "Your current overall attendance is 84%. You're in good standing above the 75% requirement!";
      } else if (lowerInput.includes('summarize')) {
        aiResponse = "The latest announcement from Dr. Verma states that end-term practical datesheets are now available in the IT Block.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    "What's due today?",
    "Check my attendance",
    "Summarize announcements"
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full bg-brand text-white shadow-lg shadow-brand/40 hover:shadow-brand/60 hover:-translate-y-1 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* Chat Panel */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-brand/20 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-brand/20 to-brand/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shadow-md shadow-brand/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary leading-tight">AI Assistant</h3>
              <span className="text-[10px] text-brand font-medium">CollegeConnect Alpha</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-3 h-3 text-brand" />
                </div>
              )}
              <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-brand text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-text-primary rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                  {currentUser?.profilePicture ? (
                    <img src={currentUser.profilePicture} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-3 h-3 text-white" />
                  )}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-3 h-3 text-brand" />
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-text-primary rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {quickActions.map(action => (
              <button
                key={action}
                onClick={() => { setInput(action); setTimeout(() => handleSend({ preventDefault: () => {} } as any), 50); }}
                className="text-[10px] px-2.5 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand hover:bg-brand/20 transition-colors cursor-pointer text-left"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/20 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-brand/50 transition-colors"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-brand text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors hover:bg-brand-hover"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
};
