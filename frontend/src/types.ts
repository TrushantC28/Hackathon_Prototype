// EDI Types for X12Guard Frontend

export interface EDISegment {
  index: number;
  name: string;
  elements: string[];
  raw: string;
}

export interface SegmentTreeNode {
  type: 'root' | 'envelope' | 'functional_group' | 'transaction_set' | 'segment';
  label?: string;
  name: string;
  elements?: string[];
  index?: number;
  raw?: string;
  children: SegmentTreeNode[];
}

export interface TransactionType {
  code: string;
  label: string;
  description: string;
}

export interface EDIMetadata {
  filename: string;
  totalSegments: number;
  parsedAt: string;
  senderId?: string;
  receiverId?: string;
  date?: string;
  time?: string;
  controlNumber?: string;
}

export interface ParsedEDI {
  metadata: EDIMetadata;
  transactionType: TransactionType;
  segments: EDISegment[];
  segmentTree: SegmentTreeNode;
}

export interface ValidationError {
  rule: string;
  severity: 'error' | 'warning';
  segment: string;
  elementPosition: number | null;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
  };
}

export interface AIExplanation {
  status: string;
  message: string;
  error: ValidationError | null;
  segment: EDISegment | null;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
