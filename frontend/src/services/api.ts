import { BASE_URL } from '../config/api';
import type { ApiResponse, ParsedEDI, ValidationResult, AIExplanation } from '../types';

const API_BASE = `${BASE_URL}/api`;

export async function uploadFile(file: File): Promise<ApiResponse<ParsedEDI>> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function validateSegments(
  segments: unknown[]
): Promise<ApiResponse<ValidationResult>> {
  try {
    const response = await fetch(`${API_BASE}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ segments }),
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getAIExplanation(
  error?: unknown,
  segment?: unknown
): Promise<ApiResponse<AIExplanation>> {
  try {
    const response = await fetch(`${API_BASE}/ai/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error, segment }),
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
