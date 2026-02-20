const { extractVideoId } = require('../src/lib/youtube');

// Тестируем майт на указанном ролике
const testUrl = 'https://youtu.be/JtkyYIdFrkg?si=y_ndq2pzy_76mTDT';
const videoId = extractVideoId(testUrl);

console.log('Проверка майта на ролике:');
console.log('Входная ссылка:', testUrl);
console.log('Извлеченный ID:', videoId);
console.log('Ожидаемый ID:', 'JtkyYIdFrkg');

if (videoId === 'JtkyYIdFrkg') {
  console.log('✅ Тест пройден! Майт работает корректно');
} else {
  console.log('❌ Тест не пройден! Майт не работает');
}

// Тестируем разные варианты URL
const testUrls = [
  'https://www.youtube.com/watch?v=JtkyYIdFrkg&si=y_ndq2pzy_76mTDT',
  'https://www.youtube.com/shorts/JtkyYIdFrkg?si=y_ndq2pzy_76mTDT',
  'https://www.youtube.com/embed/JtkyYIdFrkg?si=y_ndq2pzy_76mTDT',
  'https://youtu.be/JtkyYIdFrkg?si=y_ndq2pzy_76mTDT&t=120',
  'https://www.youtube.com/watch?v=JtkyYIdFrkg&t=120&si=y_ndq2pzy_76mTDT'
];

console.log('\nТестируем разные варианты URL:');
testUrls.forEach(function(url, index) {
  const id = extractVideoId(url);
  console.log(`${index + 1}. ${url}`);
  console.log(`   ID: ${id}`);
  console.log(`   Результат: ${id === 'JtkyYIdFrkg' ? '✅' : '❌'}`);
});

// Тест невалидных URL
console.log('\nТест невалидных URL:');
const invalidUrls = [
  'https://google.com',
  'https://youtube.com',
  'not-a-url',
  '',
  'https://www.youtube.com/watch?v=abc'
];

invalidUrls.forEach(function(url, index) {
  const id = extractVideoId(url);
  console.log(`${index + 1}. ${url}`);
  console.log(`   ID: ${id}`);
  console.log(`   Результат: ${id === null ? '✅' : '❌'}`);
});