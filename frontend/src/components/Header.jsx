import React from 'react';
import { useSensory } from '../context/SensoryContext';

export const Header = () => {
  const { currentRoute, navigateTo, lowStimulation } = useSensory();

  const NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'practice', label: 'Practice' },
    { id: 'progress', label: 'Progress' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="w-full bg-bg-secondary border-b border-border py-3 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-border-focus rounded-md p-1 btn-press"
          aria-label="MindMirror AI Home"
        >
          <div 
            className="w-9 h-9 rounded-lg text-white flex items-center justify-center font-bold text-base shadow-sm"
            style={{ background: 'var(--accent-gradient)' }}
          >
            M
          </div>
          <div className="text-left">
            <span className="text-lg font-bold text-text-primary block leading-none">
              MindMirror AI
            </span>
            <span className="text-[11px] text-text-muted font-medium block mt-0.5">
              Communication Practice
            </span>
          </div>
        </button>

        {/* Persistent Top Navigation Bar */}
        <nav className="flex items-center space-x-1 sm:space-x-2 relative" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`relative px-3 py-2 text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-border-focus ${
                  isActive 
                    ? 'text-text-primary font-semibold' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}

                {/* MOTION-GATE: Active route underline. Static when data-motion="false", 200ms slide when true */}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full nav-indicator ${
                      lowStimulation ? 'transition-none' : ''
                    }`}
                  />
                )}
              </button>
            );
          })}

          {/* Quick Settings Gear Icon Trigger */}
          <button
            onClick={() => navigateTo('settings')}
            className={`p-2 ml-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-border-focus btn-press ${
              currentRoute === 'settings' ? 'bg-bg-hover text-text-primary border-accent' : ''
            }`}
            title="Open Settings"
            aria-label="Settings"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.06.74 1.69.99l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.63-.25 1.17-.59 1.69-.99l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
            </svg>
          </button>
        </nav>

      </div>
    </header>
  );
};
