import type { AIExplanation } from '../types';

interface AIExplainerProps {
  explanation: AIExplanation | null;
  isLoading: boolean;
  onClose: () => void;
}

export default function AIExplainer({ explanation, isLoading, onClose }: AIExplainerProps) {
  if (!explanation && !isLoading) return null;

  return (
    <div
      id="ai-explainer-modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          animation: 'fadeInUp 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                animation: isLoading ? 'pulse-glow 2s infinite' : 'none',
              }}
            >
              🤖
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>AI Explanation</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Powered by X12Guard AI
              </p>
            </div>
          </div>

          <button
            id="close-ai-explainer"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(251, 113, 133, 0.15)';
              (e.currentTarget as HTMLElement).style.color = 'var(--accent-rose)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Analyzing error...
            </p>
          </div>
        ) : explanation ? (
          <div>
            {/* Status Badge */}
            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                🚧 {explanation.status}
              </span>
            </div>

            {/* Message */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid var(--border-color)',
                lineHeight: 1.7,
              }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {explanation.message}
              </p>
            </div>

            {/* Error Context */}
            {explanation.error && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Error Context
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                    {explanation.error.segment}
                  </span>
                  {' — '}
                  {explanation.error.message}
                </p>
              </div>
            )}

            {/* Timestamp */}
            <p
              style={{
                marginTop: '16px',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                textAlign: 'right',
              }}
            >
              {new Date(explanation.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
