import React from 'react';
import { SensoryProvider, useSensory } from './context/SensoryContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ScenarioSelectionScreen } from './components/ScenarioSelectionScreen';
import { ConversationShell } from './components/ConversationShell';
import { ProgressScreen } from './components/ProgressScreen';
import { AboutScreen } from './components/AboutScreen';
import { ContactScreen } from './components/ContactScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { DeescalateModal } from './components/DeescalateModal';

const MainContent = () => {
  const { currentRoute, currentSessionId, isDeescalateOpen, closeDeescalate } = useSensory();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-none flex flex-col justify-between selection:bg-accent-soft selection:text-text-accent">
      <div>
        <Header />
        
        {currentRoute === 'home' && <HomeScreen />}
        
        {currentRoute === 'practice' && (
          currentSessionId ? <ConversationShell /> : <ScenarioSelectionScreen />
        )}
        
        {currentRoute === 'progress' && <ProgressScreen />}
        {currentRoute === 'about' && <AboutScreen />}
        {currentRoute === 'contact' && <ContactScreen />}
        {currentRoute === 'settings' && <SettingsScreen />}
      </div>

      {/* Global De-escalation Breather Toolkit Modal */}
      <DeescalateModal isOpen={isDeescalateOpen} onClose={closeDeescalate} />

      {/* Footer */}
      <footer className="w-full bg-bg-secondary border-t border-border py-6 px-6 mt-16 text-center text-xs text-text-muted">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-accent text-white flex items-center justify-center font-bold text-[10px]">
              M
            </div>
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
