import type { ValidationError, ValidationResult } from '../types';

interface ErrorReportProps {
  result: ValidationResult;
  onExplainError: (error: ValidationError) => void;
}

export default function ErrorReport({ result, onExplainError }: ErrorReportProps) {
  return (
    <div className="glass-card animate-fade-in-up delay-3" style={{ padding: '24px' }}>
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
            background: result.valid
              ? 'linear-gradient(135deg, #34d399, #22d3ee)'
              : 'linear-gradient(135deg, #fb7185, #fbbf24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}>
            {result.valid ? '✓' : '⚠'}
          </span>
          Validation Report
        </h2>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: result.summary.total > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
            }}
          >
            {result.summary.total}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Issues
          </div>
        </div>
        <div
          style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
            {result.summary.errors}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Errors
          </div>
        </div>
        <div
          style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
            {result.summary.warnings}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Warnings
          </div>
        </div>
      </div>

      {/* Success message */}
      {result.valid && result.errors.length === 0 && (
        <div
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(52, 211, 153, 0.08)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
          <p style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
            All validations passed!
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            No errors or warnings detected in this EDI file.
          </p>
        </div>
      )}

      {/* Error List */}
      {result.errors.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
          {result.errors.map((err, index) => (
            <div
              key={index}
              id={`error-item-${index}`}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.2)',
                border: `1px solid ${err.severity === 'error'
                  ? 'rgba(251, 113, 133, 0.15)'
                  : 'rgba(251, 191, 36, 0.15)'}`,
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  err.severity === 'error'
                    ? 'rgba(251, 113, 133, 0.4)'
                    : 'rgba(251, 191, 36, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  err.severity === 'error'
                    ? 'rgba(251, 113, 133, 0.15)'
                    : 'rgba(251, 191, 36, 0.15)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className={`badge badge-${err.severity === 'error' ? 'error' : 'warning'}`}>
                  {err.severity}
                </span>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.78rem',
                    color: 'var(--accent-cyan)',
                    background: 'rgba(34, 211, 238, 0.08)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {err.segment}
                </span>
                {err.elementPosition && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Element {err.elementPosition}
                  </span>
                )}
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    background: 'rgba(148, 163, 184, 0.1)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    marginLeft: 'auto',
                  }}
                >
                  {err.rule}
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {err.message}
              </p>

              <button
                id={`explain-btn-${index}`}
                onClick={() => onExplainError(err)}
                style={{
                  marginTop: '8px',
                  padding: '4px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(99, 102, 241, 0.08)',
                  color: 'var(--accent-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(99, 102, 241, 0.18)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(99, 102, 241, 0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                }}
              >
                <span>🤖</span>
                Explain Error
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
