import React, { useState, useEffect } from 'react';

/**
 * FocusReadingGuide Component
 * Interactive visual focus ruler overlay that follows cursor or scroll position
 * to assist users with Dyslexia and visual tracking differences.
 */
export const FocusReadingGuide = ({ isActive }) => {
  const [mouseY, setMouseY] = useState(200);

  useEffect(() => {
    if (!isActive) return;
    const handleMouseMove = (e) => {
      setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {/* Top Masking Shadow */}
      <div
        className="absolute top-0 left-0 right-0 bg-slate-950/40 backdrop-blur-[1px] transition-all duration-75"
        style={{ height: `${Math.max(0, mouseY - 24)}px` }}
      />

      {/* Highlight Reading Window */}
      <div
        className="absolute left-0 right-0 border-y-2 border-accent bg-accent-soft/20 transition-all duration-75 shadow-lg"
        style={{ top: `${Math.max(0, mouseY - 24)}px`, height: '48px' }}
      >
        <div className="absolute right-4 top-1 text-[10px] font-bold text-text-accent px-2 py-0.5 bg-bg-card rounded border border-accent/40 shadow-sm">
          🔍 Dyslexia Focus Line Guide
        </div>
      </div>

      {/* Bottom Masking Shadow */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-slate-950/40 backdrop-blur-[1px] transition-all duration-75"
        style={{ top: `${Math.max(0, mouseY + 24)}px` }}
      />
    </div>
  );
};
