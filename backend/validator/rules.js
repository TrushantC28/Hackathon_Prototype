/**
 * Validation Rules
 * Defines rules for validating EDI segments.
 */

// Required envelope segments that must be present
const REQUIRED_SEGMENTS = ['ISA', 'GS', 'ST', 'SE', 'GE', 'IEA'];

/**
 * Check for missing required segments.
 */
function checkMissingSegments(segments) {
  const errors = [];
  const presentNames = new Set(segments.map(s => s.name));

  for (const required of REQUIRED_SEGMENTS) {
    if (!presentNames.has(required)) {
      errors.push({
        rule: 'MISSING_SEGMENT',
        severity: 'error',
        segment: required,
        elementPosition: null,
        message: `Required segment "${required}" is missing from the EDI file.`,
      });
    }
  }

  return errors;
}

/**
 * Validate date format in DTM segments.
 * Expected format: CCYYMMDD (8 digits) or CCYYMMDDHHMMSS (14 digits).
 */
function checkDateFormats(segments) {
  const errors = [];

  segments
    .filter(seg => seg.name === 'DTM')
    .forEach(seg => {
      // Element index 1 is the date value (after qualifier)
      const dateValue = seg.elements[1];
      if (dateValue) {
        const isValidDate8 = /^\d{8}$/.test(dateValue);
        const isValidDate14 = /^\d{14}$/.test(dateValue);

        if (!isValidDate8 && !isValidDate14) {
          errors.push({
            rule: 'INVALID_DATE',
            severity: 'error',
            segment: `DTM (index ${seg.index})`,
            elementPosition: 2,
            message: `Invalid date format "${dateValue}". Expected CCYYMMDD (8 digits) or CCYYMMDDHHMMSS (14 digits).`,
          });
        } else if (isValidDate8) {
          // Additional check: valid month/day
          const year = parseInt(dateValue.substring(0, 4));
          const month = parseInt(dateValue.substring(4, 6));
          const day = parseInt(dateValue.substring(6, 8));

          if (month < 1 || month > 12) {
            errors.push({
              rule: 'INVALID_DATE',
              severity: 'error',
              segment: `DTM (index ${seg.index})`,
              elementPosition: 2,
              message: `Invalid month "${month}" in date "${dateValue}". Month must be 01–12.`,
            });
          } else if (day < 1 || day > 31) {
            errors.push({
              rule: 'INVALID_DATE',
              severity: 'error',
              segment: `DTM (index ${seg.index})`,
              elementPosition: 2,
              message: `Invalid day "${day}" in date "${dateValue}". Day must be 01–31.`,
            });
          }
        }
      }
    });

  return errors;
}

/**
 * Validate numeric/monetary fields in CLM and CLP segments.
 */
function checkNumericFields(segments) {
  const errors = [];

  // CLM segment: element 1 (index 1) is the monetary amount
  segments
    .filter(seg => seg.name === 'CLM')
    .forEach(seg => {
      const amount = seg.elements[1];
      if (amount && isNaN(parseFloat(amount))) {
        errors.push({
          rule: 'INVALID_NUMERIC',
          severity: 'error',
          segment: `CLM (index ${seg.index})`,
          elementPosition: 2,
          message: `Invalid monetary amount "${amount}" in CLM segment. Expected a numeric value.`,
        });
      }
    });

  // CLP segment: element 2 (index 2) and element 3 (index 3) are monetary amounts
  segments
    .filter(seg => seg.name === 'CLP')
    .forEach(seg => {
      const chargeAmount = seg.elements[2];
      const paymentAmount = seg.elements[3];

      if (chargeAmount && isNaN(parseFloat(chargeAmount))) {
        errors.push({
          rule: 'INVALID_NUMERIC',
          severity: 'error',
          segment: `CLP (index ${seg.index})`,
          elementPosition: 3,
          message: `Invalid charge amount "${chargeAmount}" in CLP segment. Expected a numeric value.`,
        });
      }

      if (paymentAmount && isNaN(parseFloat(paymentAmount))) {
        errors.push({
          rule: 'INVALID_NUMERIC',
          severity: 'error',
          segment: `CLP (index ${seg.index})`,
          elementPosition: 4,
          message: `Invalid payment amount "${paymentAmount}" in CLP segment. Expected a numeric value.`,
        });
      }
    });

  return errors;
}

/**
 * Validate NPI (National Provider Identifier) in NM1 segments.
 * NPI is in element position 9 (index 8) and must be exactly 10 digits.
 */
function checkNPILength(segments) {
  const errors = [];

  segments
    .filter(seg => seg.name === 'NM1')
    .forEach(seg => {
      // Element index 8 is the NPI (element position 9)
      const npi = seg.elements[8];
      if (npi && npi.trim() !== '') {
        if (!/^\d{10}$/.test(npi.trim())) {
          errors.push({
            rule: 'INVALID_NPI',
            severity: 'warning',
            segment: `NM1 (index ${seg.index})`,
            elementPosition: 9,
            message: `Invalid NPI "${npi}". NPI must be exactly 10 digits.`,
          });
        }
      }
    });

  return errors;
}

module.exports = {
  checkMissingSegments,
  checkDateFormats,
  checkNumericFields,
  checkNPILength,
  REQUIRED_SEGMENTS,
};
