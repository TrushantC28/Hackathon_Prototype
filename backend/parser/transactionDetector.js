/**
 * Transaction Detector
 * Reads the ST segment to determine whether the file is 837, 835, or 834.
 */

const TRANSACTION_TYPES = {
  '837': {
    code: '837',
    label: 'Healthcare Claim',
    description: 'Healthcare claim transaction used by providers to submit charges to payers.',
  },
  '835': {
    code: '835',
    label: 'Remittance Advice',
    description: 'Electronic remittance advice used by payers to explain claim payments.',
  },
  '834': {
    code: '834',
    label: 'Benefit Enrollment and Maintenance',
    description: 'Member enrollment and demographics transaction.',
  },
};

/**
 * Detects the transaction type from parsed segments.
 * @param {Array} segments - Array of parsed segment objects.
 * @returns {Object} - Transaction type info { code, label, description } or unknown.
 */
function detectTransactionType(segments) {
  const stSegment = segments.find(seg => seg.name === 'ST');

  if (!stSegment) {
    return {
      code: 'UNKNOWN',
      label: 'Unknown Transaction',
      description: 'No ST segment found in the EDI file.',
    };
  }

  // The first element after ST is the transaction set identifier code
  const typeCode = stSegment.elements[0];

  if (TRANSACTION_TYPES[typeCode]) {
    return { ...TRANSACTION_TYPES[typeCode] };
  }

  return {
    code: typeCode || 'UNKNOWN',
    label: `Unsupported Transaction (${typeCode})`,
    description: `Transaction type ${typeCode} is not currently supported. Supported types: 837, 835, 834.`,
  };
}

module.exports = { detectTransactionType, TRANSACTION_TYPES };
