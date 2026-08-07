import React from 'react';
import { useSensory } from '../context/SensoryContext';

export const ProgressScreen = () => {
  const { sessionHistory, userStats, user, navigateTo, lowStimulation } = useSensory();

  const totalSessions = userStats?.completedSessionsCount || sessionHistory.length;
  const totalExchanges = userStats?.totalMessagesSent || sessionHistory.reduce((acc, curr) => acc + (curr.exchanges || 0), 0);
  const totalMinutes = userStats?.totalTimeSpentMinutes || sessionHistory.reduce((acc, curr) => acc + (curr.durationMin || 0), 0);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 text-left flex flex-wrap items-center justify-between gap-6 relative overflow-hidden shadow-md">
        
        {/* Soft Ambient Glow Halo */}
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none opacity-20"
          style={{ background: 'var(--accent-gradient)' }}
        />

        <div>
          <div className="inline-block px-3 py-1 bg-accent-soft text-text-accent text-xs font-semibold rounded-full mb-3 border border-accent/20">
            {user ? `🌸 ${user.name}'s Personal Journal` : '🌱 Mechanics, Not Grades'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            Practice Dashboard &amp; History
          </h1>
          <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
            Real-time practice metrics saved to MongoDB Atlas Cloud. MindMirror AI measures your engagement and time spent—never letter grades or evaluation scores.
          </p>
        </div>

        <button
          onClick={() => navigateTo('practice')}
          className={`px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-border-focus btn-press ${
            lowStimulation ? 'transition-none' : ''
          }`}
        >
          New Practice Session &rarr;
        </button>
      </div>

      {/* Overview Stat Cards (No numerical scores/grades) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 text-left space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Sessions Completed
            </span>
            <span className="text-lg">🎯</span>
          </div>
          <span className="text-3xl font-extrabold text-text-primary block">
            {totalSessions}
          </span>
          <span className="text-xs text-text-muted block">Rehearsal sessions finished</span>
        </div>

        <div className="glass-card rounded-2xl p-6 text-left space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Message Exchanges
            </span>
            <span className="text-lg">💬</span>
          </div>
          <span className="text-3xl font-extrabold text-text-primary block">
            {totalExchanges}
          </span>
          <span className="text-xs text-text-muted block">Responses practiced</span>
        </div>

        <div className="glass-card rounded-2xl p-6 text-left space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Time Spent Practicing
            </span>
            <span className="text-lg">⏱️</span>
          </div>
          <span className="text-3xl font-extrabold text-text-primary block">
            ~{totalMinutes} min
          </span>
          <span className="text-xs text-text-muted block">Low-pressure rehearsal time</span>
        </div>
      </div>

      {/* Session History Table / List */}
      <div className="glass-card rounded-2xl p-6 space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-lg font-bold text-text-primary">
            Scenario Rehearsal Log
          </h2>
          <span className="text-xs text-text-muted">Sorted by recent</span>
        </div>

        {sessionHistory.length === 0 ? (
          <p className="text-sm text-text-muted py-6 text-center">
            No completed sessions yet. Start your first scenario from the Practice page!
          </p>
        ) : (
          <div className="space-y-4">
            {sessionHistory.map((item) => (
              <div
                key={item.id}
                className={`p-4.5 bg-bg-primary/90 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover ${
                  lowStimulation ? 'transition-none' : ''
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[11px] font-bold text-text-accent px-2.5 py-0.5 bg-accent-soft rounded-full">
                      ✓ {item.status}
                    </span>
                    <span className="text-xs text-text-muted">• {item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary">
                    {item.title}
                  </h3>

                  <p className="text-xs text-text-secondary mt-1">
                    {item.notes}
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-xs font-semibold text-text-muted border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                  <span className="px-2.5 py-1 bg-bg-card rounded-lg border border-border">
                    {item.exchanges} exchanges
                  </span>
                  <span className="px-2.5 py-1 bg-bg-card rounded-lg border border-border">
                    ~{item.durationMin} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
};
