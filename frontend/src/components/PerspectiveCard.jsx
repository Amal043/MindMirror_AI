import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * PerspectiveCard Component (Phase 5 Conversation Regulation & Perspective)
 * Interactive expandable component displaying cached perspective insights in 3 structured sections:
 * - Possible Priorities
 * - Possible Constraints
 * - Possible Uncertainties
 */
export const PerspectiveCard = ({ perspective }) => {
  const { lowStimulation } = useSensory();
  const [isOpen, setIsOpen] = useState(false);

  if (!perspective) return null;

  const priorities = perspective.priorities || ['They may want to keep communication clear and on schedule.'];
  const constraints = perspective.constraints || ['They may need approval before making decisions.'];
  const uncertainties = perspective.uncertainties || ["It's possible they still need more information."];

  return (
    <div className="mt-2 text-left">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        title="View possible partner perspectives (uncertainty-aware)"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer btn-press transition-colors ${
          isOpen
            ? 'bg-accent-soft text-text-accent border-accent'
            : 'bg-bg-primary/80 hover:bg-bg-hover text-text-secondary border-border'
        }`}
      >
        <span>👁️ How might they see this?</span>
        <span className="text-[10px] text-text-muted">{isOpen ? '▲ Hide' : '▼ View'}</span>
      </button>

      {isOpen && (
        <div
          className={`mt-2.5 p-3.5 bg-bg-card border border-accent/40 rounded-xl space-y-3 shadow-md text-xs ${
            lowStimulation ? 'transition-none' : 'animate-fadeIn duration-150'
          }`}
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
            <span className="font-bold text-text-accent uppercase tracking-wider text-[10px]">
              Perspective Insights (Uncertainty-Aware)
            </span>
            <span className="text-[10px] text-text-muted italic">
              Cached • Possibilities only
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Possible Priorities */}
            <div className="space-y-1 bg-bg-primary/50 p-2.5 rounded-lg border border-border/40">
              <span className="font-bold text-text-primary block text-[11px]">
                🎯 Possible Priorities:
              </span>
              {priorities.map((item, idx) => (
                <p key={idx} className="text-text-secondary text-[11px] leading-relaxed">
                  • {item}
                </p>
              ))}
            </div>

            {/* 2. Possible Constraints */}
            <div className="space-y-1 bg-bg-primary/50 p-2.5 rounded-lg border border-border/40">
              <span className="font-bold text-text-primary block text-[11px]">
                ⚙️ Possible Constraints:
              </span>
              {constraints.map((item, idx) => (
                <p key={idx} className="text-text-secondary text-[11px] leading-relaxed">
                  • {item}
                </p>
              ))}
            </div>

            {/* 3. Possible Uncertainties */}
            <div className="space-y-1 bg-bg-primary/50 p-2.5 rounded-lg border border-border/40">
              <span className="font-bold text-text-primary block text-[11px]">
                ❓ Possible Uncertainties:
              </span>
              {uncertainties.map((item, idx) => (
                <p key={idx} className="text-text-secondary text-[11px] leading-relaxed">
                  • {item}
                </p>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-text-muted pt-1 border-t border-border/40">
            * These are possible situational factors, not claims about personal feelings.
          </div>
        </div>
      )}
    </div>
  );
};
