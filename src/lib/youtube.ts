/**
 * YouTube URL Parser Utility
 * Extracts video ID from various YouTube URL formats
 */

/**
 * Supported YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/v/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 */

const YOUTUBE_REGEX = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;

/**
 * Extracts video ID from a YouTube URL
 * @param url - YouTube video URL
 * @returns Video ID if valid, null otherwise
 */
export function extractVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const match = url.match(YOUTUBE_REGEX);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Validates if a string is a valid YouTube URL
 * @param url - URL to validate
 * @returns true if valid YouTube URL, false otherwise
 */
export function isValidYouTubeUrl(url: string): boolean {
  const videoId = extractVideoId(url);
  return videoId !== null;
}

/**
 * Normalizes a YouTube URL to the standard watch format
 * @param url - YouTube URL
 * @returns Normalized URL or null if invalid
 */
export function normalizeYouTubeUrl(url: string): string | null {
  const videoId = extractVideoId(url);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
}
