import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';
import { analyzeDraftImpact } from '../../../backend/services/llm/impactAnalyzer.js';

/**
 * CommunicationPaths Component (Phase 4 Intent Translator)
 * Renders 3 Communication Paths (Direct, Balanced, Gentle), contextual hints,
 * impact descriptions, customization, and user-triggered "Review Draft" analysis.
 */
export const CommunicationPaths = ({ lastPersonaMessage, onSendMessage, isLoading }) => {
  const { lowStimulation } = useSensory();

  const responseOptions = (lastPersonaMessage && Array.isArray(lastPersonaMessage.response_options) && lastPersonaMessage.response_options.length > 0)
    ? lastPersonaMessage.response_options
    : [
        {
          id: 'direct',
          style: 'Direct',
          hint: 'Best when clear decisions matter.',
          message: 'I need a 24-hour written notice for schedule changes so I can process them effectively.',
          impact: 'Likely feels clear, concise, and efficient.'
        },
        {
          id: 'balanced',
          style: 'Balanced',
          hint: 'Best when you want clarity and warmth.',
          message: 'Thanks for bringing this up. Could we review a 24-hour buffer for schedule adjustments together?',
          impact: 'Balances clarity with warmth and natural tone.'
        },
        {
          id: 'gentle',
          style: 'Gentle',
          hint: 'Best when preserving the relationship is most important.',
          message: 'I really appreciate your support. If possible, having 24 hours advance notice would make a big difference.',
          impact: 'May feel reassuring and respectful while preserving warmth.'
        }
      ];

  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  // Advisory "Review Draft" feedback state
  const [impactFeedback, setImpactFeedback] = useState(null);

  const handleSelectOption = (option) => {
    setSelectedOptionId(option.id);
    setInputText(option.message);
    setIsCustomMode(false);
    setIsEdited(false);
    setImpactFeedback(null);
  };

  const handleCustomizeOption = (option) => {
    setSelectedOptionId(option.id);
    setInputText(option.message);
    setIsCustomMode(true);
    setIsEdited(true);
    setImpactFeedback(null);
  };

  const handleWriteMyOwn = () => {
    setSelectedOptionId('custom');
    setIsCustomMode(true);
    setInputText('');
    setIsEdited(false);
    setImpactFeedback(null);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    if (selectedOptionId && selectedOptionId !== 'custom') {
      setIsEdited(true);
    }
  };

  // User-triggered "Review Draft" action
  const handleReviewDraft = () => {
    if (!inputText.trim()) return;
    const assistantText = lastPersonaMessage?.segments?.map(s => s.text).join('') || '';
    const feedback = analyzeDraftImpact(inputText, assistantText);
    setImpactFeedback(feedback);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setSelectedOptionId(null);
    setIsEdited(false);
    setImpactFeedback(null);
  };

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-border/70 space-y-3">
      {/* Header & Philosophy */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            🧭 Communication Paths
          </span>
          <span className="text-[11px] text-text-muted block">
            Choose an approach below, customize it, or write your own. You remain in complete control.
          </span>
        </div>

        {isEdited && (
          <span className="text-[10px] bg-accent-soft text-text-accent font-bold px-2 py-0.5 rounded-full border border-accent/30">
            ✏️ Edited
          </span>
        )}
      </div>

      {/* 3 Communication Path Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {responseOptions.map((opt) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <div
              key={opt.id}
              className={`p-3.5 bg-bg-card rounded-xl border text-left flex flex-col justify-between space-y-2.5 transition-all ${
                lowStimulation ? 'transition-none' : 'duration-150'
              } ${
                isSelected
                  ? 'border-accent bg-accent-soft/30 ring-1 ring-accent/50 shadow-sm'
                  : 'border-border hover:border-accent/40 hover:bg-bg-hover'
              }`}
            >
              <div>
                {/* Header: Style Badge & Contextual Hint */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    opt.id === 'direct'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : opt.id === 'gentle'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-accent-soft text-text-accent border border-accent/30'
                  }`}>
                    {opt.style}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-text-accent font-semibold">Selected</span>
                  )}
                </div>

                {/* Contextual Hint */}
                <p className="text-[11px] font-medium text-text-muted italic mb-2">
                  {opt.hint || 'Suggested communication approach'}
                </p>

                {/* Suggested Message Quotation */}
                <p className="text-xs text-text-primary leading-relaxed font-normal bg-bg-primary/50 p-2 rounded-lg border border-border/50">
                  "{opt.message}"
                </p>
              </div>

              {/* Footer: Impact Line & Action Buttons */}
              <div className="pt-2 border-t border-border/40 space-y-2">
                <div className="text-[10px] text-text-muted flex items-start gap-1">
                  <span>💡</span>
                  <span className="leading-tight">{opt.impact}</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className="flex-1 py-1.5 px-2 bg-accent text-white hover:bg-accent-hover rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-border-focus btn-press cursor-pointer text-center"
                  >
                    Use
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCustomizeOption(opt)}
                    className="flex-1 py-1.5 px-2 bg-bg-primary hover:bg-bg-hover text-text-secondary border border-border rounded-lg text-xs font-medium focus:outline-none cursor-pointer text-center"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Write My Own Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleWriteMyOwn}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
            selectedOptionId === 'custom'
              ? 'bg-accent-soft text-text-accent border-accent'
              : 'bg-bg-primary text-text-secondary border-border hover:bg-bg-hover'
          }`}
        >
          ✍️ Write My Own Message
        </button>

        {isEdited && (
          <span className="text-[11px] text-text-muted italic">
            You modified a path. Click send when ready.
          </span>
        )}
      </div>

      {/* User Input & User-Triggered "Review Draft" Form */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-1">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            aria-label="Message Input"
            onChange={handleInputChange}
            placeholder={isCustomMode ? "Type your custom message..." : "Select a path above, customize it, or type here..."}
            disabled={isLoading}
            className="flex-1 p-3.5 bg-bg-input text-text-primary border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus disabled:opacity-50 shadow-sm"
          />

          {/* User-Triggered "Review Draft" Button */}
          {inputText.trim().length > 3 && (
            <button
              type="button"
              onClick={handleReviewDraft}
              title="Run advisory impact check on your draft"
              className="px-3 py-3.5 bg-bg-card hover:bg-bg-hover text-text-secondary border border-border rounded-xl text-xs font-semibold focus:outline-none cursor-pointer flex items-center gap-1"
            >
              🔍 Review Draft
            </button>
          )}

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`px-6 py-3.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer btn-press shadow-sm ${
              lowStimulation ? 'transition-none' : ''
            }`}
          >
            Send Message
          </button>
        </div>

        {/* User-Triggered "Review Draft" Feedback Panel */}
        {impactFeedback && (
          <div className={`p-3.5 bg-bg-card border border-accent/40 rounded-xl space-y-2 text-xs ${
            lowStimulation ? 'transition-none' : 'animate-fadeIn duration-150'
          }`}>
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <span className="font-bold text-text-accent uppercase tracking-wider text-[10px]">
                🔍 Draft Review (Advisory Only)
              </span>
              <span className="text-[10px] text-text-muted italic">
                Non-blocking feedback
              </span>
            </div>

            {/* Strengths & Advisory Concerns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-emerald-400 block text-[11px]">Strengths:</span>
                {impactFeedback.strengths.map((str, idx) => (
                  <p key={idx} className="text-text-primary text-[11px]">{str}</p>
                ))}
              </div>

              {impactFeedback.concerns.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-amber-400 block text-[11px]">Advisory Observations:</span>
                  {impactFeedback.concerns.map((con, idx) => (
                    <p key={idx} className="text-text-secondary text-[11px]">{con}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Communication Dimensions (Visual Bars - NO NUMERIC SCORES) */}
            <div className="pt-2 border-t border-border/40">
              <span className="font-semibold text-text-muted block text-[10px] uppercase tracking-wider mb-1.5">
                Communication Dimensions (Qualitative Levels):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <DimensionBar label="Clarity" level={impactFeedback.dimensions.clarity} />
                <DimensionBar label="Warmth" level={impactFeedback.dimensions.warmth} />
                <DimensionBar label="Assertiveness" level={impactFeedback.dimensions.assertiveness} />
                <DimensionBar label="Specificity" level={impactFeedback.dimensions.specificity} />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

/**
 * Visual Dimension Bar Component (Strictly NO NUMERIC SCORES)
 */
const DimensionBar = ({ label, level }) => {
  const fillWidth = level === 'very_high' ? 'w-full' : level === 'high' ? 'w-3/4' : 'w-1/2';
  const labelText = level === 'very_high' ? 'Very High' : level === 'high' ? 'High' : 'Moderate';

  return (
    <div className="p-1.5 bg-bg-primary/60 rounded-lg border border-border/40">
      <div className="flex justify-between text-[10px] text-text-muted mb-1">
        <span>{label}</span>
        <span className="font-semibold text-text-secondary">{labelText}</span>
      </div>
      <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden">
        <div className={`bg-accent h-full rounded-full ${fillWidth}`} />
      </div>
    </div>
  );
};
