import React, { useState } from 'react';
import { soundscapes } from '../utils/SoundscapeGenerator';

/**
 * AmbientSoundWidget Component
 * Header/floating control bar for synthesized Web Audio soundscapes.
 * 100% offline, zero assets required.
 */
export const AmbientSoundWidget = () => {
  const [activeTrack, setActiveTrack] = useState(null);
  const [volume, setVolume] = useState(0.3);
  const [isOpen, setIsOpen] = useState(false);

  const TRACKS = [
    { id: 'rain', name: 'Soft Rain & Pink Noise', icon: '🌧️' },
    { id: 'alpha', name: '432Hz Alpha Waves', icon: '🧘' },
    { id: 'breeze', name: 'Forest Breeze', icon: '🍃' },
  ];

  const handleToggleTrack = (trackId) => {
    const isPlaying = soundscapes.playTrack(trackId);
    if (isPlaying) {
      setActiveTrack(trackId);
    } else {
      setActiveTrack(null);
    }
  };

  const handleStop = () => {
    soundscapes.stop();
    setActiveTrack(null);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    soundscapes.setVolume(vol);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer btn-press transition-colors ${
          activeTrack
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
            : 'bg-bg-primary text-text-secondary border-border hover:bg-bg-hover'
        }`}
        title="Synthesized Soothing Soundscapes (Web Audio)"
        aria-label="Soundscapes"
      >
        <span>{activeTrack ? '🎵' : '🎧'}</span>
        <span className="hidden sm:inline">
          {activeTrack ? `Playing ${activeTrack}` : 'Ambient Sound'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-64 max-w-[calc(100vw-32px)] p-4 bg-white border border-[#E5E0D3] rounded-2xl shadow-2xl z-50 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <span className="font-bold text-text-primary uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span>🎧</span> Soothing Soundscapes
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-primary"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-text-muted">
            Synthesized offline ambient audio to enhance focus and sensory calm.
          </p>

          <div className="space-y-1.5">
            {TRACKS.map((t) => {
              const isPlaying = activeTrack === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleToggleTrack(t.id)}
                  className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isPlaying
                      ? 'bg-accent-soft text-text-accent border-accent font-semibold'
                      : 'bg-bg-primary/80 border-border hover:bg-bg-hover text-text-secondary'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </span>
                  {isPlaying ? <span className="text-[10px] font-bold">▶ ON</span> : <span className="text-[10px] text-text-muted">Play</span>}
                </button>
              );
            })}
          </div>

          {/* Volume Control */}
          <div className="pt-2 border-t border-border/40 space-y-1">
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-bg-hover rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {activeTrack && (
            <button
              type="button"
              onClick={handleStop}
              className="w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold text-[11px] cursor-pointer text-center"
            >
              ⏹️ Stop Soundscape
            </button>
          )}
        </div>
      )}
    </div>
  );
};
