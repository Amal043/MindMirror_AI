import React from 'react';
import { useSensory } from '../context/SensoryContext';

export const SettingsScreen = () => {
  const {
    lowStimulation,
    toggleLowStimulation,
    readingEase,
    toggleReadingEase,
    activePalette,
    setPalette,
    fontSizePx,
    setFontSize
  } = useSensory();

  const PALETTES = [
    { id: 'slate', name: 'Soft Slate', icon: '🪨', description: 'Clean slate tones with high readability' },
    { id: 'indigo', name: 'Muted Indigo', icon: '🌌', description: 'Deep indigo accents with calming dark contrast' },
    { id: 'sage', name: 'Calm Sage', icon: '🌿', description: 'Soft eucalyptus & forest green tones' },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-left space-y-8">
      
      <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-lg space-y-8 relative overflow-hidden">
        
        {/* Soft Ambient Glow Halo */}
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none opacity-20"
          style={{ background: 'var(--accent-gradient)' }}
        />

        <div>
          <div className="inline-block px-3 py-1 bg-accent-soft text-text-accent text-xs font-semibold rounded-full mb-3 border border-accent/20">
            ⚙️ Accessibility &amp; Sensory Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            Settings &amp; Customization
          </h1>
          <p className="text-sm text-text-secondary">
            Tailor MindMirror AI to match your exact sensory and visual preferences. Changes apply live immediately.
          </p>
        </div>

        {/* Section 1: Sensory Toggles */}
        <section className="space-y-4 pt-4 border-t border-border">
          <h2 className="text-base font-bold text-text-primary">Sensory Modes</h2>

          {/* Low Stimulation Toggle */}
          <div className="flex items-center justify-between p-4 bg-bg-primary/90 border border-border rounded-xl">
            <div>
              <label htmlFor="settings-low-stim" className="text-sm font-bold text-text-primary block cursor-pointer">
                Low-Stimulation Mode
              </label>
              <p className="text-xs text-text-secondary mt-0.5 max-w-md">
                Switches root color variables to a soft dark slate palette and sets <code>--motion-enabled: false</code> to disable all CSS animations.
              </p>
            </div>
            <input
              id="settings-low-stim"
              type="checkbox"
              checked={lowStimulation}
              onChange={toggleLowStimulation}
              className="w-5 h-5 text-accent border-border rounded focus:ring-border-focus cursor-pointer shrink-0"
            />
          </div>

          {/* Reading Ease Toggle */}
          <div className="flex items-center justify-between p-4 bg-bg-primary/90 border border-border rounded-xl">
            <div>
              <label htmlFor="settings-reading-ease" className="text-sm font-bold text-text-primary block cursor-pointer">
                Reading Ease Mode
              </label>
              <p className="text-xs text-text-secondary mt-0.5 max-w-md">
                Increases letter-spacing (0.05em), line-height (1.85), and enforces plain sans-serif typography per accessibility research.
              </p>
            </div>
            <input
              id="settings-reading-ease"
              type="checkbox"
              checked={readingEase}
              onChange={toggleReadingEase}
              className="w-5 h-5 text-accent border-border rounded focus:ring-border-focus cursor-pointer shrink-0"
            />
          </div>
        </section>

        {/* Section 2: Font Size Slider */}
        <section className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">Base Font Size</h2>
            <span className="text-xs font-semibold text-text-accent px-2.5 py-1 bg-accent-soft rounded-full border border-accent/20">
              {fontSizePx}px
            </span>
          </div>

          <div className="p-4 bg-bg-primary/90 border border-border rounded-xl space-y-3">
            <input
              type="range"
              min={14}
              max={22}
              step={1}
              value={fontSizePx}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 bg-bg-hover rounded-lg appearance-none cursor-pointer accent-accent"
              aria-label="Font size slider in pixels"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>Small (14px)</span>
              <span>Default (16px)</span>
              <span>Large (22px)</span>
            </div>

            {/* Live Text Preview Box */}
            <div className="mt-3 p-3.5 bg-bg-card border border-border rounded-xl text-text-primary text-sm leading-relaxed shadow-sm">
              <span className="text-xs font-semibold text-text-muted block mb-1">Live Text Preview:</span>
              This is a sample sentence showing how text will render across practice scenarios.
            </div>
          </div>
        </section>

        {/* Section 3: Calm Color Theme Picker */}
        <section className="space-y-4 pt-4 border-t border-border">
          <h2 className="text-base font-bold text-text-primary">Calm Palette Theme</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PALETTES.map((p) => {
              const isSelected = activePalette === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPalette(p.id)}
                  className={`p-4 rounded-2xl border-2 text-left focus:outline-none focus:ring-2 focus:ring-border-focus btn-press cursor-pointer ${
                    isSelected
                      ? 'border-accent bg-accent-soft text-text-primary font-semibold shadow-sm'
                      : 'border-border bg-bg-primary/90 text-text-secondary hover:border-text-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-text-primary flex items-center space-x-1">
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </span>
                    {isSelected && <span className="text-xs text-accent font-bold">✓ Active</span>}
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {p.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
};
