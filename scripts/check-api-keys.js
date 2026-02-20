#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkApiKeys() {
  console.log('🔍 Checking API keys configuration...\n');

  const envPath = path.resolve(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found!');
    console.log('   Please create it from .env.example');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  const geminiKeyMatch = envContent.match(/GEMINI_API_KEY=([^\n\r]+)/);
  const geminiKeysMatch = envContent.match(/GEMINI_API_KEYS=([^\n\r]+)/);
  
  console.log('📋 Current configuration:');
  
  if (geminiKeysMatch) {
    const keys = geminiKeysMatch[1].split(',').map(k => k.trim()).filter(k => k);
    console.log(`✅ GEMINI_API_KEYS: ${keys.length} key(s) configured`);
    keys.forEach((key, index) => {
      const masked = key.substring(0, 7) + '...' + key.substring(key.length - 5);
      console.log(`   ${index + 1}. ${masked}`);
    });
    console.log('\n💡 Rotation enabled: API keys will be used in round-robin fashion');
  } else if (geminiKeyMatch) {
    const key = geminiKeyMatch[1].trim();
    const masked = key.substring(0, 7) + '...' + key.substring(key.length - 5);
    console.log(`✅ GEMINI_API_KEY: ${masked}`);
    console.log('⚠️  Only one key configured. Consider adding more keys to avoid rate limits.');
    console.log('   Use GEMINI_API_KEYS for multiple keys (comma-separated)');
  } else {
    console.log('❌ No Gemini API key found!');
    console.log('   Please add GEMINI_API_KEY or GEMINI_API_KEYS to .env.local');
    process.exit(1);
  }
  
  const supadataMatch = envContent.match(/SUPADATA_API_KEY=([^\n\r]+)/);
  if (supadataMatch) {
    const key = supadataMatch[1].trim();
    const masked = key.substring(0, 7) + '...' + key.substring(key.length - 5);
    console.log(`✅ SUPADATA_API_KEY: ${masked}`);
  } else {
    console.log('❌ SUPADATA_API_KEY not found!');
  }
  
  console.log('\n🎯 Recommendations:');
  console.log('1. Get multiple Gemini API keys from: https://aistudio.google.com/app/apikey');
  console.log('2. Add them as GEMINI_API_KEYS=key1,key2,key3 in .env.local');
  console.log('3. Restart the dev server after changes');
  console.log('4. Redeploy to Vercel after updating environment variables');
}

checkApiKeys();