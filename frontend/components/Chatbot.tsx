import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import { Icon } from './Icon';

const AILoadingIndicator: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! I'm the Wezi Medical AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await sendMessageToAI(input);
    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl border border-slate-200/80 flex flex-col h-[85vh] max-w-3xl mx-auto font-sans">
      <div className="p-4 border-b border-slate-200/80">
        <h3 className="text-lg font-bold text-slate-800">AI Health Assistant</h3>
        <p className="text-sm text-slate-500">Your personal health guide</p>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
        <div className="space-y-5">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                  <Icon name="chat" className="w-5 h-5" />
                </div>
              )}
              <div className={`max-w-md p-3 px-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                  <Icon name="chat" className="w-5 h-5" />
               </div>
               <div className="max-w-md p-3 px-4 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-lg shadow-sm">
                  <AILoadingIndicator />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-slate-200/80 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 w-full px-4 py-3 bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all duration-300 transform hover:scale-110"
            disabled={isLoading || !input.trim()}
          >
            <Icon name="send" className="w-6 h-6"/>
          </button>
        </form>
      </div>
    </div>
  );
};