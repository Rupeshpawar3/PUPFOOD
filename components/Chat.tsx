import React, { useState, useEffect, useRef } from 'react';
import { View } from '../types';
import { chatWithBot } from '../services/geminiService';

interface ChatProps {
  onBack: () => void;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const Chat: React.FC<ChatProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', role: 'model', text: "Hello! I'm your AI Pet Companion. Ask me anything about your dog's health, diet, or behavior." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
      if (!input.trim()) return;

      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      try {
          const responseText = await chatWithBot(userMsg.text, history);
          const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
          setMessages(prev => [...prev, botMsg]);
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark font-display relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-white/10 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md sticky top-0 z-20 shadow-sm">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-gray-700 dark:text-white">arrow_back</span>
            </button>
            <div className="flex-1 ml-2">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h1>
                <div className="flex items-center gap-1.5">
                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Gemini Pro Active</span>
                </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-gray-500">more_vert</span>
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg, index) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up-fade`}
                    style={{animationDelay: '0s'}} // Immediate for user, slight delay handled by typing indicator for bot
                >
                    {msg.role === 'model' && (
                        <div className="size-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shrink-0 mr-3 mt-1 shadow-md animate-scale-in">
                            <span className="material-symbols-outlined text-sm">smart_toy</span>
                        </div>
                    )}
                    <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm relative group transition-all duration-300 ${
                        msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-sm shadow-primary/20 hover:shadow-md' 
                        : 'bg-white dark:bg-white/10 text-gray-800 dark:text-gray-100 rounded-tl-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/15'
                    }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        {msg.role === 'model' && (
                            <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                                </button>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <span className="material-symbols-outlined text-sm">content_copy</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start animate-slide-up-fade">
                     <div className="size-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shrink-0 mr-3 mt-1 shadow-md">
                        <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                    <div className="bg-white dark:bg-white/10 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-2">
                        <span className="size-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="size-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                        <span className="size-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 p-2 pr-2 rounded-[24px] border border-gray-200 dark:border-white/10 focus-within:border-primary/50 transition-all shadow-inner focus-within:shadow-primary/10">
                <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">add_circle</span>
                </button>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about dog care..." 
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="size-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-all shadow-md active:scale-90 hover:shadow-lg"
                >
                    <span className="material-symbols-outlined">send</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Chat;