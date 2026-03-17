import { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import SegmentTree from './components/SegmentTree';
import ErrorReport from './components/ErrorReport';
import AIExplainer from './components/AIExplainer';
import { uploadFile, validateSegments, getAIExplanation } from './services/api';
import type { ParsedEDI, ValidationResult, ValidationError, AIExplanation } from './types';

export default function App() {
  const [parsedData, setParsedData] = useState<ParsedEDI | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setParsedData(null);
    setValidationResult(null);
    setAiExplanation(null);

    try {
      // Step 1: Upload and parse
      const uploadRes = await uploadFile(file);
      if (!uploadRes.success || !uploadRes.data) {
        setUploadError(uploadRes.error || 'Failed to parse EDI file.');
        setIsUploading(false);
        return;
      }
      setParsedData(uploadRes.data);
      setIsUploading(false);

      // Step 2: Validate
      setIsValidating(true);
      const validateRes = await validateSegments(uploadRes.data.segments);
      if (validateRes.success && validateRes.data) {
        setValidationResult(validateRes.data);
      }
      setIsValidating(false);
    } catch (err) {
      setUploadError('Network error. Make sure the backend server is running.');
      setIsUploading(false);
      setIsValidating(false);
    }
  }, []);

  const handleExplainError = useCallback(async (error: ValidationError) => {
    setIsExplaining(true);
    setAiExplanation(null);
    try {
      const res = await getAIExplanation(error);
      if (res.success && res.data) {
        setAiExplanation(res.data);
      }
    } catch {
      setAiExplanation({
        status: 'error',
        message: 'Failed to get AI explanation. Please try again.',
        error: null,
        segment: null,
        timestamp: new Date().toISOString(),
      });
    }
    setIsExplaining(false);
  }, []);

  const handleCloseExplainer = useCallback(() => {
    setAiExplanation(null);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(10, 14, 26, 0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              🛡️
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                X12Guard
              </h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                Healthcare EDI Parser & Validator
              </p>
            </div>
          </div>

          {parsedData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="badge badge-info">
                {parsedData.transactionType.code}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {parsedData.transactionType.label}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Upload Section */}
        {!parsedData && (
          <div style={{ maxWidth: '600px', margin: '80px auto 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-fade-in-up">
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: '12px',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Parse & Validate EDI Files
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Upload your healthcare EDI files to parse X12 segments, detect transaction types,
                and run validation checks.
              </p>
            </div>

            <FileUpload onFileUpload={handleFileUpload} isLoading={isUploading} />

            {/* Supported transactions */}
            <div
              className="animate-fade-in-up delay-2"
              style={{
                marginTop: '32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}
            >
              {[
                { code: '837', label: 'Healthcare Claims', icon: '💊' },
                { code: '835', label: 'Remittance Advice', icon: '💰' },
                { code: '834', label: 'Enrollment', icon: '👥' },
              ].map((tx) => (
                <div
                  key={tx.code}
                  className="glass-card"
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{tx.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                    {tx.code}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {tx.label}
                  </div>
                </div>
              ))}
            </div>

            {uploadError && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(251, 113, 133, 0.1)',
                  border: '1px solid rgba(251, 113, 133, 0.2)',
                  color: 'var(--accent-rose)',
                  fontSize: '0.85rem',
                }}
              >
                ⚠️ {uploadError}
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {parsedData && (
          <div>
            {/* Metadata bar */}
            <div
              className="glass-card animate-fade-in-up"
              style={{
                padding: '16px 24px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    File
                  </span>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: 'monospace' }}>
                    {parsedData.metadata.filename}
                  </p>
                </div>
                <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Segments
                  </span>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    {parsedData.metadata.totalSegments}
                  </p>
                </div>
                {parsedData.metadata.senderId && (
                  <>
                    <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Sender
                      </span>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: 'monospace' }}>
                        {parsedData.metadata.senderId}
                      </p>
                    </div>
                  </>
                )}
                {parsedData.metadata.receiverId && (
                  <>
                    <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Receiver
                      </span>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: 'monospace' }}>
                        {parsedData.metadata.receiverId}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <button
                id="upload-new-file-btn"
                onClick={() => {
                  setParsedData(null);
                  setValidationResult(null);
                  setAiExplanation(null);
                  setUploadError(null);
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(99, 102, 241, 0.08)',
                  color: 'var(--accent-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(99, 102, 241, 0.18)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(99, 102, 241, 0.08)';
                }}
              >
                📄 Upload New File
              </button>
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
              {/* Left: Segment Tree */}
              <SegmentTree tree={parsedData.segmentTree} />

              {/* Right: Validation Report */}
              {isValidating ? (
                <div className="glass-card animate-fade-in-up delay-3" style={{ padding: '48px', textAlign: 'center' }}>
                  <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', margin: '0 auto 16px' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>Running validation...</p>
                </div>
              ) : validationResult ? (
                <ErrorReport result={validationResult} onExplainError={handleExplainError} />
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* AI Explainer Modal */}
      <AIExplainer
        explanation={aiExplanation}
        isLoading={isExplaining}
        onClose={handleCloseExplainer}
      />

      {/* Footer */}
      <footer
        style={{
          padding: '16px 32px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        X12Guard Prototype • Healthcare EDI Parser & Validator • Supports 837, 835, 834
      </footer>
    </div>
  );
}
