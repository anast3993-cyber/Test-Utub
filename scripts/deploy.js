#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting deployment to Vercel...');

// Change to project directory
const projectDir = path.resolve(__dirname, '..');

// Execute Vercel deploy command
const deployCommand = 'vercel --prod';

exec(deployCommand, { cwd: projectDir }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Deployment failed:', error.message);
    console.error('💡 Please check if you have Vercel CLI installed:');
    console.error('   npm install -g vercel');
    console.error('Or install via:');
    console.error('   pnpm add -g vercel');
    console.error('   yarn global add vercel');
    console.error('   bun add -g vercel');
    process.exit(1);
  }

  if (stderr) {
    console.error('⚠️  Deployment warnings:', stderr);
  }

  console.log('✅ Deployment successful!');
  console.log('📍 Project directory:', projectDir);
  console.log('📡 Vercel output:');
  console.log(stdout);

  // Extract deployment URL from output
  const urlMatch = stdout.match(/https:\/\/[^\s]+/);
  if (urlMatch) {
    const deploymentUrl = urlMatch[0];
    console.log('\n🌐 Your application is now live at:');
    console.log(`   ${deploymentUrl}`);
    console.log('\n💡 You can now test the transcript check endpoint:');
    console.log(`   ${deploymentUrl}/api/check-transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
  }

  console.log('\n🎉 Deployment completed successfully!');
});