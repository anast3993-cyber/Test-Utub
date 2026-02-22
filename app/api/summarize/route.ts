/**
 * API Route: /api/summarize
 * POST - Generate YouTube video summary (with credit deduction)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateVideoSummary, validateSummaryRequest } from '@/src/lib/summary';
import { supabase } from '@/lib/supabase';

// Rate limiting configuration
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_MAX || '10');
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000');

// Simple in-memory rate limiter (for Vercel Serverless)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for an IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Verify user and check/deduct credits
 */
async function verifyAndDeductCredits(authHeader: string | null) {
  // If no auth header, check for test mode or public access
  if (!authHeader) {
    return { authorized: false, error: 'Требуется авторизация' };
  }

  const token = authHeader.replace('Bearer ', '');
  
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return { authorized: false, error: 'Неверный токен' };
  }

  // Get current credits
  const { data: credits, error: creditsError } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', user.id)
    .single();

  if (creditsError || !credits) {
    return { authorized: false, error: 'Ошибка проверки кредитов' };
  }

  if (credits.credits < 1) {
    return { authorized: false, error: 'Недостаточно кредитов. Приобретите кредиты для продолжения.' };
  }

  // Deduct 1 credit
  const { error: deductError } = await supabase
    .from('user_credits')
    .update({
      credits: credits.credits - 1,
      total_spent: credits.credits - 1,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id);

  if (deductError) {
    return { authorized: false, error: 'Ошибка списания кредитов' };
  }

  // Record transaction
  await supabase
    .from('credit_transactions')
    .insert({
      user_id: user.id,
      amount: -1,
      type: 'spent',
      description: 'Создание саммари видео'
    });

  return { 
    authorized: true, 
    userId: user.id,
    remainingCredits: credits.credits - 1
  };
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

    // Get auth header
    const authHeader = request.headers.get('Authorization');

    // Verify and deduct credits
    const authResult = await verifyAndDeductCredits(authHeader);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error, requiresAuth: true },
        { status: 401 }
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

    // Return result with remaining credits
    return NextResponse.json({
      ...result,
      remainingCredits: authResult.remainingCredits
    }, { status: 200 });
  } catch (error) {
    console.error('Summary generation error:', error);

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
