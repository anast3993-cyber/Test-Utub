const https = require('https');

// YouTube video URL with available transcript
const videoUrlWithTranscript = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

// YouTube video URL without transcript (short video)
const videoUrlWithoutTranscript = 'https://youtube.com/shorts/f4031U5v_qw?si=V_huDb_ZsQAf9jWF';

// API endpoint
const apiUrl = 'https://youtube-summary-backend-omega.vercel.app/api/check-transcript';

async function testTranscriptCheck() {
  return new Promise((resolve, reject) => {
    console.log('Testing transcript availability API...');
    console.log('Testing video with transcript:', videoUrlWithTranscript);
    console.log('Testing video without transcript:', videoUrlWithoutTranscript);
    
    // Test video with transcript
    const postData1 = JSON.stringify({ url: videoUrlWithTranscript });
    
    const options1 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData1)
      }
    };

    console.log('\n=== Testing video with transcript ===');
    
    const req1 = https.request(apiUrl, options1, (res1) => {
      let data1 = '';
      
      res1.on('data', (chunk) => {
        data1 += chunk;
      });
      
      res1.on('end', () => {
        try {
          const result1 = JSON.parse(data1);
          console.log('Status:', res1.statusCode);
          console.log('Data:', JSON.stringify(result1, null, 2));
          
          if (res1.statusCode >= 200 && res1.statusCode < 300) {
            console.log('\n✅ Transcript check successful!');
            console.log('Video ID:', result1.videoId);
            console.log('Transcript available:', result1.transcriptAvailable);
            console.log('Message:', result1.message);
          } else {
            console.log('\n❌ Error occurred:');
            console.log(result1.error || 'Unknown error');
          }
        } catch (error) {
          console.error('\n❌ Failed to parse response:', error.message);
          reject(error);
        }
      });
    });

    req1.on('error', (error) => {
      console.error('\n❌ Request failed:', error.message);
      reject(error);
    });

    req1.write(postData1);
    req1.end();

    // Test video without transcript
    const postData2 = JSON.stringify({ url: videoUrlWithoutTranscript });
    
    const options2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData2)
      }
    };

    console.log('\n=== Testing video without transcript ===');
    
    const req2 = https.request(apiUrl, options2, (res2) => {
      let data2 = '';
      
      res2.on('data', (chunk) => {
        data2 += chunk;
      });
      
      res2.on('end', () => {
        try {
          const result2 = JSON.parse(data2);
          console.log('Status:', res2.statusCode);
          console.log('Data:', JSON.stringify(result2, null, 2));
          
          if (res2.statusCode >= 200 && res2.statusCode < 300) {
            console.log('\n✅ Transcript check successful!');
            console.log('Video ID:', result2.videoId);
            console.log('Transcript available:', result2.transcriptAvailable);
            console.log('Message:', result2.message);
          } else {
            console.log('\n❌ Error occurred:');
            console.log(result2.error || 'Unknown error');
          }
          resolve();
        } catch (error) {
          console.error('\n❌ Failed to parse response:', error.message);
          reject(error);
        }
      });
    });

    req2.on('error', (error) => {
      console.error('\n❌ Request failed:', error.message);
      reject(error);
    });

    req2.write(postData2);
    req2.end();
  });
}

// Run the test
testTranscriptCheck().catch(console.error);
