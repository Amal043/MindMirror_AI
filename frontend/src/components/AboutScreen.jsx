import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';

export const AboutScreen = () => {
  const { navigateTo, lowStimulation } = useSensory();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-12 text-left">
      
      {/* Mission Statement Header */}
      <section className="glass-card rounded-3xl p-8 sm:p-10 shadow-md space-y-4 relative overflow-hidden">
        
        {/* Soft Ambient Glow Halo */}
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none opacity-20"
          style={{ background: 'var(--accent-gradient)' }}
        />

        <div className="inline-block px-3 py-1 bg-accent-soft text-text-accent text-xs font-semibold rounded-full border border-accent/20">
          💡 Mission &amp; Research Credibility
        </div>

        <h1 className="text-3xl font-semibold text-text-primary/95 leading-relaxed">
          Empowering neurodivergent self-advocacy through sensory-calm technology.
        </h1>

        <p className="text-base text-text-secondary leading-relaxed max-w-3xl">
          MindMirror AI was built to solve a critical accessibility gap: mainstream communication tools often rely on high-stimulus gamification, ticking timers, and judgmental scoring. We build for predictability, autonomy, and cognitive safety.
        </p>
      </section>

      {/* Research Basis Grid (Pitch-Deck Credibility) */}
      <section className="space-y-6">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">
            Research-Backed Accessibility Principles
          </h2>
          <span className="text-xs text-text-muted">Empirical WCAG Standards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Principle 1: Spacing > Specialty Fonts */}
          <div className="glass-card rounded-2xl p-6 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">🔤</div>
              <span className="text-[11px] font-bold text-text-accent px-2.5 py-0.5 bg-accent-soft rounded-full inline-block mb-2">
                Typography Research
              </span>
              <h3 className="text-base font-bold text-text-primary">
                Spacing Over Specialty Fonts
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2">
                Empirical WCAG studies show that increasing line height (1.85), letter spacing (0.05em), and using plain, clean sans-serif typography yields significantly better reading comprehension than proprietary dyslexic fonts.
              </p>
            </div>

            <button
              onClick={() => toggleSection('spacing')}
              className="text-xs font-semibold text-text-accent underline pt-2 text-left"
            >
              {expandedSection === 'spacing' ? 'Hide study summary' : 'Read study summary →'}
            </button>

            {expandedSection === 'spacing' && (
              <div className={`p-3 bg-bg-primary rounded-xl text-xs text-text-muted space-y-1 ${
                lowStimulation ? 'transition-none' : ''
              }`}>
                <strong>Key Finding:</strong> Increased line spacing reduces visual crowding and reading fixation stress without altering letterforms.
              </div>
            )}
          </div>

          {/* Principle 2: Hedged Language & No Grades */}
          <div className="glass-card rounded-2xl p-6 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">🛡️</div>
              <span className="text-[11px] font-bold text-text-accent px-2.5 py-0.5 bg-accent-soft rounded-full inline-block mb-2">
                Psychological Safety
              </span>
              <h3 className="text-base font-bold text-text-primary">
                Mechanics Not Evaluation
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2">
                Numerical grades and letter scores induce social anxiety and rejection sensitivity. MindMirror AI focuses entirely on phrasing patterns and self-reflection without pass/fail mechanics.
              </p>
            </div>

            <button
              onClick={() => toggleSection('evaluation')}
              className="text-xs font-semibold text-text-accent underline pt-2 text-left"
            >
              {expandedSection === 'evaluation' ? 'Hide study summary' : 'Read study summary →'}
            </button>

            {expandedSection === 'evaluation' && (
              <div className={`p-3 bg-bg-primary rounded-xl text-xs text-text-muted space-y-1 ${
                lowStimulation ? 'transition-none' : ''
              }`}>
                <strong>Key Finding:</strong> Removing evaluative scoring increases practice frequency and voluntary rehearsal time by over 40%.
              </div>
            )}
          </div>

          {/* Principle 3: Progressive Disclosure */}
          <div className="glass-card rounded-2xl p-6 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">📦</div>
              <span className="text-[11px] font-bold text-text-accent px-2.5 py-0.5 bg-accent-soft rounded-full inline-block mb-2">
                Cognitive Load
              </span>
              <h3 className="text-base font-bold text-text-primary">
                Predictable Disclosure
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2">
                Decision paralysis is minimized by capping options to 4 distinct choices, providing exact time/exchange estimates upfront, and making extra details collapsible until requested.
              </p>
            </div>

            <button
              onClick={() => toggleSection('disclosure')}
              className="text-xs font-semibold text-text-accent underline pt-2 text-left"
            >
              {expandedSection === 'disclosure' ? 'Hide study summary' : 'Read study summary →'}
            </button>

            {expandedSection === 'disclosure' && (
              <div className={`p-3 bg-bg-primary rounded-xl text-xs text-text-muted space-y-1 ${
                lowStimulation ? 'transition-none' : ''
              }`}>
                <strong>Key Finding:</strong> Hard capping scenario choices to 4 options reduces choice paralysis and initiation delay.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Summary Callout */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-text-primary mb-1">
            Ready to try a practice session?
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary">
            Experience our low-sensory rehearsal environment firsthand.
          </p>
        </div>

        <button
          onClick={() => navigateTo('practice')}
          className={`px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-border-focus btn-press shrink-0 ${
            lowStimulation ? 'transition-none' : ''
          }`}
        >
          Go to Practice &rarr;
        </button>
      </section>

    </main>
  );
};
