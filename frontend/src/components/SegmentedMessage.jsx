import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * SegmentedMessage Component (Phase 3 Interactive Annotations)
 * Renders persona and user messages using ordered segments.
 * Tapping an annotated phrase reveals a hedged inline subtext explanation card.
 */
export const SegmentedMessage = ({ message }) => {
  const { lowStimulation } = useSensory();
  const isPersona = message.sender === 'persona';
  const segments = message.segments || [{ text: message.text || '', annotations: [] }];

  // Track expanded state for annotations by key: `segIdx-annIdx`
  const [expandedAnnotations, setExpandedAnnotations] = useState({});

  const toggleAnnotation = (segIdx) => {
    setExpandedAnnotations(prev => ({
      ...prev,
      [segIdx]: !prev[segIdx]
    }));
  };

  return (
    <div className={`flex flex-col mb-4 ${isPersona ? 'items-start' : 'items-end'}`}>
      {/* Sender Header */}
      <div className="flex items-center space-x-2 mb-1 px-1 text-xs text-text-muted">
        <span className="font-semibold">
          {isPersona ? 'Practice Partner (Persona)' : 'You (User)'}
        </span>
        {message.timestamp && (
          <span>• {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        )}
      </div>

      {/* Message Bubble Container */}
      <div
        className={`max-w-2xl w-full p-4.5 rounded-2xl border text-sm sm:text-base leading-relaxed ${
          isPersona
            ? 'glass-card text-text-primary rounded-tl-none'
            : 'bg-accent-soft border-accent/30 text-text-primary rounded-tr-none'
        }`}
      >
        {/* Render Ordered Segments */}
        <div className="whitespace-pre-wrap">
          {segments.map((segment, segIdx) => {
            const hasAnnotations = Array.isArray(segment.annotations) && segment.annotations.length > 0;
            const ann = hasAnnotations ? segment.annotations[0] : null;
            const isExpanded = !!expandedAnnotations[segIdx];

            if (!hasAnnotations) {
              return <span key={segIdx}>{segment.text}</span>;
            }

            return (
              <span key={segIdx} className="inline-block relative">
                {/* Annotated Highlighted Phrase with Subtle Dashed Underline */}
                <button
                  type="button"
                  onClick={() => toggleAnnotation(segIdx)}
                  aria-expanded={isExpanded}
                  title="Tap to reveal possible subtext interpretation"
                  className={`inline border-b-2 border-dashed border-accent text-text-primary bg-accent-soft/40 hover:bg-accent-soft rounded px-1 py-0.5 mx-0.5 cursor-pointer font-medium focus:outline-none focus:ring-1 focus:ring-border-focus btn-press ${
                    isExpanded ? 'bg-accent-soft ring-1 ring-accent' : ''
                  }`}
                >
                  {segment.text}
                  <sup className="ml-1 text-[10px] text-text-accent font-bold">💡</sup>
                </button>

                {/* Inline Expandable Explanation Card */}
                {isExpanded && ann && (
                  <div
                    className={`my-2 p-3 bg-bg-card border border-accent/40 rounded-xl shadow-md text-xs space-y-1 block text-left ${
                      lowStimulation ? 'transition-none' : 'transition-opacity duration-150 animate-fadeIn'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-accent uppercase tracking-wider text-[10px] px-2 py-0.5 bg-accent-soft rounded-full">
                        {ann.title || 'Possible Interpretation'}
                      </span>
                      <span className="text-[10px] text-text-muted italic">
                        Hedged Possibility
                      </span>
                    </div>

                    <p className="text-text-primary leading-relaxed font-normal pt-1">
                      "{ann.explanation}"
                    </p>

                    <div className="text-[10px] text-text-muted pt-1 border-t border-border/50 flex justify-between">
                      <span>Tap phrase again to hide</span>
                      <span>Not mind-reading • Interpretation only</span>
                    </div>
                  </div>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
