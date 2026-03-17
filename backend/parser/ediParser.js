/**
 * EDI Parser
 * Orchestrates parsing — calls segmentParser and transactionDetector.
 * Returns a full structured JSON with metadata.
 */

const { parseSegments, buildSegmentTree } = require('./segmentParser');
const { detectTransactionType } = require('./transactionDetector');

/**
 * Parse raw EDI content and return structured result.
 * @param {string} rawEdi - Raw EDI file content.
 * @param {string} [filename] - Original filename.
 * @returns {Object} Parsed EDI result with segments, tree, transaction info, and metadata.
 */
function parseEdi(rawEdi, filename = 'unknown') {
  const segments = parseSegments(rawEdi);
  const transactionType = detectTransactionType(segments);
  const segmentTree = buildSegmentTree(segments);

  // Extract ISA metadata if available
  const isaSegment = segments.find(seg => seg.name === 'ISA');
  const metadata = {
    filename,
    totalSegments: segments.length,
    parsedAt: new Date().toISOString(),
  };

  if (isaSegment && isaSegment.elements.length >= 15) {
    metadata.senderId = (isaSegment.elements[5] || '').trim();
    metadata.receiverId = (isaSegment.elements[7] || '').trim();
    metadata.date = (isaSegment.elements[8] || '').trim();
    metadata.time = (isaSegment.elements[9] || '').trim();
    metadata.controlNumber = (isaSegment.elements[12] || '').trim();
  }

  return {
    metadata,
    transactionType,
    segments,
    segmentTree,
  };
}

module.exports = { parseEdi };
