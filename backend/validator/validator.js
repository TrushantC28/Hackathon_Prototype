/**
 * Validator
 * Runs all validation rules against parsed segments.
 */

const {
  checkMissingSegments,
  checkDateFormats,
  checkNumericFields,
  checkNPILength,
} = require('./rules');

/**
 * Validate parsed EDI segments.
 * @param {Array} segments - Array of parsed segment objects.
 * @returns {Object} Validation result with errors and summary.
 */
function validate(segments) {
  if (!segments || !Array.isArray(segments)) {
    return {
      valid: false,
      errors: [{
        rule: 'PARSE_ERROR',
        severity: 'error',
        segment: 'N/A',
        elementPosition: null,
        message: 'No valid segments provided for validation.',
      }],
      summary: { total: 1, errors: 1, warnings: 0 },
    };
  }

  const allErrors = [
    ...checkMissingSegments(segments),
    ...checkDateFormats(segments),
    ...checkNumericFields(segments),
    ...checkNPILength(segments),
  ];

  const errorCount = allErrors.filter(e => e.severity === 'error').length;
  const warningCount = allErrors.filter(e => e.severity === 'warning').length;

  return {
    valid: errorCount === 0,
    errors: allErrors,
    summary: {
      total: allErrors.length,
      errors: errorCount,
      warnings: warningCount,
    },
  };
}

module.exports = { validate };
