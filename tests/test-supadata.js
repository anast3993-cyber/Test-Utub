const { getTranscript, isTranscriptAvailable } = require('../src/lib/supadata');
const { extractVideoId } = require('../src/lib/youtube');

// YouTube video URL with available transcript
const videoUrlWithTranscript = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

// YouTube video URL without transcript (short video)
const videoUrlWithoutTranscript = 'https://youtube.com/shorts/f4031U5v_qw?si=V_huDb_ZsQAf9jWF';

async function testTranscriptCheck() {
  try {
    console.log('Testing transcript availability...');
    console.log('Testing video with transcript:', videoUrlWithTranscript);
    console.log('Testing video without transcript:', videoUrlWithoutTranscript);
    
    // Test video with transcript
    const videoId1 = extractVideoId(videoUrlWithTranscript);
    if (!videoId1) {
      console.log('❌ Could not extract video ID from URL 1');
      return;
    }

    console.log('\n=== Testing video with transcript ===');
    const isAvailable1 = await isTranscriptAvailable(videoId1);
    console.log('Video ID:', videoId1);
    console.log('Transcript available:', isAvailable1);
    console.log('Message:', isAvailable1 
      ? 'Transcript is available for this video'
      : 'Transcript is not available for this video');

    // Test video without transcript
    const videoId2 = extractVideoId(videoUrlWithoutTranscript);
    if (!videoId2) {
      console.log('❌ Could not extract video ID from URL 2');
      return;
    }

    console.log('\n=== Testing video without transcript ===');
    const isAvailable2 = await isTranscriptAvailable(videoId2);
    console.log('Video ID:', videoId2);
    console.log('Transcript available:', isAvailable2);
    console.log('Message:', isAvailable2 
      ? 'Transcript is available for this video'
      : 'Transcript is not available for this video');

    // Get full transcript for video with available transcript
    if (isAvailable1) {
      console.log('\n=== Getting full transcript ===');
      try {
        const transcript = await getTranscript(videoId1);
        console.log('Transcript retrieved successfully!');
        console.log('Video ID:', transcript.videoId);
        console.log('Number of transcript items:', transcript.content.length);
        console.log('First 3 transcript items:');
        transcript.content.slice(0, 3).forEach((item, index) => {
          console.log(`  ${index + 1}. “${item.text}” (start: ${item.start}s, duration: ${item.duration}s)`);
        });
        console.log('\nFull transcript preview:', transcript.fullText.substring(0, 200) + '...');
      } catch (error) {
        console.error('❌ Failed to get transcript:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testTranscriptCheck().catch(console.error);