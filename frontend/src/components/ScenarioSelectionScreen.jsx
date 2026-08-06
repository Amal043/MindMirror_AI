import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';

export const ScenarioSelectionScreen = () => {
  const { startScenario, isLoading, lowStimulation } = useSensory();
  const [customText, setCustomText] = useState('');
  const [customError, setCustomError] = useState('');

  // Exactly 4 scenarios with predictability tags: [N] exchanges · ~[X] min
  const SCENARIOS = [
    {
      id: 'accommodations',
      title: '1. Asking for Extra Time / Accommodations',
      description: 'Practice requesting extra processing time, written instructions, or workplace/academic accommodations clearly.',
      badge: 'Workplace & School',
      icon: '💼',
      predictabilityTag: '3–5 exchanges · ~3 min'
    },
    {
      id: 'plan_change',
      title: '2. Explaining Sudden Plan Change Overwhelm',
      description: 'Practice communicating why last-minute plan changes feel overwhelming and request a transition strategy.',
      badge: 'Interpersonal',
      icon: '🔄',
      predictabilityTag: '3–5 exchanges · ~4 min'
    },
    {
      id: 'boundary',
      title: '3. Setting a Firm Boundary',
      description: 'Practice saying no to extra tasks, overcommitments, or uncomfortable requests without guilt or ambiguity.',
      badge: 'Self-Advocacy',
      icon: '🛡️',
      predictabilityTag: '3–5 exchanges · ~3 min'
    },
    {
      id: 'custom',
      title: '4. Custom Scenario (Your Own Situation)',
      description: 'Type out a specific situation you are currently facing to practice in a low-pressure environment.',
      badge: 'Personalized',
      icon: '✏️',
      predictabilityTag: 'Flexible length · ~3–5 min'
    }
  ];

  const handleSelectScenario = (scenarioId) => {
    if (scenarioId === 'custom') {
      if (!customText.trim()) {
        setCustomError('Please type a brief description of your situation first.');
        return;
      }
      setCustomError('');
      startScenario('custom', customText.trim());
    } else {
      startScenario(scenarioId);
    }
  };

  const handleKeyDown = (e, scenarioId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectScenario(scenarioId);
    }
  };

  const getWordCount = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const wordCount = getWordCount(customText);
  const charCount = customText.length;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8 text-left space-y-2">
        <div className="inline-block px-3 py-1 bg-accent-soft text-text-accent text-xs font-semibold rounded-full">
          Rehearsal Selection
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary/95">
          Select a Practice Scenario
        </h1>
        <p className="text-sm text-text-secondary max-w-xl">
          Choose one of the 4 situations below to begin your calm rehearsal session.
        </p>
      </div>

      {isLoading && (
        <div className={`p-4 mb-6 bg-accent-soft text-text-accent rounded-xl font-semibold text-center text-sm ${
          lowStimulation ? 'transition-none' : ''
        }`}>
          Preparing practice session...
        </div>
      )}

      {/* Exactly 4 Scenario Cards Grid - Glassmorphism & Normalized Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SCENARIOS.map((scenario) => {
          const isCustom = scenario.id === 'custom';

          return (
            <div
              key={scenario.id}
              tabIndex={isCustom ? undefined : 0}
              role={isCustom ? undefined : 'button'}
              aria-label={`${scenario.title}, ${scenario.predictabilityTag}`}
              onClick={() => !isCustom && handleSelectScenario(scenario.id)}
              onKeyDown={(e) => !isCustom && handleKeyDown(e, scenario.id)}
              className={`glass-card rounded-2xl p-6 flex flex-col justify-between min-h-[310px] text-left focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus card-hover ${
                !isCustom ? 'cursor-pointer hover:border-accent' : ''
              } ${lowStimulation ? 'transition-none' : ''}`}
            >
              <div>
                {/* Category Badge & Predictability Tag */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-base mr-1">{scenario.icon}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 bg-bg-hover text-text-muted rounded-full border border-border">
                    {scenario.badge}
                  </span>
                  <span className="text-xs text-text-accent font-medium bg-accent-soft px-2.5 py-0.5 rounded-full border border-accent/20">
                    {scenario.predictabilityTag}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-text-primary mb-2 leading-snug">
                  {scenario.title}
                </h2>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
                  {scenario.description}
                </p>
              </div>

              {/* Custom Input Field for Card 4 with Static Count Hint */}
              {isCustom ? (
                <div className="mt-2 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs font-medium text-text-primary mb-1">
                    <label htmlFor="custom-scenario-input">Describe your situation:</label>
                    <span className="text-text-muted text-[11px]">
                      Suggested: 10–50 words
                    </span>
                  </div>

                  <textarea
                    id="custom-scenario-input"
                    rows={3}
                    value={customText}
                    onChange={(e) => {
                      setCustomText(e.target.value);
                      if (e.target.value.trim()) setCustomError('');
                    }}
                    placeholder="e.g. Asking my roommate to reduce loud noise after 9 PM..."
                    className="w-full p-3 bg-bg-input text-text-primary border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus resize-y"
                  />

                  {/* Static Word/Character Count Hint */}
                  <div className="flex items-center justify-between text-[11px] text-text-muted mt-1">
                    <span>
                      Current: <strong>{wordCount}</strong> words ({charCount} chars)
                    </span>
                    {wordCount > 0 && wordCount < 10 && (
                      <span className="text-text-muted italic">
                        (Brief is ok!)
                      </span>
                    )}
                  </div>

                  {customError && (
                    <p className={`text-xs text-red-500 mt-1 font-medium ${lowStimulation ? 'transition-none' : ''}`}>
                      {customError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSelectScenario('custom')}
                    className="mt-3 w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-border-focus cursor-pointer btn-press"
                  >
                    Start Custom Practice Session &rarr;
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs sm:text-sm text-text-accent font-semibold">
                  <span>Start Scenario</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};
