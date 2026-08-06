import React from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * PausePanel Component (Phase 5 Static Pause Screen)
 * Minimal static pause overlay with 0 animations, 0 timers, and 0 countdowns.
 */
export const PausePanel = ({ isOpen, onClose, onRestartExchange }) => {
  const { lowStimulation, navigateTo } = useSensory();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${
        lowStimulation ? 'transition-none' : 'animate-fadeIn duration-150'
      }`}
    >
      <div className="bg-bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 text-center">
        {/* Title & Static Instruction */}
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-accent-soft text-text-accent flex items-center justify-center text-xl font-bold">
            ⏸️
          </div>
          <h2 id="pause-title" className="text-xl font-bold text-text-primary">
            Pause
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Take a moment before continuing. You are in complete control of the pace.
          </p>
        </div>

        {/* Static Options */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-border-focus btn-press cursor-pointer"
          >
            Continue Conversation
          </button>

          <button
            type="button"
            onClick={() => {
              onRestartExchange();
              onClose();
            }}
            className="w-full py-3 px-4 bg-bg-primary hover:bg-bg-hover text-text-primary border border-border font-semibold rounded-xl text-sm focus:outline-none cursor-pointer"
          >
            🔄 Restart This Exchange
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigateTo('practice');
            }}
            className="w-full py-2.5 px-4 bg-transparent text-text-muted hover:text-text-primary font-medium text-xs focus:outline-none cursor-pointer"
          >
            Exit to Scenario Selection
          </button>
        </div>
      </div>
    </div>
  );
};
