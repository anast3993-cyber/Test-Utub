/**
 * Unit tests for Summary Service
 */

// Mock the dependencies BEFORE importing the module under test
jest.mock('@/src/lib/supadata', () => ({
  getTranscript: jest.fn(),
}));

jest.mock('@/src/lib/gemini', () => ({
  generateSummary: jest.fn(),
}));

jest.mock('@/src/lib/youtube', () => ({
  isValidYouTubeUrl: jest.fn(() => true),
  extractVideoId: jest.fn(() => 'test123'),
}));

import { generateVideoSummary, validateSummaryRequest, SummaryResponse } from '@/src/lib/summary';
import { getTranscript } from '@/src/lib/supadata';
import { generateSummary } from '@/src/lib/gemini';
import { isValidYouTubeUrl, extractVideoId } from '@/src/lib/youtube';

describe('Summary Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateSummaryRequest', () => {
    it('should return valid for correct request', () => {
      const result = validateSummaryRequest({ url: 'https://youtube.com/watch?v=test123' });
      expect(result.valid).toBe(true);
    });

    it('should return invalid for missing url', () => {
      const result = validateSummaryRequest({});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('URL is required');
    });

    it('should return invalid for non-string url', () => {
      const result = validateSummaryRequest({ url: 123 });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('URL must be a string');
    });

    it('should return invalid for empty url', () => {
      const result = validateSummaryRequest({ url: '   ' });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('URL cannot be empty');
    });
  });

  describe('generateVideoSummary', () => {
    const validUrl = 'https://youtube.com/watch?v=test123';
    const videoId = 'test123';
    const transcriptText = 'This is a test transcript.';
    const summary = 'This is a test summary.';

    it('should return summary with hasTranscript: true when transcript is available', async () => {
      // Mock successful transcript fetch
      (getTranscript as jest.Mock).mockResolvedValue({
        videoId,
        content: [{ text: transcriptText, start: 0, duration: 10 }],
        fullText: transcriptText,
      });

      // Mock successful summary generation
      (generateSummary as jest.Mock).mockResolvedValue(summary);

      const result = await generateVideoSummary(validUrl);

      expect(result).toEqual({
        videoId: 'test123',
        summary,
        originalUrl: validUrl,
        hasTranscript: true,
      });
    });

    it('should return hasTranscript: false when transcript is not available', async () => {
      // Mock transcript fetch failure
      (getTranscript as jest.Mock).mockRejectedValue({
        code: 'GENERATION_FAILED',
        error: 'Failed to fetch transcript: Transcript not available for this video',
      });

      const result = await generateVideoSummary(validUrl);

      expect(result).toEqual({
        videoId: 'test123',
        summary: 'К сожалению, для этого видео нет субтитров. Попробуйте другое видео с субтитрами.',
        originalUrl: validUrl,
        hasTranscript: false,
      });
    });

    it('should throw error for invalid URL', async () => {
      // Override mock for this test
      (isValidYouTubeUrl as jest.Mock).mockReturnValueOnce(false);
      
      await expect(generateVideoSummary('invalid-url')).rejects.toEqual({
        error: 'Invalid YouTube URL. Please provide a valid YouTube video link.',
        code: 'INVALID_URL',
      });
    });

    it('should throw error for missing URL', async () => {
      await expect(generateVideoSummary('')).rejects.toEqual({
        error: 'URL is required',
        code: 'MISSING_URL',
      });
    });

    it('should throw error for other failures', async () => {
      (getTranscript as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(generateVideoSummary(validUrl)).rejects.toEqual({
        error: 'Failed to generate summary: Network error',
        code: 'GENERATION_FAILED',
      });
    });
  });
});
