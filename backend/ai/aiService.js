/**
 * AI Service (Placeholder)
 * Returns a placeholder message for AI explanation feature.
 */

/**
 * Get AI explanation for a validation error.
 * In the full version, this would call an LLM to analyze the EDI segment.
 * @param {Object} error - The validation error object.
 * @param {Object} segment - The related EDI segment.
 * @returns {Object} AI explanation response.
 */
function getExplanation(error, segment) {
  return {
    status: 'placeholder',
    message:
      'AI explanation feature is currently under development. ' +
      'In the full version, this assistant will analyze the EDI segment and provide a plain-language ' +
      'explanation and suggested fixes.',
    error: error || null,
    segment: segment || null,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { getExplanation };
