import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * RunningChildBuddy Component
 * Interactive Spiderman-Style Wall-Climbing Companion!
 * Walks & climbs continuously around the screen perimeter with 100% smooth corner turns (ZERO teleporting & ZERO head cutoff).
 *
 * Continuous Perimeter Loop (% 0 -> 100):
 * 0% -> 30%: BOTTOM EDGE (Left -> Right) [Ground Runner]
 * 30% -> 50%: RIGHT WALL (Bottom -> Top) [Spiderman Upward Wall-Climber 🕷️]
 * 50% -> 80%: TOP EDGE (Right -> Left) [Unclipped Top Runner - 115px Clearance!]
 * 80% -> 100%: LEFT WALL (Top -> Bottom) [Spiderman Downward Wall-Climber 🕷️]
 */
export const RunningChildBuddy = () => {
  const { lowStimulation } = useSensory();

  // Continuous perimeter progress (0.0 to 100.0)
  const [perimeterPos, setPerimeterPos] = useState(5.0);
  const [legFrame, setLegFrame] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [laughText, setLaughText] = useState('');
  const [sparkles, setSparkles] = useState([]);

  const LAUGHS = [
    "Spiderman Wall Climb! 🕷️🌱",
    "Hehe! Smooth corner turn!",
    "Walking around the edges!",
    "Exploring top & bottom! 🌸",
    "Climbing up & sliding down! 🕸️",
    "Staying on the sides! 🍃"
  ];

  // Motion loop: Increments continuous 0->100 perimeter position smoothly
  useEffect(() => {
    if (lowStimulation) return;

    const runInterval = setInterval(() => {
      setPerimeterPos(prev => {
        let next = prev + 0.05; // Calm, gentle walking speed
        if (next >= 100.0) return 0.0;
        return next;
      });

      setLegFrame(prev => (prev + 1) % 4);
    }, 60);

    return () => clearInterval(runInterval);
  }, [lowStimulation]);

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

  // Leg & arm angles for 4-frame Spiderman stride/climb cycle
  const getLegAngles = () => {
    switch (legFrame) {
      case 0: return { left: -30, right: 30, bob: -4, armL: -15, armR: 15 };
      case 1: return { left: 0, right: 0, bob: 0, armL: 0, armR: 0 };
      case 2: return { left: 30, right: -30, bob: -4, armL: 15, armR: -15 };
      case 3: return { left: 0, right: 0, bob: 0, armL: 0, armR: 0 };
      default: return { left: 0, right: 0, bob: 0, armL: 0, armR: 0 };
    }
  };

  // Compute 100% continuous perimeter position & rotation (ZERO JUMPS)
  const getPerimeterTransform = () => {
    const t = perimeterPos;

    if (t <= 30.0) {
      // 1. BOTTOM EDGE (Left -> Right)
      const p = t / 30.0; // 0 to 1
      const left = 5 + p * 87; // 5% to 92%
      return {
        style: { left: `${left}%`, bottom: '12px', top: 'auto', right: 'auto' },
        transform: `scaleX(1) rotate(0deg) translateY(${isJumping ? -35 : bob}px)`,
        isWall: false
      };
    } else if (t <= 50.0) {
      // 2. RIGHT WALL (Bottom -> Top Spiderman Climber)
      const p = (t - 30.0) / 20.0; // 0 to 1
      const top = 88 - p * 72; // 88% down to 16% (near header)
      return {
        style: { right: '16px', top: `${top}%`, left: 'auto', bottom: 'auto' },
        transform: `rotate(-12deg) scaleX(-1) translateY(${isJumping ? -35 : bob}px)`,
        isWall: true
      };
    } else if (t <= 80.0) {
      // 3. TOP EDGE (Right -> Left - Unclipped 115px below header!)
      const p = (t - 50.0) / 30.0; // 0 to 1
      const left = 92 - p * 87; // 92% down to 5%
      return {
        style: { left: `${left}%`, top: '115px', right: 'auto', bottom: 'auto' },
        transform: `scaleX(-1) rotate(0deg) translateY(${isJumping ? -35 : bob}px)`,
        isWall: false
      };
    } else {
      // 4. LEFT WALL (Top -> Bottom Spiderman Climber)
      const p = (t - 80.0) / 20.0; // 0 to 1
      const top = 16 + p * 72; // 16% down to 88%
      return {
        style: { left: '16px', top: `${top}%`, right: 'auto', bottom: 'auto' },
        transform: `rotate(12deg) scaleX(1) translateY(${isJumping ? -35 : bob}px)`,
        isWall: true
      };
    }
  };

  const { left: leftLegAngle, right: rightLegAngle, bob, armL, armR } = getLegAngles();
  const { style: trackStyle, transform: trackTransform, isWall: isWallClimbing } = getPerimeterTransform();

  return (
    <div
      className="fixed z-40 transition-none pointer-events-auto cursor-pointer"
      style={{
        ...trackStyle,
        transform: trackTransform
      }}
      onClick={handleClick}
      title="Click the Sprout Spiderman companion climbing the screen edges!"
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

      {/* SVG Vector Animated Spiderman Wall-Climbing Companion */}
      <div className="w-20 h-28 relative">
        <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-md overflow-visible">
          {/* Ground / Wall Shadow */}
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

          {/* Arms holding terracotta plant pot OR Spiderman Wall Grip arms */}
          {isWallClimbing ? (
            <>
              {/* Spiderman Wall Grip Arms */}
              <g transform={`rotate(${armL - 20}, 30, 60)`}>
                <path d="M 30 60 Q 15 50 10 40" stroke="#E6C687" strokeWidth="7" fill="none" strokeLinecap="round" />
                <circle cx="10" cy="40" r="4" fill="#FCE5D0" />
              </g>
              <g transform={`rotate(${armR + 20}, 70, 60)`}>
                <path d="M 70 60 Q 85 50 90 40" stroke="#E6C687" strokeWidth="7" fill="none" strokeLinecap="round" />
                <circle cx="90" cy="40" r="4" fill="#FCE5D0" />
              </g>
              {/* Mini Sprout Backpack on Wall Climb */}
              <path d="M 44 65 L 56 65 L 54 75 L 46 75 Z" fill="#C86D51" />
              <path d="M 50 65 Q 44 58 46 54 Q 52 58 50 65" fill="#78B955" />
            </>
          ) : (
            <>
              {/* Regular Pot Carrying Arms */}
              <path d="M 28 65 Q 40 75 48 70" stroke="#E6C687" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path d="M 72 65 Q 60 75 52 70" stroke="#E6C687" strokeWidth="8" fill="none" strokeLinecap="round" />
              {/* Terracotta Plant Pot */}
              <path d="M 42 66 L 58 66 L 55 78 L 45 78 Z" fill="#C86D51" />
              <path d="M 50 66 Q 44 58 46 54 Q 52 58 50 66" fill="#78B955" />
              <path d="M 50 66 Q 56 58 54 54 Q 48 58 50 66" fill="#5F9E3D" />
            </>
          )}

          {/* Head & Face */}
          <circle cx="50" cy="38" r="22" fill="#FCE5D0" />

          {/* Fluffy Brown Hair */}
          <path d="M 28 36 C 26 20, 42 16, 50 18 C 58 16, 74 20, 72 36 C 68 25, 32 25, 28 36 Z" fill="#6D4C41" />
          <circle cx="34" cy="24" r="6" fill="#6D4C41" />
          <circle cx="50" cy="18" r="7" fill="#6D4C41" />
          <circle cx="66" cy="24" r="6" fill="#6D4C41" />

          {/* Sprout Leaves Growing on Head (Signatures!) */}
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
