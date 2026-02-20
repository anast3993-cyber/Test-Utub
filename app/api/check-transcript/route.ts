import { NextRequest, NextResponse } from 'next/server';
import { extractVideoId, isValidYouTubeUrl } from '@/src/lib/youtube';
import { isTranscriptAvailable } from '@/src/lib/supadata';

/**
 * GET /api/check-transcript
 * Checks if transcript is available for a YouTube video
 */
export async function GET(request: NextRequest) {
  try {
    // Get video URL from query parameters
    const videoUrl = request.nextUrl.searchParams.get('url');
    
    // Validate URL
    if (!videoUrl || typeof videoUrl !== 'string' || videoUrl.trim().length === 0) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(videoUrl)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please provide a valid YouTube video link.' },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract video ID from URL' },
        { status: 400 }
      );
    }

    try {
      // Check if transcript is available
      const isAvailable = await isTranscriptAvailable(videoId);

      return NextResponse.json(
        {
          videoId,
          url: videoUrl,
          transcriptAvailable: isAvailable,
          message: isAvailable 
            ? 'Transcript is available for this video'
            : 'Transcript is not available for this video'
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Transcript check error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to check transcript availability. Please try again later.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/check-transcript
 * Alternative endpoint for checking transcript availability
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
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
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be an object' },
        { status: 400 }
      );
    }

    const { url } = body as { url: string };

    // Validate URL
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please provide a valid YouTube video link.' },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract video ID from URL' },
        { status: 400 }
      );
    }

    try {
      // Check if transcript is available
      const isAvailable = await isTranscriptAvailable(videoId);

      return NextResponse.json(
        {
          videoId,
          url,
          transcriptAvailable: isAvailable,
          message: isAvailable 
            ? 'Transcript is available for this video'
            : 'Transcript is not available for this video'
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Transcript check error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to check transcript availability. Please try again later.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}