/**
 * Supadata Service
 * Handles YouTube transcript retrieval via Supadata API
 * Documentation: https://supadata.ai/docs
 */

import { Supadata } from '@supadata/js';

/**
 * Initialize Supadata client with API key from environment
 */
function getSupadataClient(): Supadata {
  const apiKey = process.env.SUPADATA_API_KEY;

  if (!apiKey) {
    throw new Error('SUPADATA_API_KEY is not configured');
  }

  return new Supadata({
    apiKey,
  });
}

/**
 * Transcript item from Supadata
 */
export interface TranscriptItem {
  text: string;
  start: number;
  duration: number;
}

/**
 * Result of transcript retrieval
 */
export interface TranscriptResult {
  videoId: string;
  content: TranscriptItem[];
  fullText: string;
}

/**
 * Fetches transcript for a YouTube video
 * @param videoId - YouTube video ID
 * @returns Transcript result with full text
 * @throws Error if transcript not available or API key missing
 */
export async function getTranscript(videoId: string): Promise<TranscriptResult> {
  const supadata = getSupadataClient();

  try {
    const transcriptData = await supadata.youtube.transcript({ videoId });

    if (!transcriptData || !transcriptData.content) {
      throw new Error('Transcript not available for this video');
    }

    // Combine all transcript text into one string
    const fullText = transcriptData.content.map((item: TranscriptItem) => item.text).join(' ');

    return {
      videoId,
      content: transcriptData.content,
      fullText,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Transcript service configuration error');
      }
      if (error.message.includes('not available')) {
        throw new Error('Transcript not available for this video');
      }
      throw new Error(`Failed to fetch transcript: ${error.message}`);
    }
    throw new Error('Failed to fetch transcript');
  }
}

/**
 * Checks if transcript is available for a video (without fetching full text)
 * @param videoId - YouTube video ID
 * @returns true if transcript is available
 */
export async function isTranscriptAvailable(videoId: string): Promise<boolean> {
  try {
    const supadata = getSupadataClient();
    const transcriptData = await supadata.youtube.transcript({ videoId });
    return !!transcriptData && !!transcriptData.content && transcriptData.content.length > 0;
  } catch {
    return false;
  }
}
