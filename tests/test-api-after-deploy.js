const https = require('https');

// Test videos
const testVideos = [
  { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', name: 'Rick Astley (with subtitles)' },
  { url: 'https://www.youtube.com/watch?v=8UXQz-n8U1w', name: 'Technical video (with subtitles)' },
  { url: 'https://youtube.com/shorts/f4031U5v_qw?si=V_huDb_ZsQAf9jWF', name: 'Short video (likely no subtitles)' }
];

// API endpoints
const baseUrl = 'https://youtube-summary-backend-omega.vercel.app';
const checkTranscriptUrl = `${baseUrl}/api/check-transcript`;
const summarizeUrl = `${baseUrl}/api/summarize`;

async function testAPI() {
  console.log('🧪 Testing YouTube Summary API after deployment\n');
  console.log('='.repeat(60));

  for (const video of testVideos) {
    console.log(`\n📹 Testing: ${video.name}`);
    console.log(`URL: ${video.url}`);
    console.log('-'.repeat(60));

    // Step 1: Check transcript availability
    try {
      const checkResult = await makeRequest(checkTranscriptUrl, { url: video.url });
      console.log('✅ Transcript check completed');
      console.log(`   Video ID: ${checkResult.videoId}`);
      console.log(`   Transcript available: ${checkResult.transcriptAvailable}`);
      console.log(`   Message: ${checkResult.message}`);

      // Step 2: If transcript is available, try to get summary
      if (checkResult.transcriptAvailable) {
        console.log('   Attempting to generate summary...');
        const summaryResult = await makeRequest(summarizeUrl, { url: video.url });
        console.log('✅ Summary generated successfully!');
        console.log(`   Summary preview: ${summaryResult.summary.substring(0, 150)}...`);
      } else {
        console.log('   ⚠️  Skipping summary generation (no transcript available)');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    console.log('='.repeat(60));
  }

  console.log('\n🎉 API testing completed!');
}

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(result.error || `HTTP ${res.statusCode}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// Run the test
testAPI().catch(console.error);