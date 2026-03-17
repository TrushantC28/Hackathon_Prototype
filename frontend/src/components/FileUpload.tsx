import { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const ACCEPTED_EXTENSIONS = ['.edi', '.txt', '.x12', '.dat'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function FileUpload({ onFileUpload, isLoading }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    const name = file.name.toLowerCase();
    const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
    if (!hasValidExt) {
      return `Invalid file type. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: ${MAX_SIZE_MB}MB`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file.name);
      onFileUpload(file);
    },
    [onFileUpload, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="animate-fade-in-up">
      <div
        id="file-upload-zone"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          position: 'relative',
          padding: '48px 32px',
          borderRadius: '16px',
          border: `2px dashed ${isDragOver ? 'var(--accent-primary)' : 'var(--border-color)'}`,
          background: isDragOver
            ? 'rgba(99, 102, 241, 0.08)'
            : 'var(--bg-card)',
          cursor: isLoading ? 'wait' : 'pointer',
          transition: 'all var(--transition-base)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Shimmer effect on drag */}
        {isDragOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          id="file-input"
        />

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Processing EDI file...
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                borderRadius: '16px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: isDragOver ? '0 0 30px rgba(99, 102, 241, 0.4)' : 'none',
                transition: 'all var(--transition-base)',
              }}
            >
              📄
            </div>

            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: '8px',
                color: 'var(--text-primary)',
              }}
            >
              {isDragOver ? 'Drop your EDI file here' : 'Upload EDI File'}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
              Drag & drop or click to browse
            </p>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {ACCEPTED_EXTENSIONS.map((ext) => (
                <span
                  key={ext}
                  className="badge badge-info"
                  style={{ fontSize: '0.7rem' }}
                >
                  {ext}
                </span>
              ))}
              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                ≤ {MAX_SIZE_MB}MB
              </span>
            </div>
          </>
        )}
      </div>

      {/* Selected file name */}
      {selectedFile && !error && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: 'var(--accent-emerald)' }}>✓</span>
          <span style={{ color: 'var(--text-secondary)' }}>{selectedFile}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'rgba(251, 113, 133, 0.1)',
            border: '1px solid rgba(251, 113, 133, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: 'var(--accent-rose)' }}>✕</span>
          <span style={{ color: 'var(--accent-rose)' }}>{error}</span>
        </div>
      )}
    </div>
  );
}
