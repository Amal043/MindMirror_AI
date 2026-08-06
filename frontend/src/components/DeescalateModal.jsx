import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';

export const DeescalateModal = ({ isOpen, onClose }) => {
  const { lowStimulation } = useSensory();
  const [activeTab, setActiveTab] = useState('breathing');
  const [groundingChecked, setGroundingChecked] = useState({
    see: false,
    feel: false,
    hear: false,
    smell: false,
    taste: false
  });

  if (!isOpen) return null;

  const toggleGrounding = (key) => {
    setGroundingChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetGrounding = () => {
    setGroundingChecked({ see: false, feel: false, hear: false, smell: false, taste: false });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deescalate-title"
    >
      <div className="bg-bg-card border border-border rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left relative overflow-hidden">
        
        {/* Soft Ambient Glow Halo */}
        <div 
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none opacity-30"
          style={{ background: 'var(--accent-gradient)' }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <span className="text-xs font-semibold text-text-accent uppercase tracking-wider block mb-0.5">
              Pause &amp; De-escalate Toolkit
            </span>
            <h2 id="deescalate-title" className="text-xl font-bold text-text-primary">
              Take a Breathing Moment
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-border-focus cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation: Breathing Rhythm vs Sensory Grounding */}
        <div className="flex bg-bg-hover p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('breathing')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'breathing' ? 'bg-bg-secondary text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🫁 Breathing Rhythm
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grounding')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'grounding' ? 'bg-bg-secondary text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🧘 5-4-3-2-1 Grounding
          </button>
        </div>

        {/* Tab Content 1: Breathing Rhythm */}
        {activeTab === 'breathing' && (
          <div className="py-6 flex flex-col items-center text-center space-y-6">
            
            {/* Visual Breathing Circle */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div 
                className={`w-28 h-28 rounded-full border-4 border-accent/40 bg-accent-soft flex items-center justify-center ${
                  lowStimulation ? 'transition-none' : 'breathing-circle'
                }`}
              >
                <span className="text-xs font-bold text-text-accent">
                  Breathe
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-text-primary">
                Follow your natural rhythm
              </p>
              <p className="text-xs text-text-secondary">
                Inhale quietly for 4 seconds • Hold for 4 seconds • Exhale slowly for 6 seconds
              </p>
            </div>

            <blockquote className="p-3 bg-bg-primary border border-border rounded-xl text-xs text-text-muted italic max-w-sm">
              "You are safe. Take all the time you need. There is no urgency to respond until you feel ready."
            </blockquote>
          </div>
        )}

        {/* Tab Content 2: 5-4-3-2-1 Sensory Grounding */}
        {activeTab === 'grounding' && (
          <div className="space-y-3 py-2">
            <p className="text-xs text-text-secondary mb-3">
              Acknowledge your surroundings to bring focus back to the present moment:
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-center space-x-3 p-2.5 bg-bg-primary border border-border rounded-lg cursor-pointer hover:bg-bg-hover">
                <input
                  type="checkbox"
                  checked={groundingChecked.see}
                  onChange={() => toggleGrounding('see')}
                  className="w-4 h-4 text-accent rounded border-border"
                />
                <span className={groundingChecked.see ? 'line-through text-text-muted' : 'text-text-primary'}>
                  <strong>5 things</strong> you can see around you right now
                </span>
              </label>

              <label className="flex items-center space-x-3 p-2.5 bg-bg-primary border border-border rounded-lg cursor-pointer hover:bg-bg-hover">
                <input
                  type="checkbox"
                  checked={groundingChecked.feel}
                  onChange={() => toggleGrounding('feel')}
                  className="w-4 h-4 text-accent rounded border-border"
                />
                <span className={groundingChecked.feel ? 'line-through text-text-muted' : 'text-text-primary'}>
                  <strong>4 things</strong> you can physically feel (e.g. chair, floor)
                </span>
              </label>

              <label className="flex items-center space-x-3 p-2.5 bg-bg-primary border border-border rounded-lg cursor-pointer hover:bg-bg-hover">
                <input
                  type="checkbox"
                  checked={groundingChecked.hear}
                  onChange={() => toggleGrounding('hear')}
                  className="w-4 h-4 text-accent rounded border-border"
                />
                <span className={groundingChecked.hear ? 'line-through text-text-muted' : 'text-text-primary'}>
                  <strong>3 things</strong> you can hear in your environment
                </span>
              </label>

              <label className="flex items-center space-x-3 p-2.5 bg-bg-primary border border-border rounded-lg cursor-pointer hover:bg-bg-hover">
                <input
                  type="checkbox"
                  checked={groundingChecked.smell}
                  onChange={() => toggleGrounding('smell')}
                  className="w-4 h-4 text-accent rounded border-border"
                />
                <span className={groundingChecked.smell ? 'line-through text-text-muted' : 'text-text-primary'}>
                  <strong>2 things</strong> you can smell or enjoy smelling
                </span>
              </label>

              <label className="flex items-center space-x-3 p-2.5 bg-bg-primary border border-border rounded-lg cursor-pointer hover:bg-bg-hover">
                <input
                  type="checkbox"
                  checked={groundingChecked.taste}
                  onChange={() => toggleGrounding('taste')}
                  className="w-4 h-4 text-accent rounded border-border"
                />
                <span className={groundingChecked.taste ? 'line-through text-text-muted' : 'text-text-primary'}>
                  <strong>1 thing</strong> you can taste (or a favorite taste)
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={resetGrounding}
                className="text-[11px] text-text-muted underline hover:text-text-primary"
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
            className={`px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-border-focus btn-press cursor-pointer ${
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
