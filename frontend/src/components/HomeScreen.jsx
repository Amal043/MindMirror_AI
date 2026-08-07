import React from 'react';
import { useSensory } from '../context/SensoryContext';
import { MindMirrorAvatar } from './MindMirrorAvatar';
import { SproutBuddySlideshow } from './SproutBuddySlideshow';

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
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Hero Section with Glassmorphism Soft Mint Card */}
      <section className="bg-gradient-to-br from-[#EEF7F2] via-[#F4F0E6] to-[#F8F5EC] border border-[#E2EBDC] rounded-3xl p-8 lg:p-12 text-left shadow-lg relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-8">
        
        {/* Soft Ambient Glow Halo */}
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none opacity-25 bg-[#91D4C3] blur-3xl"
        />

        {/* Hero Left Column (Heading, Badge, Subtext, Buttons) */}
        <div className="space-y-6 flex-1 z-10 min-w-[320px]">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#E8DFF5] text-[#5C5B99] text-xs font-semibold rounded-full border border-[#DDD6FE]">
            <span>🌸 Neurodiversity-Friendly Communication Sandbox</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] leading-tight max-w-2xl">
            Practice challenging conversations at your own pace, on your own terms.
          </h1>

          <p className="text-base sm:text-lg text-[#4B5563] max-w-xl leading-relaxed">
            MindMirror AI provides a calm, sensory-friendly rehearsal environment with an interactive dynamic companion, soundscapes, reading guides, and zero judgment.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigateTo('practice')}
              className="px-7 py-3.5 bg-[#5A589E] hover:bg-[#494787] text-white font-bold text-sm sm:text-base rounded-2xl shadow-md cursor-pointer btn-press transition-all"
            >
              Start Practicing Now &rarr;
            </button>

            <button
              onClick={openDeescalate}
              className="px-6 py-3.5 bg-[#91D4C3] hover:bg-[#7EC9B6] text-[#1D3B33] font-bold text-sm sm:text-base rounded-2xl shadow-sm cursor-pointer btn-press transition-all flex items-center gap-2"
            >
              <span>🫁</span>
              <span>Try De-escalation Breather</span>
            </button>
          </div>
        </div>

        {/* Hero Middle Column: 15-Picture Soothing Sprout Buddy Slideshow */}
        <div className="shrink-0 z-10">
          <SproutBuddySlideshow />
        </div>

        {/* Hero Right Column: Companion Circle Portal & Daily Reflection Progress Card (Stacked Cleanly - Zero Cutoff!) */}
        <div className="shrink-0 flex flex-col items-center gap-5 z-10 max-w-sm">
          
          {/* Warm Companion Oval Background Portal */}
          <div className="w-80 h-80 sm:w-88 sm:h-88 rounded-full bg-[#F4EFE6] border-2 border-[#EADFCF] shadow-inner flex flex-col items-center justify-center p-4 relative">
            
            {/* Speech Bubble (100% Un-obscured!) */}
            <div className="mb-2 max-w-xs p-2.5 bg-white/95 border border-[#E5E0D3] rounded-2xl shadow-sm text-xs text-[#1F2937] text-center z-10">
              <span className="text-[10px] font-bold text-[#5C5B99] block mb-0.5 uppercase tracking-wider">
                💭 MINDMIRROR COMPANION
              </span>
              <p className="italic font-medium text-[11px]">
                "Welcome! I'm your practice partner. What scenario would you like to rehearse today?"
              </p>
            </div>

            {/* MindMirror Interactive Avatar */}
            <MindMirrorAvatar
              expression="empathetic"
              size="lg"
              showBubble={false}
            />
          </div>

          {/* Daily Reflection Progress Card (Stacked Neatly Underneath Companion Portal - 100% Fully Visible!) */}
          <div className="w-full p-4 bg-white/95 border border-[#E5E0D3] rounded-2xl shadow-md text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5C5B99] uppercase tracking-wider">
                DAILY REFLECTION
              </span>
              <span className="text-sm">😊</span>
            </div>

            <span className="font-bold text-[#374151] block text-sm">
              Personal CalmMind Score
            </span>

            {/* Mini Trend Line SVG */}
            <div className="h-7 w-full flex items-center justify-center py-0.5">
              <svg className="w-full h-full text-[#91D4C3]" viewBox="0 0 100 25" fill="none">
                <path d="M 5 20 Q 30 5, 60 15 T 95 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <circle cx="95" cy="5" r="3.5" fill="#5A589E" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1.5 border-t border-[#F3F4F6]">
              <span>Your Progress This Week</span>
              <button onClick={() => navigateTo('progress')} className="font-bold text-[#5A589E] underline cursor-pointer">
                View Details
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* How It Works (4 Clear Steps) */}
      <section className="space-y-6">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-[#1F2937]">How It Works</h2>
          <p className="text-sm text-[#6B7280] mt-1">Four simple steps for stress-free communication rehearsal.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div
              key={item.step}
              className={`bg-white/80 border border-[#E5E0D3] rounded-2xl p-6 flex flex-col justify-between card-hover text-left shadow-sm ${
                lowStimulation ? 'transition-none' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[11px] font-bold text-[#5C5B99] px-2.5 py-0.5 bg-[#E8DFF5] rounded-full border border-[#DDD6FE]">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1F2937] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
        <div className="bg-white/80 border border-[#E5E0D3] rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="text-2xl mb-1">⏱️</div>
          <h3 className="text-base font-bold text-[#1F2937]">Predictable Structure</h3>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            Every scenario specifies exchange length and estimated time upfront so you always know what to expect.
          </p>
        </div>

        <div className="bg-white/80 border border-[#E5E0D3] rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="text-2xl mb-1">🍃</div>
          <h3 className="text-base font-bold text-[#1F2937]">Sensory-Calm Design</h3>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            Zero flashing elements, zero autoplay videos, and instant low-stimulation mode switches.
          </p>
        </div>

        <div className="bg-white/80 border border-[#E5E0D3] rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="text-2xl mb-1">🌱</div>
          <h3 className="text-base font-bold text-[#1F2937]">Mechanics Over Grades</h3>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            We focus strictly on phrasing, boundaries, and clarity—never letter grades or evaluation scores.
          </p>
        </div>
      </section>

    </main>
  );
};
