/**
 * Perspective Insights Service
 * Generates hedged partner perspective insights in 3 structured sections:
 * - Possible Priorities
 * - Possible Constraints
 * - Possible Uncertainties
 * Always uncertainty-aware. Never claims certainty or speculates on hidden feelings.
 */

/**
 * Creates default fallback perspective insights for scenario types
 * @param {string} scenarioId 
 * @returns {object} Structured perspective payload
 */
export function createDefaultPerspective(scenarioId = 'accommodations') {
  if (scenarioId === 'boundary') {
    return {
      priorities: ['They may want to ensure tasks are completed promptly.'],
      constraints: ['They may be under pressure to deliver project outcomes.'],
      uncertainties: ["It's possible they haven't realized your current workload capacity."]
    };
  }

  if (scenarioId === 'plan_change') {
    return {
      priorities: ['They may be trying to align with sudden team priority shifts.'],
      constraints: ['They may have limited flexibility in schedule timelines.'],
      uncertainties: ["It's possible they haven't considered transition steps for you."]
    };
  }

  return {
    priorities: ['They may want to maintain academic/workplace standards while supporting you.'],
    constraints: ['They may need manager or departmental approval before agreeing.'],
    uncertainties: ["It's possible they still need specific details about your preferred format."]
  };
}

/**
 * Validates and formats perspective insights object
 * @param {object} perspectiveObj 
 * @param {string} scenarioId 
 * @returns {object} Validated perspective object with 3 sections
 */
export function validatePerspectivePayload(perspectiveObj, scenarioId = 'accommodations') {
  const fallback = createDefaultPerspective(scenarioId);

  if (!perspectiveObj || typeof perspectiveObj !== 'object') {
    return fallback;
  }

  const sanitizeList = (list, defaultList, prefix) => {
    if (!Array.isArray(list) || list.length === 0) return defaultList;
    return list.slice(0, 2).map(item => {
      let str = String(item).trim();
      const lower = str.toLowerCase();
      if (!lower.startsWith('they may') && !lower.startsWith('it\'s possible') && !lower.startsWith('they might')) {
        str = `${prefix} ${str.charAt(0).toLowerCase()}${str.slice(1)}`;
      }
      return str;
    });
  };

  return {
    priorities: sanitizeList(perspectiveObj.priorities, fallback.priorities, 'They may want to'),
    constraints: sanitizeList(perspectiveObj.constraints, fallback.constraints, 'They may be constrained by'),
    uncertainties: sanitizeList(perspectiveObj.uncertainties, fallback.uncertainties, "It's possible that")
  };
}
