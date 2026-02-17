/**
 * Summary Service
 * Main orchestrator that combines Supadata and Gemini APIs
 */

import { getTranscript } from './supadata';
import { generateSummary } from './gemini';
import { extractVideoId, isValidYouTubeUrl } from './youtube';
import { extractRutubeVideoId, isValidRutubeUrl } from './rutube';

/**
 * Summary request input
 */
export interface SummaryRequest {
  url: string;
}

/**
 * Summary response output
 */
export interface SummaryResponse {
  videoId: string;
  summary: string;
  originalUrl: string;
}

/**
 * Error response
 */
export interface SummaryError {
  error: string;
  code?: string;
}

/**
 * Main function to generate video summary
 * @param url - YouTube video URL
 * @returns Summary response with videoId and generated summary
 * @throws SummaryError with appropriate code
 */
export async function generateVideoSummary(url: string): Promise<SummaryResponse> {
  // Validate URL
  if (!url || typeof url !== 'string') {
    throw {
      error: 'URL is required',
      code: 'MISSING_URL',
    };
  }

  // Check if it's a valid YouTube URL
  if (!isValidYouTubeUrl(url)) {
    throw {
      error: 'Invalid YouTube URL. Please provide a valid YouTube video link.',
      code: 'INVALID_URL',
    };
  }

  // Extract video ID
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw {
      error: 'Could not extract video ID from URL',
      code: 'INVALID_URL',
    };
  }

  try {
    // Step 1: Get transcript from Supadata
    const transcriptResult = await getTranscript(videoId);

    // Step 2: Generate summary using Gemini
    const summary = await generateSummary(transcriptResult.fullText);

    return {
      videoId,
      summary,
      originalUrl: url,
    };
  } catch (error) {
    // Handle custom errors
    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }

    // Generic error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    throw {
      error: `Failed to generate summary: ${errorMessage}`,
      code: 'GENERATION_FAILED',
    };
  }
}

/**
 * Validates the summary request input
 * @param data - Request body
 * @returns Validation result
 */
export function validateSummaryRequest(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  const body = data as Record<string, unknown>;
  
  if (!('url' in body)) {
    return { valid: false, error: 'URL is required' };
  }

  if (typeof body.url !== 'string') {
    return { valid: false, error: 'URL must be a string' };
  }

  if (body.url.trim().length === 0) {
    return { valid: false, error: 'URL cannot be empty' };
  }

  return { valid: true };
}
