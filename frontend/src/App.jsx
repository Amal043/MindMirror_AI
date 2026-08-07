import React from 'react';
import { SensoryProvider, useSensory } from './context/SensoryContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ScenarioSelectionScreen } from './components/ScenarioSelectionScreen';
import { ConversationShell } from './components/ConversationShell';
import { SessionDebrief } from './components/SessionDebrief';
import { ProgressScreen } from './components/ProgressScreen';
import { AboutScreen } from './components/AboutScreen';
import { ContactScreen } from './components/ContactScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { DeescalateModal } from './components/DeescalateModal';
import { SensoryFidgetWidget } from './components/SensoryFidgetWidget';
import { FocusReadingGuide } from './components/FocusReadingGuide';
import { RunningChildBuddy } from './components/RunningChildBuddy';

const MainContent = () => {
  const {
    currentRoute,
    currentSessionId,
    isDeescalateOpen,
    closeDeescalate,
    isFidgetOpen,
    closeFidget,
    isFocusGuideActive
  } = useSensory();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-none flex flex-col justify-between selection:bg-accent-soft selection:text-text-accent">
      <div>
        {/* Dyslexia Visual Focus Reading Line Overlay */}
        <FocusReadingGuide isActive={isFocusGuideActive} />

        <Header />
        
        {currentRoute === 'home' && <HomeScreen />}
        
        {currentRoute === 'practice' && (
          currentSessionId ? <ConversationShell /> : <ScenarioSelectionScreen />
        )}
        
        {currentRoute === 'debrief' && <SessionDebrief />}
        {currentRoute === 'progress' && <ProgressScreen />}
        {currentRoute === 'about' && <AboutScreen />}
        {currentRoute === 'contact' && <ContactScreen />}
        {currentRoute === 'settings' && <SettingsScreen />}
      </div>

      {/* Interactive Running Child Companion Buddy */}
      <RunningChildBuddy />

      {/* Global De-escalation Breather Toolkit Modal */}
      <DeescalateModal isOpen={isDeescalateOpen} onClose={closeDeescalate} />

      {/* Sensory Bubble Pop Fidget Pad Modal */}
      <SensoryFidgetWidget isOpen={isFidgetOpen} onClose={closeFidget} />

      {/* Footer */}
      <footer className="w-full bg-bg-secondary border-t border-border py-6 px-6 mt-16 text-center text-xs text-text-muted">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img
              src="/mindmirror_logo.png"
              alt="MindMirror Logo"
              className="w-6 h-6 rounded-md object-cover border border-[#E5E0D3]"
            />
            <span><strong>MindMirror AI</strong> • Sensory-Friendly Communication Sandbox</span>
          </div>
          <div>
            Designed for cognitive comfort, predictability, and neurodivergent self-advocacy.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SensoryProvider>
      <MainContent />
    </SensoryProvider>
  );
}
