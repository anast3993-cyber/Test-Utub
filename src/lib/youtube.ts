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

  const trimmedUrl = url.trim();

  try {
    const parsedUrl = new URL(trimmedUrl);
    const hostname = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();

    if (hostname === 'youtu.be') {
      const pathId = parsedUrl.pathname.split('/').filter(Boolean)[0];
      if (pathId && pathId.length === 11) {
        return pathId;
      }
    }

    if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com')) {
      const vParam = parsedUrl.searchParams.get('v');
      if (vParam && vParam.length === 11) {
        return vParam;
      }

      const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
      if (pathSegments.length >= 2) {
        const [type, id] = pathSegments;
        if (['embed', 'v', 'shorts'].includes(type) && id && id.length === 11) {
          return id;
        }
      }
    }
  } catch {
    // Ignore URL parsing errors and fall back to regex.
  }

  const match = trimmedUrl.match(YOUTUBE_REGEX);
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
