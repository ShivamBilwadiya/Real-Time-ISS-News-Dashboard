import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const CHAT_STORAGE_KEY = 'iss_dashboard_chat';
const MAX_MESSAGES = 30;

export function useChatbot({ position, currentSpeed, articles }) {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        role: 'assistant',
        content: "Hello! I'm your ISS Dashboard Assistant. Ask me anything about the current ISS data, astronauts, or the latest news on the dashboard. 🛰️",
        timestamp: Date.now(),
      },
    ];
  });
  const [isTyping, setIsTyping] = useState(false);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch (e) {}
  }, [messages]);

  // Build the context from dashboard data
  const buildContext = useCallback(() => {
    const newsTitles = (articles || [])
      .slice(0, 6)
      .map((a, i) => `${i + 1}. "${a.title}" (${a.source?.name || 'Unknown'})`)
      .join('\n');

    return `
CURRENT DASHBOARD DATA:
======================
ISS Position:
- Latitude: ${position?.latitude?.toFixed(4) || 'N/A'}
- Longitude: ${position?.longitude?.toFixed(4) || 'N/A'}
- Current Speed: ${currentSpeed || 'N/A'} km/h
- Altitude: ~408 km (average orbital altitude)
- Orbital Period: ~92 minutes

Latest News Headlines:
${newsTitles || 'No news available.'}
======================
    `.trim();
  }, [position, currentSpeed, articles]);

  // Send message to the AI
  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim()) return;

      const userMsg = {
        role: 'user',
        content: userMessage.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      // Use env var first, fallback to the token provided in the assignment prompt if not set in Vercel
      const token = import.meta.env.VITE_AI_TOKEN;
      const context = buildContext();

      const systemPrompt = `You are a dashboard assistant for an ISS (International Space Station) tracking dashboard. You can ONLY answer questions based on the provided dashboard data below. If the user asks something that is NOT in the data, politely say you can only help with dashboard-related information. Keep responses concise and helpful.

${context}`;

      try {
        const payload = {
          model: "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage.trim() }
          ],
          max_tokens: 300,
          temperature: 0.7
        };

        const response = await axios.post(
          '/api/ai',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          }
        );

        let aiResponse = '';
        if (response.data?.choices?.[0]?.message?.content) {
          aiResponse = response.data.choices[0].message.content.trim();
        } else {
          aiResponse = "I received a response but couldn't parse it properly. Please try again.";
        }

        const assistantMsg = {
          role: 'assistant',
          content: aiResponse || "I'm sorry, I couldn't generate a response. Please try again.",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error('Chatbot error:', err);

        let errorMessage = "I'm having trouble connecting right now. Please try again in a moment.";

        if (err.response?.status === 503) {
          errorMessage = "The AI model is loading. Please wait a moment and try again. 🔄";
        } else if (err.response?.status === 401) {
          errorMessage = "Authentication error. Please check the AI token configuration.";
        } else if (err.response?.data?.error) {
          errorMessage = `API Error (${err.response.status}): ${err.response.data.error}`;
        } else {
          errorMessage = `Connection Error: ${err.message}`;
        }

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: errorMessage, timestamp: Date.now() },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [buildContext]
  );

  // Clear chat history
  const clearHistory = useCallback(() => {
    const initial = [
      {
        role: 'assistant',
        content: "Chat cleared! I'm ready to help with your dashboard data. 🛰️",
        timestamp: Date.now(),
      },
    ];
    setMessages(initial);
  }, []);

  return {
    messages,
    sendMessage,
    isTyping,
    clearHistory,
  };
}
