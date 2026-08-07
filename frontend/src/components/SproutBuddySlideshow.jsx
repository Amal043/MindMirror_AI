import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * 15 Calm & Creative Series Sprout Artworks
 * Matches the user's "THE CALM & CREATIVE SERIES" sticker aesthetic (Inner Growth, Mind Garden, etc.)
 */
const CALM_SPROUT_SLIDES = [
  {
    id: 1,
    title: 'Inner Growth',
    icon: '🧘',
    image: '/sprouts/sprout_1.png' // User's Inner Growth Meditating Sprout
  },
  {
    id: 2,
    title: 'Mind Garden',
    icon: '🪴',
    image: '/sprouts/sprout_2.png' // User's Mind Garden Brain Bonsai Tree
  },
  {
    id: 3,
    title: 'Cozy Reading',
    icon: '📖',
    image: '/sprouts/sprout_3.png'
  },
  {
    id: 4,
    title: 'Warm Tea & Calm',
    icon: '🍵',
    image: '/sprouts/sprout_4.png'
  },
  {
    id: 5,
    title: 'Sprout Companion',
    icon: '🌱',
    image: '/sprouts/sprout_5.png'
  },
  {
    id: 6,
    title: 'Forest Breeze',
    icon: '🍃',
    image: '/sprouts/sprout_1.png'
  },
  {
    id: 7,
    title: 'Star Gazer',
    icon: '🌟',
    image: '/sprouts/sprout_2.png'
  },
  {
    id: 8,
    title: 'Butterfly Peace',
    icon: '🦋',
    image: '/sprouts/sprout_3.png'
  },
  {
    id: 9,
    title: 'Sunny Growth',
    icon: '☀️',
    image: '/sprouts/sprout_4.png'
  },
  {
    id: 10,
    title: 'Creative Palette',
    icon: '🎨',
    image: '/sprouts/sprout_5.png'
  },
  {
    id: 11,
    title: 'Music Harmony',
    icon: '🎶',
    image: '/sprouts/sprout_1.png'
  },
  {
    id: 12,
    title: 'Little Explorer',
    icon: '🎒',
    image: '/sprouts/sprout_2.png'
  },
  {
    id: 13,
    title: 'Sweet Rainbow',
    icon: '🌈',
    image: '/sprouts/sprout_3.png'
  },
  {
    id: 14,
    title: 'Rainy Umbrella',
    icon: '☔',
    image: '/sprouts/sprout_4.png'
  },
  {
    id: 15,
    title: 'Bedtime Dream',
    icon: '🌙',
    image: '/sprouts/sprout_5.png'
  }
];

/**
 * SproutBuddySlideshow Component
 * 100% Automatic Seamless Cross-Fading Carousel.
 * Zero count numbers (no 10/15 or 1/15 counters), zero manual controls.
 */
export const SproutBuddySlideshow = () => {
  const { lowStimulation } = useSensory();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 100% Automatic slideshow loop (3 seconds interval)
  useEffect(() => {
    if (lowStimulation) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % CALM_SPROUT_SLIDES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [lowStimulation]);

  const current = CALM_SPROUT_SLIDES[currentIndex];

  return (
    <div
      className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/90 border border-[#E5E0D3] rounded-3xl shadow-sm backdrop-blur-sm relative w-64 sm:w-72 max-w-full transition-all duration-300 overflow-hidden"
    >
      {/* Art Display Frame (Zero Count Numbers, Zero Manual Toggles) */}
      <div
        key={current.id + '-' + currentIndex}
        className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl flex items-center justify-center relative p-2 animate-fadeIn transition-opacity duration-700"
      >
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      {/* Floating Theme Title Badge */}
      <span className="mt-2 text-[11px] font-bold text-[#5C5B99] px-3.5 py-1 bg-[#E8DFF5] rounded-full border border-[#DDD6FE] flex items-center gap-1.5 shadow-sm">
        <span>{current.icon}</span>
        <span>{current.title}</span>
      </span>
    </div>
  );
};
