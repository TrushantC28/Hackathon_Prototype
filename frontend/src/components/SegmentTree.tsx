import { useState, useCallback } from 'react';
import type { SegmentTreeNode } from '../types';

interface SegmentTreeProps {
  tree: SegmentTreeNode;
}

const SEGMENT_COLORS: Record<string, string> = {
  // Envelope
  ISA: '#6366f1',
  IEA: '#6366f1',
  // Functional Group
  GS: '#8b5cf6',
  GE: '#8b5cf6',
  // Transaction Set
  ST: '#a78bfa',
  SE: '#a78bfa',
  // Header
  BHT: '#22d3ee',
  BGN: '#22d3ee',
  BPR: '#22d3ee',
  TRN: '#22d3ee',
  // Entity
  NM1: '#34d399',
  N1: '#34d399',
  N3: '#34d399',
  N4: '#34d399',
  PER: '#34d399',
  INS: '#34d399',
  // Reference
  REF: '#fbbf24',
  DMG: '#fbbf24',
  // Claims
  CLM: '#fb7185',
  CLP: '#fb7185',
  SV1: '#fb7185',
  SVC: '#fb7185',
  CAS: '#fb7185',
  // Date
  DTP: '#f472b6',
  DTM: '#f472b6',
  // Hierarchy
  HL: '#38bdf8',
  // Enrollment
  HD: '#c084fc',
};

function getSegmentColor(name: string): string {
  return SEGMENT_COLORS[name] || 'var(--text-secondary)';
}

function getNodeIcon(type: string): string {
  switch (type) {
    case 'root': return '📋';
    case 'envelope': return '📦';
    case 'functional_group': return '📁';
    case 'transaction_set': return '📄';
    default: return '▸';
  }
}

interface TreeNodeComponentProps {
  node: SegmentTreeNode;
  depth: number;
}

function TreeNodeComponent({ node, depth }: TreeNodeComponentProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const color = getSegmentColor(node.name);

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div
      style={{
        marginLeft: depth > 0 ? '20px' : '0',
        borderLeft: depth > 0 ? `1px solid ${color}22` : 'none',
      }}
    >
      <div
        id={`tree-node-${node.name}-${node.index ?? 'root'}`}
        onClick={toggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 10px',
          marginBottom: '2px',
          borderRadius: '8px',
          cursor: hasChildren || node.elements?.length ? 'pointer' : 'default',
          transition: 'all var(--transition-fast)',
          background: 'transparent',
          fontSize: '0.85rem',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(99, 102, 241, 0.06)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        {/* Expand/collapse indicator */}
        {(hasChildren || node.elements?.length) ? (
          <span
            style={{
              display: 'inline-flex',
              width: '16px',
              height: '16px',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              transition: 'transform var(--transition-fast)',
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            ▶
          </span>
        ) : (
          <span style={{ width: '16px', display: 'inline-block' }} />
        )}

        {/* Icon for container nodes */}
        {node.type !== 'segment' && (
          <span style={{ fontSize: '0.9rem' }}>{getNodeIcon(node.type)}</span>
        )}

        {/* Segment name badge */}
        <span
          style={{
            padding: '1px 8px',
            borderRadius: '4px',
            background: `${color}18`,
            color: color,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontWeight: 600,
            fontSize: '0.8rem',
            letterSpacing: '0.02em',
          }}
        >
          {node.name}
        </span>

        {/* Label for container nodes */}
        {node.label && node.type !== 'segment' && (
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            {node.label}
          </span>
        )}

        {/* Element count */}
        {node.elements && node.elements.length > 0 && (
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              marginLeft: 'auto',
            }}
          >
            {node.elements.length} elements
          </span>
        )}

        {/* Children count for containers */}
        {hasChildren && node.type !== 'segment' && (
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              marginLeft: 'auto',
            }}
          >
            {node.children.length} segments
          </span>
        )}
      </div>

      {/* Element details */}
      {isExpanded && node.elements && node.elements.length > 0 && (
        <div
          style={{
            marginLeft: '44px',
            padding: '6px 12px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            marginBottom: '4px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {node.elements.map((el, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '8px',
                padding: '2px 0',
                fontSize: '0.78rem',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              }}
            >
              <span style={{ color: 'var(--text-muted)', minWidth: '20px' }}>
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <span style={{ color: el ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {el || '(empty)'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Children */}
      {isExpanded && hasChildren && (
        <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {node.children.map((child, i) => (
            <TreeNodeComponent key={`${child.name}-${child.index ?? i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SegmentTree({ tree }: SegmentTreeProps) {
  const segmentCount = tree.children?.length || 0;

  return (
    <div className="glass-card animate-fade-in-up delay-2" style={{ padding: '24px', overflow: 'auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}>
            🌳
          </span>
          Segment Tree
        </h2>
        <span className="badge badge-info">{segmentCount} top-level</span>
      </div>

      <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
        <TreeNodeComponent node={tree} depth={0} />
      </div>
    </div>
  );
}
