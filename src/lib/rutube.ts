/**
 * Rutube URL Parser Utility
 * Extracts video ID from Rutube URL formats
 */

const RUTUBE_REGEX = /^.*rutube\.ru\/video\/([a-zA-Z0-9]+).*/;

/**
 * Extracts video ID from a Rutube URL
 * @param url - Rutube video URL
 * @returns Video ID if valid, null otherwise
 */
export function extractRutubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const match = url.match(RUTUBE_REGEX);
  return match ? match[1] : null;
}

/**
 * Validates if a string is a valid Rutube URL
 * @param url - URL to validate
 * @returns true if valid Rutube URL, false otherwise
 */
export function isValidRutubeUrl(url: string): boolean {
  return extractRutubeVideoId(url) !== null;
}
