import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * RunningChildBuddy Component
 * Interactive animated running child companion that runs back and forth across the screen.
 * Features:
 * - Animated running leg strides (left/right leg cycling)
 * - Arms bobbing & holding sprout plant pot
 * - Direction flipping (runs left & right)
 * - Laughing & giggling speech bubbles on click ("Hehe!", "Yay!", "Calm minds sprout!")
 * - Sparkle/leaf particle bursts on interaction
 * - Motion-gate compliant (stops gracefully when low-stimulation mode is enabled)
 */
export const RunningChildBuddy = () => {
  const { lowStimulation } = useSensory();

  // Motion state: X position percentage (5% to 85%), direction (1: right, -1: left), and Y path level
  const [posX, setPosX] = useState(15);
  const [direction, setDirection] = useState(1);
  const [posYLevel, setPosYLevel] = useState('bottom'); // 'bottom', 'mid', 'top'
  const [legFrame, setLegFrame] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [laughText, setLaughText] = useState('');
  const [sparkles, setSparkles] = useState([]);

  const LAUGHS = [
    "Hehe! 🌱",
    "Giggly sprout!",
    "Yay! Running all around!",
    "Exploring up & down!",
    "Let's practice together!",
    "Growth takes time! 🌸"
  ];

  const POS_Y_LEVELS = ['bottom', 'mid', 'top'];

  // Running loop (Moves position X, switches Y path on edge turn, alternates leg frames)
  useEffect(() => {
    if (lowStimulation) return;

    const runInterval = setInterval(() => {
      setPosX(prevX => {
        let newX = prevX + direction * 0.4;
        if (newX > 86) {
          setDirection(-1);
          // Pick a new random Y path height when turning around
          const nextLevel = POS_Y_LEVELS[Math.floor(Math.random() * POS_Y_LEVELS.length)];
          setPosYLevel(nextLevel);
          newX = 86;
        } else if (newX < 6) {
          setDirection(1);
          const nextLevel = POS_Y_LEVELS[Math.floor(Math.random() * POS_Y_LEVELS.length)];
          setPosYLevel(nextLevel);
          newX = 6;
        }
        return newX;
      });

      setLegFrame(prev => (prev + 1) % 4);
    }, 50);

    return () => clearInterval(runInterval);
  }, [direction, lowStimulation]);

  // Click interaction: Jump, laugh speech bubble, & burst leaf sparkles
  const handleClick = (e) => {
    setIsJumping(true);
    const randomLaugh = LAUGHS[Math.floor(Math.random() * LAUGHS.length)];
    setLaughText(randomLaugh);

    // Create particle sparkles
    const newSparkles = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 40,
      y: -Math.random() * 30 - 10,
      icon: i % 2 === 0 ? '🌱' : '✨'
    }));
    setSparkles(newSparkles);

    setTimeout(() => setIsJumping(false), 500);
    setTimeout(() => setLaughText(''), 2500);
    setTimeout(() => setSparkles([]), 800);
  };

  if (lowStimulation) {
    return null; // Respect low stimulation mode
  }

  // Leg angles for 4-frame running stride cycle
  const getLegAngles = () => {
    switch (legFrame) {
      case 0: return { left: -25, right: 25, bob: -4 };
      case 1: return { left: 0, right: 0, bob: 0 };
      case 2: return { left: 25, right: -25, bob: -4 };
      case 3: return { left: 0, right: 0, bob: 0 };
      default: return { left: 0, right: 0, bob: 0 };
    }
  };

  // Compute Y position styling based on current path elevation
  const getYPosStyle = () => {
    switch (posYLevel) {
      case 'top': return { top: '120px', bottom: 'auto' };
      case 'mid': return { top: '50%', bottom: 'auto' };
      case 'bottom':
      default: return { bottom: '24px', top: 'auto' };
    }
  };

  const { left: leftLegAngle, right: rightLegAngle, bob } = getLegAngles();

  return (
    <div
      className="fixed z-40 transition-all duration-300 pointer-events-auto cursor-pointer"
      style={{
        left: `${posX}%`,
        ...getYPosStyle(),
        transform: `translateY(${isJumping ? -35 : bob}px)`
      }}
      onClick={handleClick}
      title="Click the running child companion to giggle & jump!"
    >
      {/* Laughing Speech Bubble */}
      {laughText && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/95 text-[#5C5B99] px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-[#DDD6FE] whitespace-nowrap animate-bounce z-50">
          {laughText}
        </div>
      )}

      {/* Leaf & Sparkle Particles Burst */}
      {sparkles.map(sp => (
        <span
          key={sp.id}
          className="absolute text-sm pointer-events-none animate-ping"
          style={{
            transform: `translate(${sp.x}px, ${sp.y}px)`
          }}
        >
          {sp.icon}
        </span>
      ))}

      {/* SVG Vector Animated Child Character */}
      <div
        className="w-24 h-32 relative transition-transform duration-100"
        style={{
          transform: `scaleX(${direction})`
        }}
      >
        <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-lg">
          <defs>
            <filter id="childShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Ground Shadow */}
          <ellipse cx="50" cy="122" rx="22" ry="4" fill="#000000" opacity="0.15" />

          {/* Left Leg (Animated stride angle) */}
          <g transform={`rotate(${leftLegAngle}, 42, 90)`}>
            <rect x="37" y="90" width="10" height="24" rx="5" fill="#4B7093" />
            {/* Shoe */}
            <ellipse cx="40" cy="114" rx="7" ry="4" fill="#FFFFFF" />
          </g>

          {/* Right Leg (Animated stride angle) */}
          <g transform={`rotate(${rightLegAngle}, 58, 90)`}>
            <rect x="53" y="90" width="10" height="24" rx="5" fill="#4B7093" />
            {/* Shoe */}
            <ellipse cx="58" cy="114" rx="7" ry="4" fill="#FFFFFF" />
          </g>

          {/* Cozy Yellow/Cream Sweater Body */}
          <rect x="30" y="55" width="40" height="38" rx="10" fill="#E6C687" stroke="#D1B06F" strokeWidth="1.5" />
          {/* Collar */}
          <path d="M 40 55 Q 50 63 60 55" fill="#FFF9ED" stroke="#E6C687" strokeWidth="1.5" />

          {/* Arms holding terracotta plant pot */}
          <path d="M 28 65 Q 40 75 48 70" stroke="#E6C687" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 72 65 Q 60 75 52 70" stroke="#E6C687" strokeWidth="8" fill="none" strokeLinecap="round" />

          {/* Terracotta Plant Pot */}
          <path d="M 42 66 L 58 66 L 55 78 L 45 78 Z" fill="#C86D51" />
          {/* Sprout Leaves in Pot */}
          <path d="M 50 66 Q 44 58 46 54 Q 52 58 50 66" fill="#78B955" />
          <path d="M 50 66 Q 56 58 54 54 Q 48 58 50 66" fill="#5F9E3D" />

          {/* Head & Face */}
          <circle cx="50" cy="38" r="22" fill="#FCE5D0" />

          {/* Fluffy Brown Hair */}
          <path d="M 28 36 C 26 20, 42 16, 50 18 C 58 16, 74 20, 72 36 C 68 25, 32 25, 28 36 Z" fill="#6D4C41" />
          {/* Hair Tufts */}
          <circle cx="34" cy="24" r="6" fill="#6D4C41" />
          <circle cx="50" cy="18" r="7" fill="#6D4C41" />
          <circle cx="66" cy="24" r="6" fill="#6D4C41" />

          {/* Sprout Leaves Growing on Head (Signatures!) */}
          <path d="M 44 16 Q 38 6 42 2 Q 48 8 44 16" fill="#78B955" />
          <path d="M 56 16 Q 62 6 58 2 Q 52 8 56 16" fill="#5F9E3D" />

          {/* Laughing Happy Eye Arcs */}
          {laughText ? (
            <>
              <path d="M 38 36 Q 43 30 46 36" stroke="#4A2E2B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 54 36 Q 57 30 62 36" stroke="#4A2E2B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 38 36 Q 42 32 46 36" stroke="#4A2E2B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 54 36 Q 58 32 62 36" stroke="#4A2E2B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Rosy Cheeks */}
          <circle cx="35" cy="42" r="4" fill="#FF8A80" opacity="0.5" />
          <circle cx="65" cy="42" r="4" fill="#FF8A80" opacity="0.5" />

          {/* Big Open Laughing Mouth */}
          <path d="M 43 42 Q 50 50 57 42 Z" fill="#4A2E2B" />
          <path d="M 46 45 Q 50 49 54 45" fill="#E57373" />
        </svg>
      </div>
    </div>
  );
};
