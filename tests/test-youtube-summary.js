const https = require('https');

// YouTube video URL from the task
const videoUrl = 'https://youtube.com/shorts/f4031U5v_qw?si=V_huDb_ZsQAf9jWF';

// API endpoint
const apiUrl = 'https://youtube-summary-backend-omega.vercel.app/api/summarize';

async function testSummary() {
  return new Promise((resolve, reject) => {
    console.log('Testing YouTube summary API...');
    console.log('Video URL:', videoUrl);
    
    const postData = JSON.stringify({ url: videoUrl });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(apiUrl, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('\n=== API Response ===');
          console.log('Status:', res.statusCode);
          console.log('Data:', JSON.stringify(result, null, 2));
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('\n✅ Summary generated successfully!');
            console.log('Video ID:', result.videoId);
            console.log('Has subtitles:', result.hasTranscript);
            console.log('Summary preview:', result.summary.substring(0, 200) + '...');
          } else {
            console.log('\n❌ Error occurred:');
            console.log(result.error || 'Unknown error');
          }
          resolve();
        } catch (error) {
          console.error('\n❌ Failed to parse response:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('\n❌ Request failed:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run the test
testSummary().catch(console.error);