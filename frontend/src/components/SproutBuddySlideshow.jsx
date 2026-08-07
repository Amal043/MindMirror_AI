import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * 15 Cute Sprout Buddy Artworks & Themes Data
 */
const SPROUT_SLIDES = [
  {
    id: 1,
    title: 'Cozy Sprout',
    icon: '🌱',
    color: '#91D4C3',
    bg: '#EEF7F2',
    image: '/cute_sprout_buddy.png', // Main generated image
    svgContent: null
  },
  {
    id: 2,
    title: 'Cherry Blossom Sprout',
    icon: '🌸',
    color: '#F9A8D4',
    bg: '#FDF2F8',
    image: null,
    svgTheme: 'flower'
  },
  {
    id: 3,
    title: 'Cozy Reading Sprout',
    icon: '📖',
    color: '#A7F3D0',
    bg: '#ECFDF5',
    image: null,
    svgTheme: 'reading'
  },
  {
    id: 4,
    title: 'Tea Time Sprout',
    icon: '🍵',
    color: '#FDE68A',
    bg: '#FFFBEB',
    image: null,
    svgTheme: 'tea'
  },
  {
    id: 5,
    title: 'Zen Meditation Sprout',
    icon: '🧘',
    color: '#BAE6FD',
    bg: '#F0F9FF',
    image: null,
    svgTheme: 'zen'
  },
  {
    id: 6,
    title: 'Rainy Day Sprout',
    icon: '☔',
    color: '#93C5FD',
    bg: '#EFF6FF',
    image: null,
    svgTheme: 'rain'
  },
  {
    id: 7,
    title: 'Star Gazer Sprout',
    icon: '🌟',
    color: '#DDD6FE',
    bg: '#F5F3FF',
    image: null,
    svgTheme: 'star'
  },
  {
    id: 8,
    title: 'Butterfly Friend Sprout',
    icon: '🦋',
    color: '#FBCFE8',
    bg: '#FDF2F8',
    image: null,
    svgTheme: 'butterfly'
  },
  {
    id: 9,
    title: 'Sunny Day Sprout',
    icon: '☀️',
    color: '#FDE047',
    bg: '#FEFCE8',
    image: null,
    svgTheme: 'sun'
  },
  {
    id: 10,
    title: 'Music Lover Sprout',
    icon: '🎶',
    color: '#C4B5FD',
    bg: '#F5F3FF',
    image: null,
    svgTheme: 'music'
  },
  {
    id: 11,
    title: 'Artist Sprout',
    icon: '🎨',
    color: '#FCA5A5',
    bg: '#FEF2F2',
    image: null,
    svgTheme: 'artist'
  },
  {
    id: 12,
    title: 'Little Explorer Sprout',
    icon: '🎒',
    color: '#86EFAC',
    bg: '#F0FDF4',
    image: null,
    svgTheme: 'explorer'
  },
  {
    id: 13,
    title: 'Sweet Cupcake Sprout',
    icon: '🧁',
    color: '#F472B6',
    bg: '#FDF2F8',
    image: null,
    svgTheme: 'cupcake'
  },
  {
    id: 14,
    title: 'Rainbow Dreams Sprout',
    icon: '🌈',
    color: '#A5B4FC',
    bg: '#EEF2FF',
    image: null,
    svgTheme: 'rainbow'
  },
  {
    id: 15,
    title: 'Bedtime Sleepy Sprout',
    icon: '🌙',
    color: '#818CF8',
    bg: '#EEF2FF',
    image: null,
    svgTheme: 'sleep'
  }
];

/**
 * SproutBuddySlideshow Component
 * Smooth 15-picture cross-fading slideshow carousel of cute soothing sprout artworks.
 */
export const SproutBuddySlideshow = () => {
  const { lowStimulation } = useSensory();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slideshow transition timer (3 seconds)
  useEffect(() => {
    if (lowStimulation || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % SPROUT_SLIDES.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [lowStimulation, isPaused]);

  const currentSlide = SPROUT_SLIDES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? SPROUT_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % SPROUT_SLIDES.length);
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-4 bg-white/80 border border-[#E5E0D3] rounded-3xl shadow-sm backdrop-blur-sm relative group w-64 sm:w-72 transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Index Badge Counter */}
      <div className="absolute top-3 left-3 text-[10px] font-bold text-[#5C5B99] bg-[#E8DFF5] px-2.5 py-0.5 rounded-full border border-[#DDD6FE]">
        {currentIndex + 1} / {SPROUT_SLIDES.length}
      </div>

      {/* Manual Slide Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 text-[#1F2937] font-bold text-xs shadow-md border border-[#E5E0D3] hover:bg-[#EAE5D8] cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center"
        title="Previous Sprout Picture"
      >
        ‹
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 text-[#1F2937] font-bold text-xs shadow-md border border-[#E5E0D3] hover:bg-[#EAE5D8] cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center"
        title="Next Sprout Picture"
      >
        ›
      </button>

      {/* Main Image / Art Display Frame */}
      <div className="w-44 h-44 sm:w-52 sm:h-52 relative flex items-center justify-center my-2 overflow-hidden rounded-2xl">
        {currentSlide.image ? (
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-md animate-fadeIn"
            key={currentSlide.id}
          />
        ) : (
          /* Procedural Cute Chibi Vector Art for Slides 2-15 */
          <div
            key={currentSlide.id}
            className="w-full h-full rounded-2xl flex flex-col items-center justify-center relative p-3 animate-fadeIn transition-colors duration-300"
            style={{ backgroundColor: currentSlide.bg }}
          >
            <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-md">
              {/* Sprout Head Base */}
              <circle cx="50" cy="48" r="26" fill="#FCE5D0" />

              {/* Green Sprout Hair */}
              <circle cx="50" cy="38" r="24" fill="#A5EBE0" />
              <path d="M 28 44 C 26 25, 42 22, 50 24 C 58 22, 74 25, 72 44 Z" fill="#71C9B6" />

              {/* Sprout Leaves on Head */}
              <path d="M 44 20 Q 38 8 42 4 Q 48 12 44 20" fill="#78B955" />
              <path d="M 56 20 Q 62 8 58 4 Q 52 12 56 20" fill="#5F9E3D" />

              {/* Eyes & Expressions */}
              <circle cx="41" cy="46" r="3" fill="#1F2937" />
              <circle cx="42" cy="44.5" r="1" fill="#FFFFFF" />
              <circle cx="59" cy="46" r="3" fill="#1F2937" />
              <circle cx="60" cy="44.5" r="1" fill="#FFFFFF" />

              {/* Rosy Cheeks */}
              <circle cx="35" cy="50" r="3.5" fill="#FF8A80" opacity="0.5" />
              <circle cx="65" cy="50" r="3.5" fill="#FF8A80" opacity="0.5" />

              {/* Cute Smile */}
              <path d="M 43 51 Q 50 57 57 51" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Sweater Body */}
              <rect x="34" y="66" width="32" height="28" rx="8" fill="#E8DFF5" stroke="#DDD6FE" strokeWidth="1" />

              {/* Theme Props */}
              {currentSlide.svgTheme === 'flower' && (
                <text x="50" y="20" textAnchor="middle" fontSize="16">🌸</text>
              )}
              {currentSlide.svgTheme === 'reading' && (
                <rect x="42" y="70" width="16" height="12" rx="2" fill="#3B82F6" />
              )}
              {currentSlide.svgTheme === 'tea' && (
                <text x="50" y="76" textAnchor="middle" fontSize="12">🍵</text>
              )}
              {currentSlide.svgTheme === 'zen' && (
                <text x="50" y="20" textAnchor="middle" fontSize="12">🧘</text>
              )}
              {currentSlide.svgTheme === 'rain' && (
                <text x="50" y="16" textAnchor="middle" fontSize="16">☔</text>
              )}
              {currentSlide.svgTheme === 'star' && (
                <text x="50" y="16" textAnchor="middle" fontSize="14">🌟</text>
              )}
              {currentSlide.svgTheme === 'butterfly' && (
                <text x="50" y="16" textAnchor="middle" fontSize="14">🦋</text>
              )}
              {currentSlide.svgTheme === 'sun' && (
                <text x="50" y="16" textAnchor="middle" fontSize="14">☀️</text>
              )}
              {currentSlide.svgTheme === 'music' && (
                <text x="50" y="16" textAnchor="middle" fontSize="14">🎧</text>
              )}
              {currentSlide.svgTheme === 'artist' && (
                <text x="50" y="16" textAnchor="middle" fontSize="14">🎨</text>
              )}
              {currentSlide.svgTheme === 'explorer' && (
                <text x="50" y="16" textAnchor="middle" fontSize="14">🎒</text>
              )}
              {currentSlide.svgTheme === 'cupcake' && (
                <text x="50" y="76" textAnchor="middle" fontSize="12">🧁</text>
              )}
              {currentSlide.svgTheme === 'rainbow' && (
                <text x="50" y="16" textAnchor="middle" fontSize="14">🌈</text>
              )}
              {currentSlide.svgTheme === 'sleep' && (
                <text x="50" y="16" textAnchor="middle" fontSize="14">🌙</text>
              )}
            </svg>
          </div>
        )}
      </div>

      {/* Floating Theme Title Badge */}
      <span className="mt-1 text-[11px] font-bold text-[#5C5B99] px-3.5 py-1 bg-[#E8DFF5] rounded-full border border-[#DDD6FE] flex items-center gap-1.5 shadow-sm">
        <span>{currentSlide.icon}</span>
        <span>{currentSlide.title}</span>
      </span>

      {/* 15 Slide Indicator Dots */}
      <div className="flex items-center justify-center gap-1 mt-2.5">
        {SPROUT_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === idx
                ? 'w-4 bg-[#5C5B99]'
                : 'bg-[#CBD5E1] hover:bg-[#94A3B8]'
            }`}
            title={`Go to slide ${idx + 1}: ${slide.title}`}
          />
        ))}
      </div>
    </div>
  );
};
