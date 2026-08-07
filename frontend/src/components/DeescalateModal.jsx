import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * DeescalateModal Component
 * Interactive Breathing Rhythm Breather & 5-4-3-2-1 Sensory Grounding Toolkit.
 * Features:
 * - 4 Customizable Breathing Patterns (Box 4-4-4-4, Deep Calm 4-7-8, Coherence 5-5, Quick Reset 3-3)
 * - Real-Time Live Seconds Ticker & Expanding/Contracting Animated Aura Rings
 * - Interactive 5-4-3-2-1 Sensory Grounding with Progress Meter & Interactive Taps
 * - Full Dark Theme & Low-Stimulation Compatibility
 */
export const DeescalateModal = ({ isOpen, onClose }) => {
  const { lowStimulation } = useSensory();
  const [activeTab, setActiveTab] = useState('breathing');

  // Breathing Timer State
  const BREATHING_PATTERNS = [
    { id: 'box', name: 'Box Breathing (4-4-4-4)', inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
    { id: 'relax', name: 'Deep Calm (4-7-8)', inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
    { id: 'coherence', name: 'Coherence (5-5)', inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 },
    { id: 'quick', name: 'Quick Reset (3-3)', inhale: 3, holdIn: 0, exhale: 3, holdOut: 0 },
  ];

  const [patternIndex, setPatternIndex] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(true);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // 'Inhale', 'Hold', 'Exhale', 'Rest'
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Grounding Checklist State
  const [groundingChecked, setGroundingChecked] = useState({
    see: false,
    feel: false,
    hear: false,
    smell: false,
    taste: false
  });

  const selectedPattern = BREATHING_PATTERNS[patternIndex];

  // Breathing Timer Effect Loop
  useEffect(() => {
    if (!isOpen || !isBreathingActive || activeTab !== 'breathing') return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Transition to next breathing phase
          if (breathPhase === 'Inhale') {
            if (selectedPattern.holdIn > 0) {
              setBreathPhase('Hold');
              return selectedPattern.holdIn;
            } else {
              setBreathPhase('Exhale');
              return selectedPattern.exhale;
            }
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return selectedPattern.exhale;
          } else if (breathPhase === 'Exhale') {
            if (selectedPattern.holdOut > 0) {
              setBreathPhase('Rest');
              return selectedPattern.holdOut;
            } else {
              setCompletedCycles(c => c + 1);
              setBreathPhase('Inhale');
              return selectedPattern.inhale;
            }
          } else {
            // Rest phase completed
            setCompletedCycles(c => c + 1);
            setBreathPhase('Inhale');
            return selectedPattern.inhale;
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isBreathingActive, activeTab, breathPhase, selectedPattern]);

  // Reset breathing timer on pattern change
  const handlePatternChange = (index) => {
    setPatternIndex(index);
    setBreathPhase('Inhale');
    setSecondsLeft(BREATHING_PATTERNS[index].inhale);
  };

  const toggleGrounding = (key) => {
    setGroundingChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetGrounding = () => {
    setGroundingChecked({ see: false, feel: false, hear: false, smell: false, taste: false });
  };

  const calculateGroundingProgress = () => {
    const total = Object.keys(groundingChecked).length;
    const checked = Object.values(groundingChecked).filter(Boolean).length;
    return Math.round((checked / total) * 100);
  };

  if (!isOpen) return null;

  // Phase color & aura styles
  const getPhaseDetails = () => {
    switch (breathPhase) {
      case 'Inhale':
        return {
          title: 'Inhale Slowly...',
          subtitle: 'Expand your lungs gently with fresh air',
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30',
          ringScale: 'scale-125'
        };
      case 'Hold':
        return {
          title: 'Hold Gently...',
          subtitle: 'Keep your shoulders relaxed and mind soft',
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
          ringScale: 'scale-110'
        };
      case 'Exhale':
        return {
          title: 'Exhale Smoothly...',
          subtitle: 'Release tension and let all stress flow out',
          color: 'text-indigo-500',
          bgColor: 'bg-indigo-500/10 border-indigo-500/30',
          ringScale: 'scale-90'
        };
      case 'Rest':
      default:
        return {
          title: 'Pause & Rest...',
          subtitle: 'Enjoy the soft stillness before the next breath',
          color: 'text-teal-500',
          bgColor: 'bg-teal-500/10 border-teal-500/30',
          ringScale: 'scale-100'
        };
    }
  };

  const phaseInfo = getPhaseDetails();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deescalate-title"
    >
      <div className="bg-bg-card border border-border rounded-3xl max-w-lg w-full p-4 sm:p-6 lg:p-8 shadow-2xl space-y-5 text-left relative overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Soft Ambient Glow Halo */}
        <div 
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none opacity-25 blur-xl"
          style={{ background: 'var(--accent-gradient)' }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold text-text-accent uppercase tracking-wider block mb-0.5">
              Pause &amp; De-escalate Breather
            </span>
            <h2 id="deescalate-title" className="text-xl font-extrabold text-text-primary">
              Zen Breathing &amp; Grounding
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-hover text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation: Breathing Rhythm vs Sensory Grounding */}
        <div className="flex bg-bg-hover p-1 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('breathing')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'breathing' ? 'bg-bg-secondary text-text-primary shadow-md' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🫁 Breathing Rhythm &amp; Timer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grounding')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'grounding' ? 'bg-bg-secondary text-text-primary shadow-md' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🧘 5-4-3-2-1 Grounding
          </button>
        </div>

        {/* Tab Content 1: Interactive Breathing Rhythm & Timer */}
        {activeTab === 'breathing' && (
          <div className="py-2 flex flex-col items-center text-center space-y-5">
            
            {/* Pattern Selector Pills */}
            <div className="flex flex-wrap justify-center gap-1.5 w-full">
              {BREATHING_PATTERNS.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePatternChange(idx)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                    patternIndex === idx 
                      ? 'bg-[#5C5B99] text-white border-[#5C5B99] shadow-sm' 
                      : 'bg-bg-primary text-text-muted border-border hover:bg-bg-hover'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Visual Animated Breathing Circle with Live Timer */}
            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              {/* Outer Pulse Ring */}
              <div 
                className={`absolute inset-0 rounded-full border-2 border-accent/20 transition-transform duration-1000 ${
                  lowStimulation ? '' : phaseInfo.ringScale
                }`}
              />
              
              {/* Inner Glowing Breathing Circle */}
              <div 
                className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center p-2 shadow-inner transition-all duration-700 ${phaseInfo.bgColor}`}
              >
                <span className={`text-3xl font-black ${phaseInfo.color}`}>
                  {secondsLeft}s
                </span>
                <span className={`text-xs font-extrabold tracking-wide uppercase mt-0.5 ${phaseInfo.color}`}>
                  {breathPhase}
                </span>
              </div>
            </div>

            {/* Phase Instructions */}
            <div className="space-y-1">
              <p className="text-sm font-bold text-text-primary">
                {phaseInfo.title}
              </p>
              <p className="text-xs text-text-secondary max-w-xs mx-auto">
                {phaseInfo.subtitle}
              </p>
            </div>

            {/* Controls & Cycle Badge */}
            <div className="flex items-center justify-between w-full pt-2 border-t border-border/60">
              <span className="text-xs text-text-muted font-medium">
                🌱 {completedCycles} cycles completed
              </span>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className="px-3.5 py-1.5 bg-bg-hover hover:bg-bg-secondary text-text-primary text-xs font-bold rounded-lg transition-colors cursor-pointer border border-border"
                >
                  {isBreathingActive ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <button
                  type="button"
                  onClick={() => handlePatternChange(patternIndex)}
                  className="px-3 py-1.5 bg-bg-hover hover:bg-bg-secondary text-text-muted text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab Content 2: 5-4-3-2-1 Sensory Grounding with Progress Meter */}
        {activeTab === 'grounding' && (
          <div className="space-y-4 py-1">
            
            {/* Progress Meter Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-text-primary">Grounding Progress</span>
                <span className="text-text-accent">{calculateGroundingProgress()}%</span>
              </div>
              <div className="w-full bg-bg-hover h-2.5 rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-[#5C5B99] transition-all duration-300 rounded-full"
                  style={{ width: `${calculateGroundingProgress()}%` }}
                />
              </div>
            </div>

            {/* Grounding Checklist Steps */}
            <div className="space-y-2.5 text-xs max-h-[220px] overflow-y-auto pr-1">
              
              <label className="flex items-center space-x-3 p-3 bg-bg-primary border border-border rounded-xl cursor-pointer hover:bg-bg-hover transition-colors">
                <input
                  type="checkbox"
                  checked={groundingChecked.see}
                  onChange={() => toggleGrounding('see')}
                  className="w-4 h-4 text-accent rounded border-border cursor-pointer accent-[#5C5B99]"
                />
                <span className={groundingChecked.see ? 'line-through text-text-muted' : 'text-text-primary font-medium'}>
                  👁️ <strong>5 things</strong> you can see around you (e.g. lamp, desk, window)
                </span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-bg-primary border border-border rounded-xl cursor-pointer hover:bg-bg-hover transition-colors">
                <input
                  type="checkbox"
                  checked={groundingChecked.feel}
                  onChange={() => toggleGrounding('feel')}
                  className="w-4 h-4 text-accent rounded border-border cursor-pointer accent-[#5C5B99]"
                />
                <span className={groundingChecked.feel ? 'line-through text-text-muted' : 'text-text-primary font-medium'}>
                  ✋ <strong>4 things</strong> you can physically feel (e.g. chair, clothes, floor)
                </span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-bg-primary border border-border rounded-xl cursor-pointer hover:bg-bg-hover transition-colors">
                <input
                  type="checkbox"
                  checked={groundingChecked.hear}
                  onChange={() => toggleGrounding('hear')}
                  className="w-4 h-4 text-accent rounded border-border cursor-pointer accent-[#5C5B99]"
                />
                <span className={groundingChecked.hear ? 'line-through text-text-muted' : 'text-text-primary font-medium'}>
                  👂 <strong>3 things</strong> you can hear (e.g. hum of fan, distant birds)
                </span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-bg-primary border border-border rounded-xl cursor-pointer hover:bg-bg-hover transition-colors">
                <input
                  type="checkbox"
                  checked={groundingChecked.smell}
                  onChange={() => toggleGrounding('smell')}
                  className="w-4 h-4 text-accent rounded border-border cursor-pointer accent-[#5C5B99]"
                />
                <span className={groundingChecked.smell ? 'line-through text-text-muted' : 'text-text-primary font-medium'}>
                  🌸 <strong>2 things</strong> you can smell (or favorite soothing scents)
                </span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-bg-primary border border-border rounded-xl cursor-pointer hover:bg-bg-hover transition-colors">
                <input
                  type="checkbox"
                  checked={groundingChecked.taste}
                  onChange={() => toggleGrounding('taste')}
                  className="w-4 h-4 text-accent rounded border-border cursor-pointer accent-[#5C5B99]"
                />
                <span className={groundingChecked.taste ? 'line-through text-text-muted' : 'text-text-primary font-medium'}>
                  👅 <strong>1 thing</strong> you can taste (or a comforting positive thought)
                </span>
              </label>

            </div>

            <div className="flex justify-between items-center pt-1 border-t border-border/60">
              {calculateGroundingProgress() === 100 ? (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  ✨ Grounding Complete! Mind is present.
                </span>
              ) : (
                <span className="text-[11px] text-text-muted">
                  Tap items as you notice them
                </span>
              )}
              <button
                type="button"
                onClick={resetGrounding}
                className="text-xs text-text-muted underline hover:text-text-primary cursor-pointer"
              >
                Reset grounding items
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer Action */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Session state is preserved
          </span>
          
          <button
            onClick={onClose}
            className={`px-6 py-2.5 bg-[#5C5B99] hover:bg-[#4A4985] text-white text-xs sm:text-sm font-extrabold rounded-xl focus:outline-none focus:ring-2 focus:ring-border-focus btn-press cursor-pointer shadow-md ${
              lowStimulation ? 'transition-none' : ''
            }`}
          >
            Resume Practice Session &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
