import React from 'react';

/**
 * ConversationPaceBadge Component (Phase 5)
 * Simplified, neutral top-bar badge indicating observable conversation pace.
 * Strictly NO red/danger/alert colors.
 */
export const ConversationPaceBadge = ({ paceObj }) => {
  const pace = paceObj?.pace || (typeof paceObj === 'string' ? paceObj : 'Calm');

  const getPaceStyles = () => {
    switch (pace) {
      case 'Escalating':
        return 'bg-accent-soft text-text-accent border-accent/40 font-semibold';
      case 'Tense':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Uncertain':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Calm':
      default:
        return 'bg-bg-primary text-text-muted border-border';
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-colors ${getPaceStyles()}`}
      title="Observable interaction pace (derived from recent exchanges)"
    >
      <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
        Conversation Pace:
      </span>
      <span className="font-bold">{pace}</span>
    </div>
  );
};
