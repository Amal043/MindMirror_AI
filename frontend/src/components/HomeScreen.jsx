import React from 'react';
import { useSensory } from '../context/SensoryContext';

export const HomeScreen = () => {
  const { navigateTo, lowStimulation, openDeescalate } = useSensory();

  const HOW_IT_WORKS_STEPS = [
    {
      step: '01',
      icon: '🎯',
      title: 'Choose a Scenario',
      description: 'Select from 4 pre-built practice situations or type your own custom context.'
    },
    {
      step: '02',
      icon: '💬',
      title: 'Rehearse at Your Pace',
      description: 'Exchange messages in a single-column view without time limits or social pressure.'
    },
    {
      step: '03',
      icon: '🧘',
      title: 'Pause Whenever Needed',
      description: 'Use the Pause & De-escalate toolkit at any time for breathing or sensory grounding breaks.'
    },
    {
      step: '04',
      icon: '📊',
      title: 'Reflect on Mechanics',
      description: 'Review completed sessions focusing on communication strategies—zero scores or grades.'
    }
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      
      {/* Hero Section with Glassmorphism Card */}
      <section className="glass-card rounded-3xl p-8 sm:p-14 text-left shadow-lg space-y-6 relative overflow-hidden">
        
        {/* Soft Ambient Glow Halo */}
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-20"
          style={{ background: 'var(--accent-gradient)' }}
        />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-accent-soft text-text-accent text-xs font-semibold rounded-full border border-accent/20">
          <span>🌸 Neurodiversity-Friendly Communication Sandbox</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary/95 leading-relaxed max-w-3xl">
          Practice challenging conversations at your own pace, on your own terms.
        </h1>

        <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
          MindMirror AI provides a calm, sensory-friendly rehearsal environment. Practice asking for accommodations, handling plan changes, and setting boundaries without judgment.
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigateTo('practice')}
            className={`px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold text-sm sm:text-base rounded-xl focus:outline-none focus:ring-4 focus:ring-border-focus shadow-md cursor-pointer btn-press ${
              lowStimulation ? 'transition-none' : ''
            }`}
          >
            Start Practicing Now &rarr;
          </button>

          <button
            onClick={openDeescalate}
            className={`px-6 py-4 bg-bg-hover hover:bg-border text-text-primary border border-border font-semibold text-sm sm:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-border-focus cursor-pointer btn-press ${
              lowStimulation ? 'transition-none' : ''
            }`}
          >
            🧘 Try De-escalation Breather
          </button>
        </div>
      </section>

      {/* How It Works (4 Clear Steps) */}
      <section className="space-y-6">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-text-primary">How It Works</h2>
          <p className="text-sm text-text-secondary mt-1">Four simple steps for stress-free communication rehearsal.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div
              key={item.step}
              className={`glass-card rounded-2xl p-6 flex flex-col justify-between card-hover text-left ${
                lowStimulation ? 'transition-none' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[11px] font-bold text-text-accent px-2.5 py-0.5 bg-accent-soft rounded-full">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
        <div className="glass-card rounded-2xl p-6 space-y-2">
          <div className="text-xl mb-1">⏱️</div>
          <h3 className="text-base font-bold text-text-primary">Predictable Structure</h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Every scenario specifies exchange length and estimated time upfront so you always know what to expect.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <div className="text-xl mb-1">🍃</div>
          <h3 className="text-base font-bold text-text-primary">Sensory-Calm Design</h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Zero flashing elements, zero autoplay videos, and instant dark slate palette switches.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <div className="text-xl mb-1">🌱</div>
          <h3 className="text-base font-bold text-text-primary">Mechanics Over Grades</h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            We focus strictly on phrasing, boundaries, and clarity—never letter grades or evaluation scores.
          </p>
        </div>
      </section>

    </main>
  );
};
