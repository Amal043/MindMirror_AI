import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';
import { AmbientSoundWidget } from './AmbientSoundWidget';

export const Header = () => {
  const {
    currentRoute,
    navigateTo,
    isFocusGuideActive,
    toggleFocusGuide,
    openFidget,
    openDeescalate,
    toggleLowStimulation,
    toggleReadingEase,
    speakText
  } = useSensory();

  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  const NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'practice', label: 'Practice' },
    { id: 'progress', label: 'Progress' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="w-full bg-[#F4F0E6] border-b border-[#E5E0D3] py-2.5 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Title */}
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center space-x-3 focus:outline-none rounded-xl p-1 btn-press cursor-pointer"
          aria-label="MindMirror AI Home"
        >
          <img
            src="/mindmirror_logo.png"
            alt="MindMirror AI Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-sm border border-[#E5E0D3]"
          />
          <div className="text-left">
            <span className="text-lg font-bold text-[#1F2937] block leading-none">
              MindMirror AI
            </span>
            <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
              Communication Practice
            </span>
          </div>
        </button>

        {/* Top Control Bar & Nav Links */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Web Audio Ambient Soundscapes Widget (Pastel Purple Pill) */}
          <div className="shrink-0">
            <AmbientSoundWidget />
          </div>

          {/* Dyslexia Focus Line Guide (Pastel Blue Pill) */}
          <button
            type="button"
            onClick={toggleFocusGuide}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isFocusGuideActive
                ? 'bg-[#BEE3F8] text-[#1E40AF] border-[#90CDF4] shadow-sm'
                : 'bg-[#D4EBF8] text-[#1E56A0] border-[#BDE0FE] hover:bg-[#BEE3F8]'
            }`}
            title="Toggle Dyslexia Focus Line Guide"
          >
            🔍 Line Guide
          </button>

          {/* Sensory Fidget Bubble Pad (Pastel Peach Pill) */}
          <button
            type="button"
            onClick={openFidget}
            className="px-3.5 py-1.5 bg-[#FDE4D6] text-[#C2593F] border border-[#FCD5C1] hover:bg-[#FCD5C1] rounded-full text-xs font-semibold transition-all cursor-pointer"
            title="Open Bubble Pop Fidget Pad"
          >
            ✋ Fidget
          </button>

          {/* Nav Items */}
          <nav className="flex items-center space-x-1 relative" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-[#D5E8D4] text-[#2C5E2E] border border-[#B8D8B6] shadow-sm' 
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#EAE5D8]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Accessibility Gear Button */}
            <button
              onClick={() => setIsToolbarOpen(prev => !prev)}
              className={`p-2 ml-1 text-[#4B5563] hover:bg-[#EAE5D8] rounded-xl border border-[#E5E0D3] focus:outline-none cursor-pointer btn-press ${
                isToolbarOpen ? 'bg-[#D5E8D4] text-[#2C5E2E] border-[#B8D8B6]' : ''
              }`}
              title="Toggle Accessibility Toolbar"
            >
              ⚙️
            </button>
          </nav>
        </div>

      </div>

      {/* Floating Secondary Accessibility Bar & Popover Bar (Matching Reference Image) */}
      <div className="max-w-6xl mx-auto flex items-center justify-end gap-2 pt-2 text-xs">
        <button
          onClick={() => navigateTo('progress')}
          className="px-3 py-1 bg-[#FCE4EB] text-[#B83280] border border-[#F9C5D5] hover:bg-[#F9C5D5] rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1"
        >
          <span>📖</span> Journal
        </button>

        <button
          onClick={() => openDeescalate()}
          className="px-3 py-1 bg-[#E1F5FE] text-[#0288D1] border border-[#B3E5FC] hover:bg-[#B3E5FC] rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1"
        >
          <span>🌸</span> Zen Zone
        </button>

        {/* Accessibility Toolbar Floating Card */}
        {isToolbarOpen && (
          <div className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E5E0D3] rounded-2xl shadow-md flex items-center gap-2 text-xs animate-fadeIn">
            <span className="font-semibold text-[#6B7280] text-[11px]">Accessibility Toolbar</span>
            <button
              onClick={() => speakText("MindMirror AI Accessibility Toolbar Active.")}
              className="p-1 px-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] rounded-lg font-bold border border-[#D1D5DB] cursor-pointer"
              title="Text-to-Speech Audio Reader"
            >
              A🔊
            </button>
            <button
              onClick={toggleLowStimulation}
              className="p-1 px-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] rounded-lg font-bold border border-[#D1D5DB] cursor-pointer"
              title="High Contrast / Low Stimulation Mode"
            >
              ◐
            </button>
            <button
              onClick={toggleReadingEase}
              className="p-1 px-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] rounded-lg font-bold border border-[#D1D5DB] cursor-pointer"
              title="Reading Ease Typography"
            >
              Aa
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
