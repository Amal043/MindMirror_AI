import React, { useState, useEffect } from 'react';

/**
 * MindMirrorAvatar Component (Akinator-Style Dynamic Companion)
 * Interactive vector SVG companion inside a glowing circular portal frame.
 * Expression states:
 * - 'thinking': Eyes looking up, glowing pulsing aura, thoughtful tilt.
 * - 'speaking': Mouth animatedly talking, eye contact, expressive aura.
 * - 'empathetic': Soft warm smile, gentle eyebrows, compassionate posture.
 * - 'reassuring': Warm nod, friendly smile.
 * - 'thoughtful': Pensive posture.
 * - 'calm' / 'neutral': Soft breathing, gentle eye blinks.
 */
export const MindMirrorAvatar = ({
  expression = 'neutral',
  isThinking = false,
  isSpeaking = false,
  speechText = '',
  size = 'md',
  showBubble = true
}) => {
  const [blink, setBlink] = useState(false);
  const [mouthFrame, setMouthFrame] = useState(0);

  // Determine current active expression state
  const activeState = isThinking
    ? 'thinking'
    : isSpeaking
      ? 'speaking'
      : expression || 'neutral';

  // Eye blinking loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Speaking mouth frame animation
  useEffect(() => {
    if (activeState !== 'speaking') {
      setMouthFrame(0);
      return;
    }
    const interval = setInterval(() => {
      setMouthFrame(prev => (prev + 1) % 4);
    }, 140);
    return () => clearInterval(interval);
  }, [activeState]);

  // Size dimensions
  const containerSize = size === 'lg' ? 'w-36 h-36' : size === 'sm' ? 'w-16 h-16' : 'w-24 h-24';
  const svgSize = size === 'lg' ? 144 : size === 'sm' ? 64 : 96;

  // Expression color glows
  const getGlowColor = () => {
    switch (activeState) {
      case 'thinking':
        return 'from-purple-500/30 via-indigo-500/20 to-teal-500/30 animate-pulse';
      case 'speaking':
        return 'from-indigo-500/30 via-teal-400/30 to-emerald-500/30 shadow-indigo-500/30';
      case 'empathetic':
      case 'reassuring':
        return 'from-emerald-400/30 via-teal-400/20 to-indigo-400/30';
      case 'calm':
      default:
        return 'from-accent/20 via-indigo-500/10 to-teal-500/20';
    }
  };

  // Expression status label
  const getStatusText = () => {
    switch (activeState) {
      case 'thinking':
        return '🤔 Thinking & Parsing Subtext...';
      case 'speaking':
        return '💬 Speaking...';
      case 'empathetic':
        return '💜 Understanding your perspective...';
      case 'reassuring':
        return '🌱 Reassuring...';
      case 'thoughtful':
        return '💭 Processing context...';
      case 'calm':
      default:
        return '🌸 Calm & Ready';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Speech Bubble (Optional) */}
      {showBubble && speechText && (
        <div className="mb-3 max-w-sm p-3 bg-bg-card border border-accent/40 rounded-2xl shadow-lg text-xs text-text-primary relative animate-fadeIn">
          <div className="flex items-center space-x-1.5 mb-1 font-bold text-text-accent text-[10px] uppercase tracking-wider">
            <span>{activeState === 'thinking' ? '🔮' : '💬'}</span>
            <span>MindMirror Companion</span>
          </div>
          <p className="leading-relaxed italic">"{speechText}"</p>

          {/* Speech Bubble Pointer */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-bg-card" />
        </div>
      )}

      {/* Main Avatar Circular Frame */}
      <div className={`relative rounded-full p-1 bg-gradient-to-tr ${getGlowColor()} transition-all duration-300`}>
        
        {/* Outer Pulsing Halo Ring */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-accent via-indigo-400 to-teal-400 opacity-40 blur-md ${
          activeState === 'thinking' ? 'animate-ping' : ''
        }`} />

        {/* Circular SVG Avatar Container (Reference Image Glowing Cyan Circle) */}
        <div className={`${containerSize} relative rounded-full bg-gradient-to-br from-[#A5EBE0] to-[#6EC5B4] border-4 border-[#C7F4EC] overflow-hidden flex items-center justify-center shadow-lg shadow-teal-500/20`}>
          <svg
            width={svgSize}
            height={svgSize}
            viewBox="0 0 100 100"
            className="w-full h-full transform transition-transform duration-300"
          >
            <defs>
              <linearGradient id="avatarSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A5EBE0" />
                <stop offset="100%" stopColor="#5DBBA9" />
              </linearGradient>
              <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f0fdf4" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Soft Aura Pattern */}
            <circle cx="50" cy="50" r="48" fill="url(#avatarSkin)" opacity="0.4" />

            {/* Eyebrows (Dynamic Angles based on Expression) */}
            {activeState === 'thinking' ? (
              <>
                <path d="M 33 35 Q 40 30 47 35" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 53 35 Q 60 30 67 35" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            ) : activeState === 'empathetic' || activeState === 'reassuring' ? (
              <>
                <path d="M 33 37 Q 40 32 47 37" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 53 37 Q 60 32 67 37" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M 33 36 Q 40 33 47 36" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 53 36 Q 60 33 67 36" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}

            {/* Eyes (Large Warm Pupils - Reference Image Matching) */}
            {blink ? (
              <>
                <line x1="33" y1="48" x2="47" y2="48" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="53" y1="48" x2="67" y2="48" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : activeState === 'thinking' ? (
              /* Eyes looking up thinking */
              <>
                <circle cx="40" cy="46" r="6.5" fill="url(#eyeGlow)" stroke="#1F2937" strokeWidth="1" />
                <circle cx="41" cy="43" r="3.2" fill="#1F2937" />
                <circle cx="60" cy="46" r="6.5" fill="url(#eyeGlow)" stroke="#1F2937" strokeWidth="1" />
                <circle cx="61" cy="43" r="3.2" fill="#1F2937" />
              </>
            ) : (
              /* Standard Eyes with Eye Contact */
              <>
                <circle cx="40" cy="48" r="7" fill="url(#eyeGlow)" />
                <circle cx="40" cy="48" r="3.8" fill="#1F2937" />
                <circle cx="42" cy="46" r="1.5" fill="#ffffff" />

                <circle cx="60" cy="48" r="7" fill="url(#eyeGlow)" />
                <circle cx="60" cy="48" r="3.8" fill="#1F2937" />
                <circle cx="62" cy="46" r="1.5" fill="#ffffff" />
              </>
            )}

            {/* Cheek Soft Rose Flush */}
            <circle cx="28" cy="56" r="4.5" fill="#f43f5e" opacity="0.25" filter="url(#softGlow)" />
            <circle cx="72" cy="56" r="4.5" fill="#f43f5e" opacity="0.25" filter="url(#softGlow)" />

            {/* Mouth (Friendly Curved Smile matching Reference Image) */}
            {activeState === 'speaking' ? (
              mouthFrame === 0 ? (
                <ellipse cx="50" cy="65" rx="5" ry="4" fill="#1F2937" />
              ) : mouthFrame === 1 ? (
                <path d="M 42 63 Q 50 71 58 63 Z" fill="#1F2937" />
              ) : mouthFrame === 2 ? (
                <ellipse cx="50" cy="65" rx="7" ry="3" fill="#1F2937" />
              ) : (
                <path d="M 41 63 Q 50 72 59 63" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
              )
            ) : activeState === 'thinking' ? (
              <path d="M 44 65 Q 50 62 56 65" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M 40 62 Q 50 73 60 62" stroke="#1F2937" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            )}
          </svg>
        </div>
      </div>

      {/* Expression Status Pill */}
      <span className="mt-2 text-[10px] font-semibold text-text-accent px-2.5 py-0.5 bg-accent-soft border border-accent/20 rounded-full shadow-sm">
        {getStatusText()}
      </span>
    </div>
  );
};
