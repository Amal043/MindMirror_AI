import React from 'react';
import { useSensory } from '../context/SensoryContext';
import { SegmentedMessage } from './SegmentedMessage';
import { CommunicationPaths } from './CommunicationPaths';

export const ConversationShell = () => {
  const { messages, sendMessage, isLoading, activeScenario, navigateTo, lowStimulation, openDeescalate } = useSensory();

  // Find the last persona message to pass response options to CommunicationPaths
  const personaMessages = messages.filter(m => m.sender === 'persona');
  const lastPersonaMessage = personaMessages.length > 0 ? personaMessages[personaMessages.length - 1] : null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-100px)] py-2 px-2 sm:px-0">
      
      {/* Session Top Bar */}
      <div className="glass-card rounded-2xl p-4 mb-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-accent-soft text-text-accent flex items-center justify-center text-xs font-bold">
            💬
          </div>
          <div>
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Rehearsal Room
            </span>
            <h1 className="text-sm sm:text-base font-bold text-text-primary">
              {activeScenario?.scenarioId === 'custom' 
                ? 'Custom Practice Session' 
                : activeScenario?.scenarioId
                  ? `Scenario: ${activeScenario.scenarioId}`
                  : 'Communication Practice'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* MOTION-GATE: Signature breathing pulse on Pause & De-escalate button idle state */}
          <button
            type="button"
            onClick={openDeescalate}
            className={`px-3.5 py-1.5 bg-accent-soft text-text-accent hover:bg-accent hover:text-white border border-accent/30 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-border-focus cursor-pointer btn-press ${
              lowStimulation ? 'transition-none' : 'breathing-pulse'
            }`}
            aria-label="Pause and De-escalate practice session"
          >
            🧘 Pause &amp; De-escalate
          </button>

          <button
            type="button"
            onClick={() => navigateTo('practice')}
            className="px-3 py-1.5 bg-bg-primary hover:bg-bg-hover text-text-secondary border border-border rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
          >
            Exit Session
          </button>
        </div>
      </div>

      {/* Single-Column Chat View Area */}
      <div className="flex-1 glass-card rounded-2xl p-4 sm:p-5 overflow-y-auto mb-3 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <SegmentedMessage key={msg.id} message={msg} />
          ))}

          {/* MOTION-GATE: Static loading indicator with breathing pulse if motion enabled */}
          {isLoading && (
            <div className={`text-left text-xs font-semibold text-text-muted italic py-2 px-1 ${
              lowStimulation ? 'transition-none' : 'breathing-pulse'
            }`}>
              Loading persona response &amp; communication paths...
            </div>
          )}
        </div>

        {/* Phase 4 Communication Paths Component */}
        <CommunicationPaths
          lastPersonaMessage={lastPersonaMessage}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
