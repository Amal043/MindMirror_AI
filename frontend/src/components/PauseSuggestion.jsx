import React from 'react';

/**
 * PauseSuggestion Component (Phase 5 Guidance Banner)
 * Displayed once per escalation event when conversation pace reaches Escalating.
 * Never interrupts typing or blocks submission.
 */
export const PauseSuggestion = ({ onOpenPause, onDismiss }) => {
  return (
    <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs text-text-primary animate-fadeIn">
      <div className="flex items-center gap-2">
        <span className="text-base">💡</span>
        <span>
          <strong>Pacing Guidance:</strong> You can continue, or pause for a moment before replying.
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onOpenPause}
          className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
        >
          Pause Now
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss guidance"
          className="px-2 py-1 bg-transparent hover:bg-bg-hover text-text-muted text-xs rounded-lg cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
