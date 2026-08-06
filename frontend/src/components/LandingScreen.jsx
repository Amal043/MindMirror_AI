import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';

export const LandingScreen = () => {
  const { navigateTo, lowStimulation } = useSensory();
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  return (
    <main className="max-w-3xl mx-auto px-8 py-16 sm:py-20 flex flex-col items-center text-center">
      {/* Calm Hero Container with Generous Whitespace */}
      <div className="w-full bg-bg-card border border-border rounded-xl p-8 sm:p-12 mb-10 text-left space-y-6">
        
        {/* Small App Name / Logo Header */}
        <div className="flex items-center space-x-2 text-text-muted text-sm font-medium">
          <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-xs">
            M
          </div>
          <span>MindMirror AI</span>
        </div>

        {/* Headline: Reduced font-weight (semibold), muted off-white/slate text color */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary/90 leading-relaxed">
          Practice challenging workplace and personal conversations in a calm, judgment-free space.
        </h1>

        {/* Collapsible Disclosure Panel: "What makes this different" */}
        <div className="pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => setIsDisclosureOpen(prev => !prev)}
            aria-expanded={isDisclosureOpen}
            className="flex items-center justify-between w-full text-sm font-medium text-text-secondary hover:text-text-primary focus:outline-none focus:ring-1 focus:ring-border-focus rounded py-1 cursor-pointer"
          >
            <span>What makes this different</span>
            <span className="text-xs text-text-muted font-normal ml-2">
              {isDisclosureOpen ? '▲ Hide details' : '▼ Show details'}
            </span>
          </button>

          {/* Instant show/hide if lowStimulation is true, brief fade if false */}
          {isDisclosureOpen && (
            <div
              className={`mt-4 pt-3 space-y-3 text-sm text-text-secondary border-t border-border/50 ${
                lowStimulation ? 'transition-none' : 'transition-opacity duration-150'
              }`}
            >
              <div className="p-3 bg-bg-primary border border-border rounded-md">
                <strong className="text-text-primary font-medium block mb-0.5">Low-Sensory Design</strong>
                Zero flashing elements, zero autoplay animations, and customizable soft dark slate palette.
              </div>

              <div className="p-3 bg-bg-primary border border-border rounded-md">
                <strong className="text-text-primary font-medium block mb-0.5">Reading Ease Support</strong>
                Increased line spacing, letter tracking, and plain sans-serif typography for visual comfort.
              </div>

              <div className="p-3 bg-bg-primary border border-border rounded-md">
                <strong className="text-text-primary font-medium block mb-0.5">Safe Scenario Rehearsal</strong>
                Practice responses without social pressure or time constraints. Take pauses whenever needed.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => navigateTo('scenarios')}
        className="w-full sm:w-auto px-10 py-4 bg-accent hover:bg-accent-hover text-white text-base font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-border-focus cursor-pointer text-center"
        aria-label="Start Practicing Communication Scenarios"
      >
        Start Practicing
      </button>
    </main>
  );
};
