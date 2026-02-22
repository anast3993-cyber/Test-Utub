/**
 * Gemini Service
 * Handles AI-powered summary generation using Google Gemini 1.5 Flash
 * Documentation: https://ai.google.dev/docs
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Get list of Gemini API keys from environment
 * Supports single key (GEMINI_API_KEY) or multiple keys (GEMINI_API_KEYS comma-separated)
 */
function getApiKeys(): string[] {
  const keysEnv = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
  
  if (!keysEnv) {
    throw new Error('GEMINI_API_KEY or GEMINI_API_KEYS is not configured');
  }

  // Split by comma and filter empty strings
  return keysEnv.split(',').map(key => key.trim()).filter(key => key.length > 0);
}

/**
 * Simple in-memory cache for summaries to avoid repeated API calls
 * Key: videoId, Value: { summary, timestamp }
 */
const summaryCache = new Map<string, { summary: string; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Initialize Gemini AI client with API key (with rotation support)
 */
let currentKeyIndex = 0;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests to avoid rate limits

function getGenAI(): GoogleGenerativeAI {
  const apiKeys = getApiKeys();
  
  if (apiKeys.length === 0) {
    throw new Error('No Gemini API keys configured');
  }

  // Get current key (with rotation)
  const apiKey = apiKeys[currentKeyIndex];
  const keyIndex = currentKeyIndex;
  
  // Rotate to next key for next call (if multiple keys available)
  if (apiKeys.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  }

  // Add delay between requests to avoid rate limits
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`⏳ Delaying request by ${delay}ms to avoid rate limits`);
    // Note: In production, consider using a proper queue system
  }
  lastRequestTime = Date.now();

  const maskedKey = apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5);
  console.log(`🔑 Using Gemini API key ${keyIndex + 1}/${apiKeys.length}: ${maskedKey}`);
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Prompt template for video summary generation
 */
const SUMMARY_PROMPT_TEMPLATE = `
Ты профессиональный редактор и контент-менеджер. Твоя задача — прочитать транскрипт YouTube-видео и создать краткое, но содержательное резюме.

Требования к резюме:
1. Используй маркированные списки для основных пунктов
2. Выдели ключевые идеи и главные мысли
3. Сохрани оригинальный контекст и смысл
4. Если видео содержит инструкции или туториал — выдели пошаговые действия
5. Объём резюме: 5-15 пунктов в зависимости от длины видео

Текст транскрипта видео:
---
{transcript}
---

Пожалуйста, создай структурированное резюме на русском языке.
`;

/**
 * Generates a summary from transcript text using Gemini Flash
 * @param transcript - Full transcript text from the video
 * @param videoId - Optional video ID for caching
 * @returns Generated summary text
 * @throws Error if generation fails or API key missing
 */
export async function generateSummary(transcript: string, videoId?: string): Promise<string> {
  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript is empty');
  }

  // Use videoId as cache key if provided, otherwise use transcript hash
  const cacheKey = videoId || transcript.substring(0, 500).replace(/\s+/g, ' ').trim();
  
  // Check cache first
  const cached = summaryCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    console.log('✅ Using cached summary (avoiding API rate limit)');
    return cached.summary;
  }

  // Truncate transcript if too long (Gemini has token limits)
  const maxLength = 30000; // Leave room for prompt
  const truncatedTranscript = transcript.length > maxLength
    ? transcript.substring(0, maxLength) + '...'
    : transcript;

  const genAI = getGenAI();

  try {
    // Use Gemini 2.0 Flash - latest model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

    const prompt = SUMMARY_PROMPT_TEMPLATE.replace('{transcript}', truncatedTranscript);

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response) {
      throw new Error('Empty response from Gemini');
    }

    const summaryText = response.text();

    if (!summaryText || summaryText.trim().length === 0) {
      throw new Error('Generated summary is empty');
    }

    // Cache the result
    summaryCache.set(cacheKey, { summary: summaryText, timestamp: Date.now() });
    console.log('✅ Summary generated and cached');

    return summaryText;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('AI service configuration error');
      }
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new Error('AI service rate limit exceeded. Please try again later.');
      }
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
    throw new Error('Failed to generate summary');
  }
}

/**
 * Generates a short title suggestion based on transcript
 * @param transcript - Full transcript text
 * @returns Suggested title
 */
export async function generateTitle(transcript: string): Promise<string> {
  const genAI = getGenAI();

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `На основе этого транскрипта видео предложи короткое название (не более 60 символов):

${transcript.substring(0, 5000)}

Название:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch {
    return 'Видео-резюме';
  }
}
