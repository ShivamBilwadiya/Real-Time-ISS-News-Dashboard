import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, Bot, User } from 'lucide-react';

export default function Chatbot({ messages, sendMessage, isTyping, clearHistory, isDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl
          bg-gradient-to-br from-primary-600 to-primary-500 text-white
          hover:from-primary-500 hover:to-primary-400 transition-all duration-200`}
        style={{ boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)' }}
        id="chatbot-toggle"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl border flex flex-col overflow-hidden
              ${isDark
                ? 'bg-dark-900/95 border-dark-700/50'
                : 'bg-white/95 border-gray-200'
              }`}
            style={{ backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b
              ${isDark ? 'border-dark-700/50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>ISS Assistant</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={clearHistory}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-dark-400 hover:text-red-400 hover:bg-dark-800' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'}`}
                title="Clear chat"
                id="chatbot-clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: '380px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : isDark
                        ? 'bg-dark-800 text-dark-200 rounded-bl-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className={`px-4 py-3 rounded-2xl rounded-bl-md ${isDark ? 'bg-dark-800' : 'bg-gray-100'}`}>
                    <div className="flex gap-1">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className={`flex items-center gap-2 px-4 py-3 border-t
              ${isDark ? 'border-dark-700/50' : 'border-gray-200'}`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about ISS data..."
                id="chatbot-input"
                className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all
                  ${isDark
                    ? 'bg-dark-800 text-white placeholder:text-dark-500 border border-dark-700/50 focus:border-primary-500/50'
                    : 'bg-gray-100 text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:border-primary-400'
                  }`}
                disabled={isTyping}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isTyping || !input.trim()}
                className="p-2.5 rounded-xl bg-primary-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-400 transition-colors"
                id="chatbot-send"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
