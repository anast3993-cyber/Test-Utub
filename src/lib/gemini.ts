/**
 * Gemini Service
 * Handles AI-powered summary generation using Google Gemini 1.5 Flash
 * Documentation: https://ai.google.dev/docs
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initialize Gemini AI client with API key from environment
 */
function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

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
 * @returns Generated summary text
 * @throws Error if generation fails or API key missing
 */
export async function generateSummary(transcript: string): Promise<string> {
  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript is empty');
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
