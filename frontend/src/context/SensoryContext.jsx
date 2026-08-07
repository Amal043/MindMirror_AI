import React, { createContext, useContext, useState, useEffect } from 'react';

const SensoryContext = createContext();

export const SensoryProvider = ({ children }) => {
  const [lowStimulation, setLowStimulation] = useState(false);
  const [readingEase, setReadingEase] = useState(false);
  const [activePalette, setActivePalette] = useState('slate');
  const [fontSizePx, setFontSizePx] = useState(16);

  const [currentRoute, setCurrentRoute] = useState('home');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal state for Pause & Reset overlay
  const [isDeescalateOpen, setIsDeescalateOpen] = useState(false);

  // Pre-populated realistic session history for Progress dashboard (Mechanics not grades)
  const [sessionHistory, setSessionHistory] = useState([
    {
      id: 'session_past_1',
      scenarioId: 'accommodations',
      title: 'Asking for Extra Time / Accommodations',
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
      exchanges: 4,
      durationMin: 3,
      status: 'Completed',
      notes: 'Practiced direct phrasing for schedule adjustments.'
    },
    {
      id: 'session_past_2',
      scenarioId: 'boundary',
      title: 'Setting a Firm Boundary',
      date: new Date(Date.now() - 86400000 * 5).toLocaleDateString(),
      exchanges: 5,
      durationMin: 4,
      status: 'Completed',
      notes: 'Focused on saying no without unnecessary over-explaining.'
    }
  ]);

  // Synchronize CSS attributes on root document whenever settings change
  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-palette', activePalette);
    root.style.setProperty('--base-font-size', `${fontSizePx}px`);

    if (lowStimulation) {
      root.setAttribute('data-low-stim', 'true');
      root.setAttribute('data-motion', 'false');
      root.style.setProperty('--motion-enabled', 'false');
    } else {
      root.removeAttribute('data-low-stim');
      root.setAttribute('data-motion', 'true');
      root.style.setProperty('--motion-enabled', 'true');
    }

    if (readingEase) {
      root.setAttribute('data-reading-ease', 'true');
    } else {
      root.removeAttribute('data-reading-ease');
    }
  }, [lowStimulation, readingEase, activePalette, fontSizePx]);

  const toggleLowStimulation = () => setLowStimulation(prev => !prev);
  const toggleReadingEase = () => setReadingEase(prev => !prev);
  const setPalette = (palette) => setActivePalette(palette);
  const setFontSize = (size) => setFontSizePx(size);

  const openDeescalate = () => setIsDeescalateOpen(true);
  const closeDeescalate = () => setIsDeescalateOpen(false);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  /**
   * Helper to fetch current session messages from backend GET /api/session/:session_id
   */
  const fetchSessionMessages = async (sessionId) => {
    try {
      const res = await fetch(`/api/session/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
          return true;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch session messages from backend:", err);
    }
    return false;
  };

  /**
   * Restarts the last exchange by marking the latest user & assistant messages with restart metadata
   */
  const restartExchange = () => {
    setMessages(prev => {
      if (prev.length < 2) return prev;
      const copy = [...prev];
      const last = { ...copy[copy.length - 1], status: 'discarded', reason: 'user_restart' };
      const secondLast = { ...copy[copy.length - 2], status: 'discarded', reason: 'user_restart' };
      copy[copy.length - 1] = last;
      copy[copy.length - 2] = secondLast;
      return copy;
    });
  };

  /**
   * Start a new scenario session via Backend API stub
   */
  const startScenario = async (scenarioId, customText = null) => {
    setIsLoading(true);

    const defaultStarterText = scenarioId === 'custom' && customText 
      ? `Custom Scenario: "${customText}"`
      : `Starting scenario ${scenarioId}`;

    try {
      const res = await fetch('/api/scenario/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId, custom_text: customText })
      });

      let starterMessageText = defaultStarterText;
      let sessionId = `session_${Date.now()}`;

      if (res.ok) {
        const data = await res.json();
        sessionId = data.session_id;
        starterMessageText = data.persona_message || defaultStarterText;
      }

      setCurrentSessionId(sessionId);
      setActiveScenario({ scenarioId, customText });

      const fetched = await fetchSessionMessages(sessionId);

      if (!fetched) {
        const initialMessageObj = {
          id: `msg_init_${Date.now()}`,
          sender: 'persona',
          timestamp: new Date().toISOString(),
          segments: [
            {
              text: starterMessageText,
              annotations: []
            }
          ]
        };
        setMessages([initialMessageObj]);
      }

      setCurrentRoute('practice');
    } catch (err) {
      console.warn("Backend API offline, using fallback session:", err);
      const fallbackSessionId = `local_session_${Date.now()}`;
      setCurrentSessionId(fallbackSessionId);
      setActiveScenario({ scenarioId, customText });
      setMessages([
        {
          id: `msg_init_${Date.now()}`,
          sender: 'persona',
          timestamp: new Date().toISOString(),
          segments: [
            {
              text: scenarioId === 'custom' && customText
                ? `I read your situation: "${customText}". Let's work through this practice scenario together. How would you like to begin?`
                : "Hello! I understand you'd like to practice communicating in this situation. How can I support you?",
              annotations: []
            }
          ]
        }
      ]);
      setCurrentRoute('practice');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send a user message to the active session via Backend API stub
   */
  const sendMessage = async (userText) => {
    if (!userText || !userText.trim()) return;
    const trimmed = userText.trim();

    const userMessageObj = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      segments: [
        {
          text: trimmed,
          annotations: []
        }
      ]
    };

    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: currentSessionId, user_message: trimmed })
      });

      let personaReplyText = "I hear what you're saying, and thank you for being direct with me. Let's work through this step by step.";

      if (res.ok) {
        const data = await res.json();
        if (data.persona_message) personaReplyText = data.persona_message;
      }

      const fetched = await fetchSessionMessages(currentSessionId);

      if (!fetched) {
        const personaReplyObj = {
          id: `msg_p_${Date.now()}`,
          sender: 'persona',
          timestamp: new Date().toISOString(),
          segments: [
            {
              text: personaReplyText,
              annotations: []
            }
          ]
        };
        setMessages(prev => [...prev, personaReplyObj]);
      }

      const currentExchanges = Math.floor((messages.length + 2) / 2);
      const updatedHistoryItem = {
        id: currentSessionId || `session_${Date.now()}`,
        scenarioId: activeScenario?.scenarioId || 'practice',
        title: activeScenario?.scenarioId === 'custom' 
          ? `Custom: ${activeScenario.customText?.substring(0, 30)}...`
          : activeScenario?.scenarioId || 'Practice Rehearsal',
        date: new Date().toLocaleDateString(),
        exchanges: currentExchanges,
        durationMin: Math.max(1, Math.ceil(currentExchanges * 0.8)),
        status: 'In Progress / Practice Complete',
        notes: 'Practiced direct response in single-column rehearsal.'
      };

      setSessionHistory(prev => {
        const existsIndex = prev.findIndex(item => item.id === updatedHistoryItem.id);
        if (existsIndex >= 0) {
          const copy = [...prev];
          copy[existsIndex] = updatedHistoryItem;
          return copy;
        }
        return [updatedHistoryItem, ...prev];
      });

    } catch (err) {
      console.warn("Backend API message error, using client fallback reply:", err);
      const fallbackReplyObj = {
        id: `msg_p_${Date.now()}`,
        sender: 'persona',
        timestamp: new Date().toISOString(),
        segments: [
          {
            text: "I hear what you're saying, and thank you for being direct with me. Let's work through this step by step.",
            annotations: []
          }
        ]
      };
      setMessages(prev => [...prev, fallbackReplyObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPracticeSession = () => {
    setCurrentSessionId(null);
    setActiveScenario(null);
    setMessages([]);
  };

  // New Sensory & Accessibility States
  const [isFocusGuideActive, setIsFocusGuideActive] = useState(false);
  const [isFidgetOpen, setIsFidgetOpen] = useState(false);
  const [currentAvatarExpression, setCurrentAvatarExpression] = useState('neutral');
  const [isSpeakingTTS, setIsSpeakingTTS] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [dictationTranscript, setDictationTranscript] = useState('');

  const toggleFocusGuide = () => setIsFocusGuideActive(prev => !prev);
  const openFidget = () => setIsFidgetOpen(true);
  const closeFidget = () => setIsFidgetOpen(false);

  /**
   * Web Speech API - Text-To-Speech (TTS) Read Aloud
   */
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (!text) {
      setIsSpeakingTTS(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower, calm pace
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeakingTTS(true);
    utterance.onend = () => setIsSpeakingTTS(false);
    utterance.onerror = () => setIsSpeakingTTS(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingTTS(false);
    }
  };

  /**
   * Web Speech API - Voice Dictation
   */
  const startDictation = (onResultCallback) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsDictating(true);
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setDictationTranscript(transcriptText);
      if (onResultCallback) onResultCallback(transcriptText);
    };
    recognition.onerror = () => setIsDictating(false);
    recognition.onend = () => setIsDictating(false);

    recognition.start();
  };

  return (
    <SensoryContext.Provider
      value={{
        lowStimulation,
        toggleLowStimulation,
        readingEase,
        toggleReadingEase,
        activePalette,
        setPalette,
        fontSizePx,
        setFontSize,
        currentRoute,
        navigateTo,
        currentSessionId,
        activeScenario,
        messages,
        startScenario,
        sendMessage,
        restartExchange,
        resetPracticeSession,
        sessionHistory,
        isLoading,
        isDeescalateOpen,
        openDeescalate,
        closeDeescalate,
        isFocusGuideActive,
        toggleFocusGuide,
        isFidgetOpen,
        openFidget,
        closeFidget,
        currentAvatarExpression,
        setCurrentAvatarExpression,
        speakText,
        stopSpeech,
        isSpeakingTTS,
        startDictation,
        isDictating,
        dictationTranscript
      }}
    >
      {children}
    </SensoryContext.Provider>
  );
};

export const useSensory = () => {
  const context = useContext(SensoryContext);
  if (!context) {
    throw new Error('useSensory must be used within a SensoryProvider');
  }
  return context;
};
