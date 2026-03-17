import type { ApiResponse, ParsedEDI, ValidationResult, AIExplanation } from '../types';

const API_BASE = '/api';

export async function uploadFile(file: File): Promise<ApiResponse<ParsedEDI>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

export async function validateSegments(
  segments: unknown[]
): Promise<ApiResponse<ValidationResult>> {
  const response = await fetch(`${API_BASE}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ segments }),
  });

  return response.json();
}

export async function getAIExplanation(
  error?: unknown,
  segment?: unknown
): Promise<ApiResponse<AIExplanation>> {
  const response = await fetch(`${API_BASE}/ai/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error, segment }),
  });

  return response.json();
}
