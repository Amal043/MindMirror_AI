import React, { useState, useRef, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * TalkWithPebblue Component
 * A floating chatbot widget that appears on all pages.
 * Character: Pebblue, a comforting sloth companion.
 * Integrates directly with the backend API /api/pebblue/chat & Gemini LLM engine.
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
      // 1. Try Express Backend /api/pebblue/chat API
      const backendRes = await fetch('/api/pebblue/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_message: userText,
          history: messages
        })
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.reply) {
          setMessages(prev => [...prev, { id: `msg_p_${Date.now()}`, sender: 'pebblue', text: data.reply }]);
          setIsTyping(false);
          return;
        }
      }

      // 2. Fallback to Direct Gemini REST API
      const systemInstruction = 
        "You are Pebblue, a warm, soothing, and extremely gentle cartoon sloth companion for neurodivergent individuals. " +
        "Your purpose is to provide a calm, safe, and validating space. " +
        "Respond in a very supportive, cozy, and non-judgmental tone. " +
        "Keep your responses short, simple, and comforting (1 to 3 sentences max). " +
        "Focus on emotional validation, grounding exercises (like suggesting a slow breath or naming something in the room), " +
        "or simply offering to sit together. Never break character. Never mention you are an AI assistant.";

      const apiMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      apiMessages.push({ role: 'user', parts: [{ text: userText }] });

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: apiMessages,
            generationConfig: { maxOutputTokens: 180, temperature: 0.7 }
          })
        }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (replyText) {
          setMessages(prev => [...prev, { id: `msg_p_${Date.now()}`, sender: 'pebblue', text: replyText }]);
          setIsTyping(false);
          return;
        }
      }

      throw new Error("API call failed");

    } catch (err) {
      console.warn("Pebblue chat API failed, using fallback:", err);
      const fallbackText = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      await new Promise(resolve => setTimeout(resolve, 600));
      setMessages(prev => [...prev, { id: `msg_p_${Date.now()}`, sender: 'pebblue', text: fallbackText }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Window (Sleek Clean Header - Zero Text Hiding!) */}
      {isOpen && (
        <div 
          className={`w-[340px] sm:w-[360px] h-[460px] bg-white border border-[#e5e0d3] rounded-[32px] shadow-2xl flex flex-col justify-between overflow-hidden relative mb-4 ${
            lowStimulation ? '' : 'transition-all duration-300 transform scale-100 origin-bottom-right'
          }`}
          style={{ fontFamily: 'var(--font-family-base)' }}
        >
          {/* Sleek Integrated Header with Inline Mascot Avatar (No Hiding Text!) */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#F8F5EC] border-b border-[#e5e0d3] rounded-t-[32px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8DFF5] border border-[#DDD6FE] p-1 flex items-center justify-center shrink-0 shadow-sm">
                <img 
                  src="/pebblue_sloth.png" 
                  alt="Pebblue Sloth" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-[#5C5B99] font-extrabold text-sm tracking-wide">
                  Talk with Pebblue
                </h2>
                <span className="text-[10px] text-[#6B7280] font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Calming Companion AI
                </span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EAE5D8] hover:bg-[#DDD6C5] text-[#4B5563] transition-colors cursor-pointer"
              aria-label="Collapse Pebblue"
              title="Close Pebblue"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FDFBF7]">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#5C5B99] text-white rounded-[20px] rounded-br-none shadow-sm font-medium' 
                      : 'bg-[#EEF2FF] text-[#1F2937] border border-[#DDD6FE] rounded-[20px] rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#EEF2FF] text-[#5C5B99] text-xs px-3.5 py-2.5 rounded-[20px] rounded-bl-none italic flex items-center gap-1.5 border border-[#DDD6FE] shadow-sm font-semibold">
                  <span>Pebblue is typing</span>
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5C5B99] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5C5B99] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5C5B99] animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
              placeholder="Type a message to Pebblue..."
              className="flex-1 px-4 py-2.5 bg-[#F4F0E6] hover:bg-[#EAE5D8] focus:bg-white border border-[#E5E0D3] focus:border-[#5C5B99] rounded-full text-xs sm:text-sm outline-none text-[#1F2937] placeholder-[#6B7280] transition-all"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#5C5B99] hover:bg-[#4A4985] disabled:opacity-40 disabled:hover:bg-[#5C5B99] text-white transition-all cursor-pointer shadow-sm shrink-0"
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
          {/* Conversation Bubble Tooltip */}
          <div className="absolute bottom-24 bg-white/95 text-[#5C5B99] px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-lg border border-[#DDD6FE] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Talk with Pebblue 👋
          </div>
          
          {/* Collapsed Floating Sticker Avatar */}
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
