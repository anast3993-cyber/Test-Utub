/**
 * API Route: /api/summarize
 * POST - Generate YouTube video summary
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateVideoSummary, validateSummaryRequest } from '@/src/lib/summary';

// Rate limiting configuration
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_MAX || '10');
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000');

// Simple in-memory rate limiter (for Vercel Serverless)
// Note: In production, consider using Redis for distributed rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for an IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    // Rate limit exceeded
    return false;
  }

  // Increment count
  record.count++;
  return true;
}

/**
 * POST /api/summarize
 * Generate a summary for a YouTube video
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || request.headers.get('x-real-ip') 
      || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate request
    const validation = validateSummaryRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { url } = body as { url: string };

    // Generate summary
    const result = await generateVideoSummary(url);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Summary generation error:', error);

    // Handle custom errors
    if (error && typeof error === 'object' && 'code' in error) {
      const err = error as { code: string; error: string };
      
      if (err.code === 'INVALID_URL') {
        return NextResponse.json(
          { error: err.error },
          { status: 400 }
        );
      }

      if (err.code === 'MISSING_URL') {
        return NextResponse.json(
          { error: err.error },
          { status: 400 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'An error occurred while generating the summary. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/summarize
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok', 
      message: 'YouTube Summary API is running',
      endpoints: {
        POST: '/api/summarize - Generate video summary'
      }
    },
    { status: 200 }
  );
}
