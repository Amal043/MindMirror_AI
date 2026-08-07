import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';
import { SegmentedMessage } from './SegmentedMessage';
import { CommunicationPaths } from './CommunicationPaths';
import { ConversationPaceBadge } from './ConversationPaceBadge';
import { PausePanel } from './PausePanel';
import { PauseSuggestion } from './PauseSuggestion';
import { MindMirrorAvatar } from './MindMirrorAvatar';

export const ConversationShell = () => {
  const {
    messages,
    sendMessage,
    restartExchange,
    isLoading,
    activeScenario,
    navigateTo,
    lowStimulation,
    isDeescalateOpen,
    openDeescalate,
    closeDeescalate,
    isSpeakingTTS
  } = useSensory();

  const [dismissedSuggestion, setDismissedSuggestion] = useState(false);

  // Find the last persona message to pass response options & pace
  const personaMessages = messages.filter(m => m.sender === 'persona');
  const lastPersonaMessage = personaMessages.length > 0 ? personaMessages[personaMessages.length - 1] : null;

  const currentPaceObj = lastPersonaMessage?.conversation_pace || { pace: 'Calm', reasons: ['Initial dialogue'] };
  const currentPace = currentPaceObj.pace || 'Calm';

  const isEscalating = currentPace === 'Escalating';

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-100px)] py-2 px-2 sm:px-0">
      
      {/* Session Top Bar */}
      <div className="glass-card rounded-2xl p-4 mb-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-accent-soft text-text-accent flex items-center justify-center text-xs font-bold">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                Rehearsal Room
              </span>
              {/* Phase 5 Conversation Pace Badge */}
              <ConversationPaceBadge paceObj={currentPaceObj} />
            </div>
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
          {/* Phase 6 Finish & Reflect Button */}
          <button
            type="button"
            onClick={() => navigateTo('debrief')}
            className="px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-semibold focus:outline-none cursor-pointer btn-press shadow-sm"
          >
            📋 Finish &amp; Reflect
          </button>

          {/* Pause & Reset Action */}
          <button
            type="button"
            onClick={openDeescalate}
            className="px-3.5 py-1.5 bg-bg-card text-text-primary hover:bg-bg-hover border border-border rounded-xl text-xs font-semibold focus:outline-none cursor-pointer btn-press"
            aria-label="Pause and reset practice session"
          >
            ⏸️ Pause &amp; Reset
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

      {/* Single-Occurrence Escalation Guidance Banner */}
      {isEscalating && !dismissedSuggestion && (
        <PauseSuggestion
          onOpenPause={openDeescalate}
          onDismiss={() => setDismissedSuggestion(true)}
        />
      )}

      {/* Interactive Avatar Banner & Single-Column Chat View Area */}
      <div className="flex-1 glass-card rounded-2xl p-4 sm:p-5 overflow-y-auto mb-3 flex flex-col justify-between space-y-4">
        
        {/* Interactive Companion Avatar Header */}
        <div className="p-4 bg-bg-primary/80 border border-border rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <MindMirrorAvatar
              expression={lastPersonaMessage?.avatar_expression || 'empathetic'}
              isThinking={isLoading}
              isSpeaking={isSpeakingTTS}
              size="md"
              showBubble={false}
            />
            <div>
              <span className="text-[10px] font-bold text-text-accent uppercase tracking-wider block">
                Practice Persona Partner
              </span>
              <h2 className="text-sm font-bold text-text-primary">
                {activeScenario?.scenarioId === 'accommodations'
                  ? 'Professor / Supervisor Persona'
                  : activeScenario?.scenarioId === 'plan_change'
                    ? 'Project Lead / Teammate Persona'
                    : activeScenario?.scenarioId === 'boundary'
                      ? 'Peer / Coworker Persona'
                      : 'Custom Rehearsal Persona'}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {isLoading
                  ? 'Analyzing context & building structured options...'
                  : isSpeakingTTS
                    ? 'Reading response aloud...'
                    : 'Attentive and ready for your response.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {messages.map((msg) => (
            <SegmentedMessage key={msg.id} message={msg} />
          ))}

          {/* MOTION-GATE: Static loading indicator */}
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

      {/* Phase 5 Static Pause Screen Modal */}
      <PausePanel
        isOpen={isDeescalateOpen}
        onClose={closeDeescalate}
        onRestartExchange={restartExchange}
      />
    </div>
  );
};
