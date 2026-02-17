/**
 * Unit tests for YouTube URL parser utility
 */

import { extractVideoId, isValidYouTubeUrl, normalizeYouTubeUrl } from '@/lib/youtube';

describe('YouTube URL Parser', () => {
  describe('extractVideoId', () => {
    it('should extract video ID from standard watch URL', () => {
      const result = extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      expect(result).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from youtu.be URL', () => {
      const result = extractVideoId('https://youtu.be/dQw4w9WgXcQ');
      expect(result).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from embed URL', () => {
      const result = extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ');
      expect(result).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from shorts URL', () => {
      const result = extractVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ');
      expect(result).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from URL with additional parameters', () => {
      const result = extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120');
      expect(result).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URL', () => {
      const result = extractVideoId('https://google.com');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = extractVideoId('');
      expect(result).toBeNull();
    });

    it('should return null for non-YouTube URL', () => {
      const result = extractVideoId('https://vimeo.com/123456789');
      expect(result).toBeNull();
    });

    it('should return null for invalid video ID length', () => {
      const result = extractVideoId('https://www.youtube.com/watch?v=abc');
      expect(result).toBeNull();
    });
  });

  describe('isValidYouTubeUrl', () => {
    it('should return true for valid YouTube URLs', () => {
      expect(isValidYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(isValidYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
      expect(isValidYouTubeUrl('https://youtube.com/shorts/dQw4w9WgXcQ')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidYouTubeUrl('https://google.com')).toBe(false);
      expect(isValidYouTubeUrl('')).toBe(false);
      expect(isValidYouTubeUrl('not a url')).toBe(false);
    });
  });

  describe('normalizeYouTubeUrl', () => {
    it('should normalize YouTube URL to watch format', () => {
      const result = normalizeYouTubeUrl('https://youtu.be/dQw4w9WgXcQ');
      expect(result).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    it('should return null for invalid URL', () => {
      const result = normalizeYouTubeUrl('https://google.com');
      expect(result).toBeNull();
    });
  });
});
