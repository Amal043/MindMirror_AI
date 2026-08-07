import React, { useState, useEffect } from 'react';

/**
 * Realistic Web Audio Synthesizer for Bubble Pop Sounds
 * Synthesizes crisp pitch-modulated popping sounds.
 */
const playPopSound = (pitchMultiplier = 1) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const startFreq = (900 + Math.random() * 400) * pitchMultiplier;
    const endFreq = (350 + Math.random() * 100) * pitchMultiplier;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Audio Context fallback silent
  }
};

const STRESS_FLOATED_QUOTES = [
  "Pop! 🧼",
  "Deep breath 🫁",
  "Stress released ✨",
  "Soft calm 🌸",
  "Ahhh~ 🍃",
  "Gently relaxed 💜",
  "Feeling peace 🌿",
  "Zero pressure ☀️"
];

/**
 * SensoryFidgetWidget Component
 * Ultra-satisfying realistic bubble popping fidget pad with audio synthesis,
 * particle splash bursts, floating quotes, and floating soap bubble mode.
 */
export const SensoryFidgetWidget = ({ isOpen, onClose }) => {
  const GRID_SIZE = 20;
  const [popped, setPopped] = useState(Array(GRID_SIZE).fill(false));
  const [popCount, setPopCount] = useState(0);
  const [particles, setParticles] = useState([]);
  const [mode, setMode] = useState('pad'); // 'pad' or 'wand'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Floating soap bubbles for Wand Mode
  const [floatingBubbles, setFloatingBubbles] = useState([]);

  // Generate initial floating soap bubbles
  useEffect(() => {
    if (mode !== 'wand' || !isOpen) return;

    const interval = setInterval(() => {
      setFloatingBubbles(prev => {
        if (prev.length > 12) return prev;
        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10,
            y: 110,
            size: Math.random() * 30 + 40,
            speed: Math.random() * 0.4 + 0.3
          }
        ];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [mode, isOpen]);

  // Floating bubbles move upwards
  useEffect(() => {
    if (mode !== 'wand' || !isOpen) return;

    const moveInterval = setInterval(() => {
      setFloatingBubbles(prev =>
        prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -20)
      );
    }, 40);

    return () => clearInterval(moveInterval);
  }, [mode, isOpen]);

  if (!isOpen) return null;

  // Pop a bubble in Pad mode
  const handlePopPad = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    if (soundEnabled) {
      playPopSound(popped[idx] ? 0.8 : 1.2);
    }

    setPopped(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });

    setPopCount(c => c + 1);

    // Create particle burst & floating text
    spawnBurstParticles(clickX, clickY);
  };

  // Pop a floating soap bubble in Wand mode
  const handlePopFloating = (id, x, y) => {
    if (soundEnabled) {
      playPopSound(1.4);
    }

    setFloatingBubbles(prev => prev.filter(b => b.id !== id));
    setPopCount(c => c + 1);

    spawnBurstParticles(x, y);
  };

  // Spawn particle splash droplets & floating stress quotes
  const spawnBurstParticles = (x, y) => {
    const randomQuote = STRESS_FLOATED_QUOTES[Math.floor(Math.random() * STRESS_FLOATED_QUOTES.length)];

    const droplets = Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const speed = Math.random() * 25 + 15;
      return {
        id: Date.now() + i,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 4
      };
    });

    const newParticleGroup = {
      id: Date.now(),
      x,
      y,
      quote: randomQuote,
      droplets
    };

    setParticles(prev => [...prev, newParticleGroup]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticleGroup.id));
    }, 700);
  };

  const resetPad = () => {
    if (soundEnabled) playPopSound(0.7);
    setPopped(Array(GRID_SIZE).fill(false));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fidget-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
    >
      {/* Particle Splash Droplets & Floating Text Overlay */}
      {particles.map(group => (
        <div key={group.id} className="fixed pointer-events-none z-50" style={{ left: group.x, top: group.y }}>
          {/* Floating Stress Quote */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold text-[#5C5B99] bg-white/95 px-3 py-1 rounded-full shadow-lg border border-[#DDD6FE] whitespace-nowrap animate-bounce">
            {group.quote}
          </span>

          {/* Droplet Particles */}
          {group.droplets.map(d => (
            <span
              key={d.id}
              className="absolute rounded-full bg-gradient-to-tr from-[#91D4C3] to-[#90CDF4] opacity-80 animate-ping"
              style={{
                width: `${d.size}px`,
                height: `${d.size}px`,
                transform: `translate(${d.dx}px, ${d.dy}px)`
              }}
            />
          ))}
        </div>
      ))}

      {/* Main Fidget Modal Box */}
      <div className="bg-[#F8F5EC] border border-[#E5E0D3] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
          <div className="text-left">
            <span className="text-[10px] font-bold text-[#5C5B99] uppercase tracking-wider block">
              Sensory Regulation & Stress Relief
            </span>
            <h3 id="fidget-title" className="text-lg font-extrabold text-[#1F2937] flex items-center gap-2">
              <span>🫧</span> Realistic Bubble Pop Pad
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#1F2937] p-1.5 rounded-xl hover:bg-[#EAE5D8] transition-colors cursor-pointer"
            title="Close Fidget Pad"
          >
            ✕
          </button>
        </div>

        {/* Mode Switcher Tabs & Audio Toggle */}
        <div className="flex items-center justify-between gap-2 bg-[#EAE5D8] p-1 rounded-2xl">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode('pad')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'pad'
                  ? 'bg-white text-[#5C5B99] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              🟢 Silicone Pop Pad
            </button>
            <button
              onClick={() => setMode('wand')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'wand'
                  ? 'bg-white text-[#0288D1] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              🫧 Soap Wand
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(s => !s)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/70 hover:bg-white text-[#1F2937] cursor-pointer"
            title="Toggle Pop Sound Effects"
          >
            {soundEnabled ? '🔊 Pop Sound' : '🔇 Muted'}
          </button>
        </div>

        {/* MODE A: 5x4 Silicone Bubble Pop Grid */}
        {mode === 'pad' && (
          <div className="space-y-4">
            <p className="text-xs text-[#4B5563]">
              Tap or click any bubble to burst it with realistic popping sounds and splash droplets!
            </p>

            <div className="grid grid-cols-5 gap-3.5 p-5 bg-[#EEF7F2] rounded-3xl border border-[#E2EBDC] shadow-inner">
              {popped.map((isPopped, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => handlePopPad(idx, e)}
                  className={`w-12 h-12 rounded-full relative transition-all duration-150 cursor-pointer flex items-center justify-center font-bold text-xs outline-none ${
                    isPopped
                      ? 'bg-gradient-to-br from-[#91D4C3]/30 to-[#5C5B99]/30 border-2 border-[#91D4C3] scale-90 shadow-inner'
                      : 'bg-gradient-to-br from-[#BEE3F8] via-[#C7F4EC] to-[#E8DFF5] border-2 border-[#90CDF4] shadow-lg hover:scale-110 active:scale-95'
                  }`}
                  title={isPopped ? "Unpop bubble" : "Pop bubble!"}
                >
                  {/* 3D Glass Specular Reflection Highlight */}
                  {!isPopped && (
                    <div className="absolute top-1 left-2 w-3.5 h-2 rounded-full bg-white/80 blur-[0.5px]" />
                  )}
                  {isPopped ? (
                    <span className="text-[#5C5B99] text-xs">✓</span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-white/60 shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODE B: Floating Soap Bubbles */}
        {mode === 'wand' && (
          <div className="relative h-64 bg-gradient-to-b from-[#E0F7FA] to-[#EEF7F2] rounded-3xl border border-[#B2EBF2] overflow-hidden p-4">
            <p className="text-xs text-[#0288D1] font-semibold mb-2">
              Pop floating soap bubbles as they drift upward! 🫧
            </p>

            {floatingBubbles.map(bubble => (
              <div
                key={bubble.id}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  handlePopFloating(bubble.id, rect.left + rect.width / 2, rect.top + rect.height / 2);
                }}
                className="absolute rounded-full bg-gradient-to-tr from-cyan-300/40 via-purple-300/30 to-pink-300/40 border-2 border-white/80 shadow-lg cursor-pointer hover:scale-125 transition-transform duration-100 flex items-center justify-center"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`
                }}
              >
                <div className="w-2.5 h-1.5 rounded-full bg-white/90 absolute top-1.5 left-2" />
              </div>
            ))}
          </div>
        )}

        {/* Footer Statistics & Controls */}
        <div className="flex items-center justify-between pt-2 text-xs border-t border-[#E5E0D3]">
          <div className="flex items-center gap-1.5 font-bold text-[#5C5B99]">
            <span>✨ Stress Popped:</span>
            <span className="px-2 py-0.5 bg-[#E8DFF5] rounded-full text-sm">{popCount}</span>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'pad' && (
              <button
                type="button"
                onClick={resetPad}
                className="text-xs text-[#5C5B99] font-bold underline hover:text-[#494787] cursor-pointer"
              >
                Reset Pad
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#5A589E] hover:bg-[#494787] text-white font-bold rounded-xl cursor-pointer btn-press transition-all"
            >
              Done Fidgeting
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
