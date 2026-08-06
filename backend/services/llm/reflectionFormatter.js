/**
 * Reflection Formatter Utility
 * Formats validated JSON reflection + session timeline event metadata into presentation-ready debrief object.
 */

export function formatReflectionDebrief(validatedReflection, sessionMetadata = {}) {
  const {
    scenarioId = 'accommodations',
    startTime = new Date().toISOString(),
    exchanges = 3,
    restartedExchanges = 0,
    pauseCount = 0,
    perspectiveViews = 0,
    pathsUsed = ['Balanced', 'Gentle']
  } = sessionMetadata;

  // Construct visual timeline events
  const timelineEvents = [
    { title: 'Started Session', type: 'start', timestamp: '00:00' },
  ];

  if (perspectiveViews > 0) {
    timelineEvents.push({ title: 'Perspective Viewed', type: 'perspective', details: `${perspectiveViews} view(s)` });
  }
  if (pathsUsed && pathsUsed.length > 0) {
    timelineEvents.push({ title: 'Communication Path Selected', type: 'path', details: pathsUsed.join(', ') });
  }
  if (pauseCount > 0) {
    timelineEvents.push({ title: 'Pause Used', type: 'pause', details: `${pauseCount} pause(s)` });
  }
  if (restartedExchanges > 0) {
    timelineEvents.push({ title: 'Restarted Exchange', type: 'restart', details: `${restartedExchanges} exchange(s)` });
  }

  timelineEvents.push({ title: 'Completed Practice', type: 'finish', timestamp: 'Finish' });

  return {
    scenario_id: scenarioId,
    timestamp: new Date().toISOString(),
    session_summary: {
      exchanges,
      restarted_exchanges: restartedExchanges,
      pause_count: pauseCount,
      perspective_views: perspectiveViews,
      paths_used: Array.from(new Set(pathsUsed))
    },
    reflection: validatedReflection,
    timeline: timelineEvents
  };
}
