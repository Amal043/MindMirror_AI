import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * 15 Ultra-Cute Doraemon/Chibi Style Round Cartoon Mascot Expressions
 */
const SPROUT_EXPRESSIONS = [
  {
    id: 1,
    title: 'Happy Cheerful Sprout',
    icon: '😊',
    bg: '#E8F8F5',
    eyeType: 'sparkle',
    mouthType: 'bigSmile',
    prop: '🌱'
  },
  {
    id: 2,
    title: 'Giggling Winking Sprout',
    icon: '😜',
    bg: '#FDF2F8',
    eyeType: 'wink',
    mouthType: 'tongue',
    prop: '✨'
  },
  {
    id: 3,
    title: 'Angel Sleepy Sprout',
    icon: '😴',
    bg: '#EEF2FF',
    eyeType: 'sleepy',
    mouthType: 'smallSmile',
    prop: '🌙'
  },
  {
    id: 4,
    title: 'Heart Eyes Loving Sprout',
    icon: '😍',
    bg: '#FFF1F2',
    eyeType: 'hearts',
    mouthType: 'bigSmile',
    prop: '💖'
  },
  {
    id: 5,
    title: 'Sparkle Star Sprout',
    icon: '🤩',
    bg: '#FEFCE8',
    eyeType: 'stars',
    mouthType: 'openJoy',
    prop: '🌟'
  },
  {
    id: 6,
    title: 'Curious Cat Mouth Sprout',
    icon: '😸',
    bg: '#F0FDF4',
    eyeType: 'round',
    mouthType: 'cat3',
    prop: '🍃'
  },
  {
    id: 7,
    title: 'Cool Sunglasses Sprout',
    icon: '😎',
    bg: '#F0F9FF',
    eyeType: 'sunglasses',
    mouthType: 'smirk',
    prop: '🕶️'
  },
  {
    id: 8,
    title: 'Cherry Blossom Sprout',
    icon: '🌸',
    bg: '#FDF2F8',
    eyeType: 'blushing',
    mouthType: 'bigSmile',
    prop: '🌸'
  },
  {
    id: 9,
    title: 'Yummy Foodie Sprout',
    icon: '😋',
    bg: '#FFFBEB',
    eyeType: 'happyArc',
    mouthType: 'tongueSide',
    prop: '🍓'
  },
  {
    id: 10,
    title: 'Zen Meditation Sprout',
    icon: '🧘',
    bg: '#ECFDF5',
    eyeType: 'peaceful',
    mouthType: 'calmLine',
    prop: '🧘'
  },
  {
    id: 11,
    title: 'Gamer Headphones Sprout',
    icon: '🎧',
    bg: '#F5F3FF',
    eyeType: 'sparkle',
    mouthType: 'openJoy',
    prop: '🎧'
  },
  {
    id: 12,
    title: 'Surprised Wow Sprout',
    icon: '😮',
    bg: '#EFF6FF',
    eyeType: 'bigRound',
    mouthType: 'smallO',
    prop: '❗'
  },
  {
    id: 13,
    title: 'Rainbow Sparkle Sprout',
    icon: '🌈',
    bg: '#EEF2FF',
    eyeType: 'sparkle',
    mouthType: 'bigSmile',
    prop: '🌈'
  },
  {
    id: 14,
    title: 'Rainy Leaf Umbrella Sprout',
    icon: '☔',
    bg: '#F0F9FF',
    eyeType: 'happyArc',
    mouthType: 'bigSmile',
    prop: '☔'
  },
  {
    id: 15,
    title: 'Chef Cookie Sprout',
    icon: '🧁',
    bg: '#FFF1F2',
    eyeType: 'winkingStar',
    mouthType: 'tongue',
    prop: '🍪'
  }
];

/**
 * SproutBuddySlideshow Component
 * 100% Automatic Cross-Fading Carousel of 15 Ultra-Cute Doraemon/Chibi Round Cartoon Mascot Expressions.
 */
export const SproutBuddySlideshow = () => {
  const { lowStimulation } = useSensory();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 100% Automatic slideshow loop (2.8 seconds)
  useEffect(() => {
    if (lowStimulation) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % SPROUT_EXPRESSIONS.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [lowStimulation]);

  const current = SPROUT_EXPRESSIONS[currentIndex];

  return (
    <div
      className="flex flex-col items-center justify-center p-4 bg-white/90 border border-[#E5E0D3] rounded-3xl shadow-sm backdrop-blur-sm relative w-64 sm:w-72 transition-all duration-300 overflow-hidden"
    >
      {/* Top Expression Counter Badge */}
      <div className="w-full flex items-center justify-between text-[11px] font-bold text-[#5C5B99] px-2 mb-1">
        <span>🌱 Sprout Mascot</span>
        <span className="bg-[#E8DFF5] px-2 py-0.5 rounded-full border border-[#DDD6FE]">
          {currentIndex + 1} / 15
        </span>
      </div>

      {/* Main Chibi Round Cartoon Mascot Face Frame */}
      <div
        key={current.id}
        className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl flex items-center justify-center relative p-3 animate-fadeIn transition-colors duration-500 shadow-inner border border-black/5"
        style={{ backgroundColor: current.bg }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          <defs>
            <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Cute Round Doraemon/Chibi Mascot Face Base */}
          <circle cx="60" cy="62" r="44" fill="#A5EBE0" stroke="#71C9B6" strokeWidth="3" filter="url(#softGlow)" />
          {/* Inner Cream Face Belly Patch */}
          <ellipse cx="60" cy="66" rx="36" ry="32" fill="#FFFBF5" />

          {/* Sprout Hair Leaves on Top */}
          <path d="M 52 18 Q 44 4 50 0 Q 58 6 52 18" fill="#78B955" stroke="#5F9E3D" strokeWidth="1.5" />
          <path d="M 68 18 Q 76 4 70 0 Q 62 6 68 18" fill="#5F9E3D" stroke="#48782D" strokeWidth="1.5" />

          {/* Rosy Pink Blush Cheeks */}
          <ellipse cx="36" cy="68" rx="7" ry="4" fill="#FF8A80" opacity="0.6" />
          <ellipse cx="84" cy="68" rx="7" ry="4" fill="#FF8A80" opacity="0.6" />

          {/* EYES RENDERING (15 Unique Doraemon/Chibi Expression Types) */}
          {current.eyeType === 'sparkle' && (
            <>
              <circle cx="44" cy="58" r="5.5" fill="#1F2937" />
              <circle cx="46" cy="56" r="2" fill="#FFFFFF" />
              <circle cx="76" cy="58" r="5.5" fill="#1F2937" />
              <circle cx="78" cy="56" r="2" fill="#FFFFFF" />
            </>
          )}

          {current.eyeType === 'wink' && (
            <>
              <path d="M 38 58 Q 44 52 50 58" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="76" cy="58" r="5.5" fill="#1F2937" />
              <circle cx="78" cy="56" r="2" fill="#FFFFFF" />
            </>
          )}

          {current.eyeType === 'sleepy' && (
            <>
              <path d="M 38 58 Q 44 64 50 58" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 70 58 Q 76 64 82 58" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="90" y="45" fontSize="12" fill="#5C5B99" fontWeight="bold">Zzz</text>
            </>
          )}

          {current.eyeType === 'hearts' && (
            <>
              <text x="36" y="62" fontSize="16">💖</text>
              <text x="68" y="62" fontSize="16">💖</text>
            </>
          )}

          {current.eyeType === 'stars' && (
            <>
              <text x="36" y="62" fontSize="16">🌟</text>
              <text x="68" y="62" fontSize="16">🌟</text>
            </>
          )}

          {current.eyeType === 'round' && (
            <>
              <circle cx="44" cy="58" r="6" fill="#1F2937" />
              <circle cx="46" cy="56" r="2.5" fill="#FFFFFF" />
              <circle cx="76" cy="58" r="6" fill="#1F2937" />
              <circle cx="78" cy="56" r="2.5" fill="#FFFFFF" />
            </>
          )}

          {current.eyeType === 'sunglasses' && (
            <>
              <rect x="34" y="52" width="52" height="14" rx="4" fill="#1F2937" />
              <line x1="36" y1="54" x2="48" y2="64" stroke="#6B7280" strokeWidth="1.5" />
              <line x1="70" y1="54" x2="82" y2="64" stroke="#6B7280" strokeWidth="1.5" />
            </>
          )}

          {current.eyeType === 'blushing' && (
            <>
              <path d="M 38 56 Q 44 51 50 56" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 70 56 Q 76 51 82 56" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {current.eyeType === 'happyArc' && (
            <>
              <path d="M 38 58 Q 44 50 50 58" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 70 58 Q 76 50 82 58" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {current.eyeType === 'peaceful' && (
            <>
              <path d="M 38 58 Q 44 62 50 58" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 70 58 Q 76 62 82 58" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {current.eyeType === 'bigRound' && (
            <>
              <circle cx="44" cy="56" r="7" fill="#1F2937" />
              <circle cx="46" cy="54" r="3" fill="#FFFFFF" />
              <circle cx="76" cy="56" r="7" fill="#1F2937" />
              <circle cx="78" cy="54" r="3" fill="#FFFFFF" />
            </>
          )}

          {current.eyeType === 'winkingStar' && (
            <>
              <text x="36" y="62" fontSize="14">⭐</text>
              <circle cx="76" cy="58" r="5.5" fill="#1F2937" />
              <circle cx="78" cy="56" r="2" fill="#FFFFFF" />
            </>
          )}

          {/* MOUTH RENDERING */}
          {current.mouthType === 'bigSmile' && (
            <path d="M 48 68 Q 60 82 72 68 Z" fill="#E57373" stroke="#1F2937" strokeWidth="2" />
          )}

          {current.mouthType === 'tongue' && (
            <g>
              <path d="M 48 68 Q 60 82 72 68 Z" fill="#1F2937" />
              <path d="M 52 74 Q 60 82 68 74" fill="#FF8A80" />
            </g>
          )}

          {current.mouthType === 'openJoy' && (
            <path d="M 48 66 Q 60 84 72 66 Z" fill="#1F2937" />
          )}

          {current.mouthType === 'cat3' && (
            <path d="M 48 68 Q 54 74 60 68 Q 66 74 72 68" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}

          {current.mouthType === 'smirk' && (
            <path d="M 54 70 Q 66 74 72 66" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}

          {current.mouthType === 'smallO' && (
            <ellipse cx="60" cy="72" rx="5" ry="6" fill="#1F2937" />
          )}

          {current.mouthType === 'smallSmile' && (
            <path d="M 50 70 Q 60 76 70 70" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}

          {current.mouthType === 'tongueSide' && (
            <g>
              <path d="M 50 68 Q 60 78 70 68" stroke="#1F2937" strokeWidth="2.5" fill="none" />
              <circle cx="64" cy="74" r="3" fill="#FF8A80" />
            </g>
          )}

          {current.mouthType === 'calmLine' && (
            <path d="M 52 70 Q 60 74 68 70" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}

          {/* Special Prop Accents */}
          {current.prop && (
            <text x="60" y="104" textAnchor="middle" fontSize="18">
              {current.prop}
            </text>
          )}
        </svg>
      </div>

      {/* Floating Theme Title Badge */}
      <span className="mt-2 text-[11px] font-bold text-[#5C5B99] px-3.5 py-1 bg-[#E8DFF5] rounded-full border border-[#DDD6FE] flex items-center gap-1.5 shadow-sm">
        <span>{current.icon}</span>
        <span>{current.title}</span>
      </span>
    </div>
  );
};
