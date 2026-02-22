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
  hasTranscript: boolean;
}

/**
 * Error response
 */
export interface SummaryError {
  error: string;
  code?: string;
}

const NO_TRANSCRIPT_MESSAGE =
  'К сожалению, для этого видео нет субтитров. Попробуйте другое видео с субтитрами.';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'error' in error) {
    const err = error as { error?: unknown };
    return typeof err.error === 'string' ? err.error : String(err.error);
  }

  return '';
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

    // Step 2: Generate summary using Gemini (with caching by videoId)
    const summary = await generateSummary(transcriptResult.fullText, videoId);

    return {
      videoId,
      summary,
      originalUrl: url,
      hasTranscript: true,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const normalizedMessage = errorMessage.toLowerCase();

    if (
      normalizedMessage.includes('transcript') &&
      normalizedMessage.includes('not available')
    ) {
      return {
        videoId,
        summary: NO_TRANSCRIPT_MESSAGE,
        originalUrl: url,
        hasTranscript: false,
      };
    }

    // Handle custom errors
    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }

    // Generic error handling
    const fallbackMessage = errorMessage || 'Unknown error occurred';

    throw {
      error: `Failed to generate summary: ${fallbackMessage}`,
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
