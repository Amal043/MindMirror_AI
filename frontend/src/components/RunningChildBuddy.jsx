import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * RunningChildBuddy Component
 * Interactive animated running child companion that walks along the OUTER SIDES & EDGES of the screen.
 * Never runs over text or content cards!
 *
 * Perimeter Edge Tracks:
 * 0: BOTTOM (Left -> Right)
 * 1: RIGHT (Bottom -> Top)
 * 2: TOP (Right -> Left)
 * 3: LEFT (Top -> Bottom)
 */
export const RunningChildBuddy = () => {
  const { lowStimulation } = useSensory();

  // Track state: 0=BOTTOM, 1=RIGHT, 2=TOP, 3=LEFT
  const [trackIndex, setTrackIndex] = useState(0);
  // Progress along current track (percentage 5% to 92%)
  const [progress, setProgress] = useState(10);
  // Moving direction (+1 or -1)
  const [direction, setDirection] = useState(1);
  const [legFrame, setLegFrame] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [laughText, setLaughText] = useState('');
  const [sparkles, setSparkles] = useState([]);

  const LAUGHS = [
    "Hehe! Running on the sides! 🌱",
    "Giggly sprout!",
    "Walking all around the edges!",
    "Exploring top to bottom! 🌸",
    "Let's practice together!",
    "Staying on the sides! 🍃"
  ];

  // Motion loop: Runs along perimeter edges, turns corners smoothly, cycles legs
  useEffect(() => {
    if (lowStimulation) return;

    const runInterval = setInterval(() => {
      setProgress(prevProgress => {
        let newProg = prevProgress + direction * 0.45;

        // Check track boundary limits (Corners)
        if (direction > 0 && newProg >= 92) {
          // Reached corner end of current track -> Switch to next edge track clockwise!
          setTrackIndex(prevTrack => (prevTrack + 1) % 4);
          return trackIndex === 1 || trackIndex === 3 ? 12 : 8; // Reset progress for next track start
        } else if (direction < 0 && newProg <= 8) {
          // Reached start corner -> Switch counter-clockwise
          setTrackIndex(prevTrack => (prevTrack === 0 ? 3 : prevTrack - 1));
          return 90;
        }

        return newProg;
      });

      setLegFrame(prev => (prev + 1) % 4);
    }, 50);

    return () => clearInterval(runInterval);
  }, [trackIndex, direction, lowStimulation]);

  // Click interaction: Jump, laugh speech bubble, & burst leaf sparkles
  const handleClick = () => {
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
      case 0: return { left: -25, right: 25, bob: -3 };
      case 1: return { left: 0, right: 0, bob: 0 };
      case 2: return { left: 25, right: -25, bob: -3 };
      case 3: return { left: 0, right: 0, bob: 0 };
      default: return { left: 0, right: 0, bob: 0 };
    }
  };

  // Compute fixed perimeter edge positioning & rotation based on trackIndex
  const getTrackPosAndTransform = () => {
    // trackIndex: 0=BOTTOM, 1=RIGHT, 2=TOP, 3=LEFT
    switch (trackIndex) {
      case 0: // BOTTOM (Left -> Right)
        return {
          style: { left: `${progress}%`, bottom: '8px', top: 'auto', right: 'auto' },
          transform: `scaleX(${direction > 0 ? 1 : -1}) rotate(0deg) translateY(${isJumping ? -30 : bob}px)`
        };
      case 1: // RIGHT (Bottom -> Top)
        return {
          style: { right: '12px', top: `${100 - progress}%`, left: 'auto', bottom: 'auto' },
          transform: `rotate(-90deg) scaleX(${direction > 0 ? 1 : -1}) translateY(${isJumping ? -30 : bob}px)`
        };
      case 2: // TOP (Right -> Left)
        return {
          style: { left: `${100 - progress}%`, top: '70px', right: 'auto', bottom: 'auto' },
          transform: `scaleX(${direction > 0 ? -1 : 1}) rotate(0deg) translateY(${isJumping ? -30 : bob}px)`
        };
      case 3: // LEFT (Top -> Bottom)
        return {
          style: { left: '12px', top: `${progress}%`, right: 'auto', bottom: 'auto' },
          transform: `rotate(90deg) scaleX(${direction > 0 ? 1 : -1}) translateY(${isJumping ? -30 : bob}px)`
        };
      default:
        return {
          style: { left: `${progress}%`, bottom: '8px' },
          transform: `rotate(0deg)`
        };
    }
  };

  const { left: leftLegAngle, right: rightLegAngle, bob } = getLegAngles();
  const { style: trackStyle, transform: trackTransform } = getTrackPosAndTransform();

  return (
    <div
      className="fixed z-30 transition-all duration-300 pointer-events-auto cursor-pointer"
      style={{
        ...trackStyle,
        transform: trackTransform
      }}
      onClick={handleClick}
      title="Click the running child companion walking along the screen edges!"
    >
      {/* Laughing Speech Bubble */}
      {laughText && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/95 text-[#5C5B99] px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-[#DDD6FE] whitespace-nowrap animate-bounce z-50 pointer-events-none">
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
      <div className="w-20 h-28 relative">
        <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-md">
          {/* Ground Shadow */}
          <ellipse cx="50" cy="122" rx="20" ry="4" fill="#000000" opacity="0.12" />

          {/* Left Leg (Animated stride angle) */}
          <g transform={`rotate(${leftLegAngle}, 42, 90)`}>
            <rect x="37" y="90" width="10" height="24" rx="5" fill="#4B7093" />
            <ellipse cx="40" cy="114" rx="7" ry="4" fill="#FFFFFF" />
          </g>

          {/* Right Leg (Animated stride angle) */}
          <g transform={`rotate(${rightLegAngle}, 58, 90)`}>
            <rect x="53" y="90" width="10" height="24" rx="5" fill="#4B7093" />
            <ellipse cx="58" cy="114" rx="7" ry="4" fill="#FFFFFF" />
          </g>

          {/* Cozy Sweater Body */}
          <rect x="30" y="55" width="40" height="38" rx="10" fill="#E6C687" stroke="#D1B06F" strokeWidth="1.5" />
          <path d="M 40 55 Q 50 63 60 55" fill="#FFF9ED" stroke="#E6C687" strokeWidth="1.5" />

          {/* Arms holding terracotta plant pot */}
          <path d="M 28 65 Q 40 75 48 70" stroke="#E6C687" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 72 65 Q 60 75 52 70" stroke="#E6C687" strokeWidth="8" fill="none" strokeLinecap="round" />

          {/* Terracotta Plant Pot */}
          <path d="M 42 66 L 58 66 L 55 78 L 45 78 Z" fill="#C86D51" />
          <path d="M 50 66 Q 44 58 46 54 Q 52 58 50 66" fill="#78B955" />
          <path d="M 50 66 Q 56 58 54 54 Q 48 58 50 66" fill="#5F9E3D" />

          {/* Head & Face */}
          <circle cx="50" cy="38" r="22" fill="#FCE5D0" />

          {/* Fluffy Brown Hair */}
          <path d="M 28 36 C 26 20, 42 16, 50 18 C 58 16, 74 20, 72 36 C 68 25, 32 25, 28 36 Z" fill="#6D4C41" />
          <circle cx="34" cy="24" r="6" fill="#6D4C41" />
          <circle cx="50" cy="18" r="7" fill="#6D4C41" />
          <circle cx="66" cy="24" r="6" fill="#6D4C41" />

          {/* Sprout Leaves Growing on Head */}
          <path d="M 44 16 Q 38 6 42 2 Q 48 8 44 16" fill="#78B955" />
          <path d="M 56 16 Q 62 6 58 2 Q 52 8 56 16" fill="#5F9E3D" />

          {/* Laughing Happy Eyes */}
          <path d="M 38 36 Q 42 32 46 36" stroke="#4A2E2B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 54 36 Q 58 32 62 36" stroke="#4A2E2B" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <circle cx="35" cy="42" r="4" fill="#FF8A80" opacity="0.5" />
          <circle cx="65" cy="42" r="4" fill="#FF8A80" opacity="0.5" />

          {/* Laughing Mouth */}
          <path d="M 43 42 Q 50 50 57 42 Z" fill="#4A2E2B" />
          <path d="M 46 45 Q 50 49 54 45" fill="#E57373" />
        </svg>
      </div>
    </div>
  );
};
