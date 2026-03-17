/**
 * Segment Parser
 * Splits raw EDI text into structured segment objects.
 * Segments are separated by "~" and elements within segments by "*".
 */

function parseSegments(rawEdi) {
  if (!rawEdi || typeof rawEdi !== 'string') {
    throw new Error('Invalid EDI input: expected a non-empty string');
  }

  // Normalize line endings and trim
  const cleaned = rawEdi.replace(/\r\n/g, '').replace(/\n/g, '').trim();

  // Split by segment terminator "~"
  const rawSegments = cleaned.split('~').filter(seg => seg.trim() !== '');

  const segments = rawSegments.map((seg, index) => {
    const trimmed = seg.trim();
    const elements = trimmed.split('*');
    const name = elements[0] || '';

    return {
      index,
      name: name.toUpperCase(),
      elements: elements.slice(1),
      raw: trimmed,
    };
  });

  return segments;
}

/**
 * Groups segments into a hierarchical structure based on envelope/functional group/transaction set.
 */
function buildSegmentTree(segments) {
  const tree = {
    type: 'root',
    label: 'EDI Document',
    children: [],
  };

  let currentEnvelope = null;
  let currentFunctionalGroup = null;
  let currentTransactionSet = null;

  for (const segment of segments) {
    const node = {
      type: 'segment',
      name: segment.name,
      elements: segment.elements,
      index: segment.index,
      raw: segment.raw,
      children: [],
    };

    switch (segment.name) {
      case 'ISA':
        currentEnvelope = {
          type: 'envelope',
          label: 'Interchange Envelope (ISA/IEA)',
          name: 'ISA',
          elements: segment.elements,
          index: segment.index,
          children: [],
        };
        tree.children.push(currentEnvelope);
        break;

      case 'IEA':
        if (currentEnvelope) {
          currentEnvelope.children.push(node);
          currentEnvelope = null;
        } else {
          tree.children.push(node);
        }
        break;

      case 'GS':
        currentFunctionalGroup = {
          type: 'functional_group',
          label: 'Functional Group (GS/GE)',
          name: 'GS',
          elements: segment.elements,
          index: segment.index,
          children: [],
        };
        if (currentEnvelope) {
          currentEnvelope.children.push(currentFunctionalGroup);
        } else {
          tree.children.push(currentFunctionalGroup);
        }
        break;

      case 'GE':
        if (currentFunctionalGroup) {
          currentFunctionalGroup.children.push(node);
          currentFunctionalGroup = null;
        } else if (currentEnvelope) {
          currentEnvelope.children.push(node);
        } else {
          tree.children.push(node);
        }
        break;

      case 'ST':
        currentTransactionSet = {
          type: 'transaction_set',
          label: `Transaction Set (ST/SE)`,
          name: 'ST',
          elements: segment.elements,
          index: segment.index,
          children: [],
        };
        if (currentFunctionalGroup) {
          currentFunctionalGroup.children.push(currentTransactionSet);
        } else if (currentEnvelope) {
          currentEnvelope.children.push(currentTransactionSet);
        } else {
          tree.children.push(currentTransactionSet);
        }
        break;

      case 'SE':
        if (currentTransactionSet) {
          currentTransactionSet.children.push(node);
          currentTransactionSet = null;
        } else if (currentFunctionalGroup) {
          currentFunctionalGroup.children.push(node);
        } else {
          tree.children.push(node);
        }
        break;

      default:
        if (currentTransactionSet) {
          currentTransactionSet.children.push(node);
        } else if (currentFunctionalGroup) {
          currentFunctionalGroup.children.push(node);
        } else if (currentEnvelope) {
          currentEnvelope.children.push(node);
        } else {
          tree.children.push(node);
        }
        break;
    }
  }

  return tree;
}

module.exports = { parseSegments, buildSegmentTree };
