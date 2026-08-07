import React, { useState, useRef, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * TalkWithPebblue Component
 * A floating chatbot widget that appears on all pages.
 * Character: Pebblue, a comforting sloth companion.
 * Integrates directly with the Gemini API to respond to the user with gentle, supportive, and grounding statements.
 */
export const TalkWithPebblue = () => {
  const { lowStimulation } = useSensory();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg_init',
      sender: 'pebblue',
      text: "Hi! I'm Pebblue. Take a slow breath. This is a calm, safe place for you. Want to share anything or just sit together?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: lowStimulation ? 'auto' : 'smooth' });
    }
  }, [messages, isTyping, lowStimulation]);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  const MODEL_NAME = "gemini-2.5-flash";

  // Calming fallbacks in case API fails
  const FALLBACK_RESPONSES = [
    "I'm here with you. Take your time, there's no rush at all.",
    "That sounds like a lot to carry. Remember to take a gentle, deep breath.",
    "Your feelings are completely valid. It's okay to just sit and rest for a bit.",
    "I'm listening. Thank you for sharing that with me.",
    "Would you like to try a slow inhale and exhale with me? In... and out...",
    "We can take things one small step at a time. I'm right here."
  ];

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText || !inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    // Append user message
    const userMsgId = `msg_u_${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: userText }]);
    setIsTyping(true);

    try {
      // Build the history for Gemini API
      // Pebblue's system instruction
      const systemInstruction = 
        "You are Pebblue, a warm, soothing, and extremely gentle cartoon sloth companion for neurodivergent individuals. " +
        "Your purpose is to provide a calm, safe, and validating space. " +
        "Respond in a very supportive, cozy, and non-judgmental tone. " +
        "Keep your responses short, simple, and comforting (1 to 3 sentences max). " +
        "Focus on emotional validation, grounding exercises (like suggesting a slow breath or naming something in the room), " +
        "or simply offering to sit together. Never break character. Never mention you are an AI assistant.";

      // Map local messages to Gemini API format
      const apiMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      // Append the latest user message
      apiMessages.push({
        role: 'user',
        parts: [{ text: userText }]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: apiMessages,
            generationConfig: {
              maxOutputTokens: 180,
              temperature: 0.7
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini status ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      if (aiReply) {
        setMessages(prev => [...prev, { id: `msg_p_${Date.now()}`, sender: 'pebblue', text: aiReply }]);
      } else {
        throw new Error("Empty reply");
      }
    } catch (err) {
      console.warn("Pebblue chat API failed, using fallback:", err);
      // Pick a random fallback response
      const fallbackText = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      // Brief delay to simulate typing
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, { id: `msg_p_${Date.now()}`, sender: 'pebblue', text: fallbackText }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div 
          className={`w-[340px] sm:w-[360px] h-[450px] bg-white/95 border border-[#e5e0d3] rounded-[32px] shadow-2xl flex flex-col justify-between overflow-visible relative mb-4 ${
            lowStimulation ? '' : 'transition-all duration-300 transform scale-100 origin-bottom-right'
          }`}
          style={{ fontFamily: 'var(--font-family-base)' }}
        >
          {/* Sloth Header Illustration */}
          <div 
            onClick={() => setIsOpen(false)}
            className={`absolute -top-16 left-6 w-20 h-20 cursor-pointer ${
              lowStimulation ? '' : 'animate-bounce'
            } hover:scale-105 transition-transform`}
            title="Click to collapse Pebblue"
          >
            <img 
              src="/pebblue_sloth.png" 
              alt="Pebblue Sloth" 
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          {/* Chat Header */}
          <div className="flex items-center justify-between pl-28 pr-6 py-4 border-b border-[#e5e0d3]">
            <div>
              <h2 className="text-[#5C5B99] font-bold text-base tracking-wide">
                Talk with Pebblue
              </h2>
              <span className="text-[10px] text-text-muted font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                Calming Companion
              </span>
            </div>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-bg-secondary hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Collapse Pebblue"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-primary/30">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3.5 text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#5C5B99] text-white rounded-[20px] rounded-br-none shadow-sm' 
                      : 'bg-[#efebfc] text-[#1f2937] border border-purple-100/50 rounded-[20px] rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#efebfc] text-text-muted text-xs px-3.5 py-2.5 rounded-[20px] rounded-bl-none italic flex items-center gap-1 shadow-sm">
                  <span>Pebblue is typing</span>
                  <span className="inline-flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-1 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-1 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Footer */}
          <form 
            onSubmit={handleSend} 
            className="p-3 border-t border-[#e5e0d3] bg-white flex items-center gap-2 rounded-b-[32px]"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-bg-secondary/60 hover:bg-bg-secondary focus:bg-white border border-border focus:border-[#5C5B99] rounded-full text-sm outline-none text-text-primary placeholder-text-muted transition-all"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f3a1b3] hover:bg-[#eb8c9f] disabled:opacity-40 disabled:hover:bg-[#f3a1b3] text-white transition-all cursor-pointer shadow-sm"
              aria-label="Send message to Pebblue"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger (Sticker when collapsed) */}
      {!isOpen && (
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex flex-col items-center justify-center focus:outline-none relative group border-0 bg-transparent ${
            lowStimulation ? '' : 'animate-bounce'
          }`}
          style={{ animationDuration: '3s' }}
          title="Click to talk with Pebblue"
        >
          {/* Conversation Bubble tooltip */}
          <div className="absolute bottom-24 bg-white/95 text-[#5C5B99] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg border border-[#DDD6FE] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Talk with Pebblue 👋
          </div>
          
          {/* Avatar Container */}
          <div className="w-20 h-20 transition-transform duration-200 hover:scale-110 cursor-pointer">
            <img 
              src="/pebblue_sloth.png" 
              alt="Pebblue Sloth" 
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </button>
      )}
    </div>
  );
};
