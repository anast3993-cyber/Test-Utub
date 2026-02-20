# YouTube Video Summary Backend

Backend для сервиса саммаризации YouTube-роликов с использованием AI.

## Технологический стек

- **Runtime**: Node.js (Vercel Serverless Functions)
- **Framework**: Next.js 15 (App Router)
- **AI**: Google Gemini 1.5 Flash
- **Транскрипты**: Supadata API

## Структура проекта

```
/src/lib
  ├── youtube.ts      # Утилиты для парсинга YouTube URL
  ├── supadata.ts    # Сервис получения транскриптов
  ├── gemini.ts      # Сервис генерации саммари
  └── summary.ts     # Главный orchestrator

/app/api/summarize
  └── route.ts       # API Route для генерации саммари

/tests
  └── youtube.test.ts # Unit тесты

.env.local           # Локальные переменные окружения
.env.example         # Пример переменных окружения
vercel.json          # Конфигурация Vercel
```

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Скопируйте `.env.example` в `.env.local`:
```bash
cp .env.example .env.local
```

3. Заполните API ключи в `.env.local`:

### Получение API ключей

#### Supadata (транскрипты)
1. Зарегистрируйтесь на [supadata.ai](https://supadata.ai/)
2. Получите API ключ в dashboard

#### Google Gemini (AI)
1. Откройте [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Создайте новый API ключ

## Использование API

### POST /api/summarize

Генерирует саммари для YouTube видео.

**Примечание**: Поле `hasTranscript` указывает, были ли найдены субтитры у видео:
- `true` - субтитры найдены, сгенерировано полноценное саммари
- `false` - субтитры отсутствуют, в поле `summary` будет сообщение об этом

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "videoId": "dQw4w9WgXcQ",
  "summary": "Основные пункты из видео...",
  "originalUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "hasTranscript": true
}
```

**Ошибки:**
- `400` - Некорректный URL
- `429` - Превышен лимит запросов
- `500` - Ошибка сервера

## Локальная разработка

```bash
npm run dev
```

Откройте [http://localhost:3000/api/summarize](http://localhost:3000/api/summarize)

## Деплой на Vercel

### Автоматический деплой

1. Запушьте код на GitHub
2. Импортируйте проект в Vercel
3. Добавьте переменные окружения в Vercel Dashboard:
   - `SUPADATA_API_KEY`
   - `GEMINI_API_KEY`
4. Деплой произойдёт автоматически

### Деплой из CLI

```bash
npm i -g vercel
vercel
```

## Бесплатные лимиты Vercel

- **Serverless Functions**: 100,000 запросов/месяц
- **Bandwidth**: 100 ГБ/месяц
- **Edge Functions**: 100,000 запросов/месяц

## Rate Limiting

По умолчанию: 10 запросов в час с одного IP.

Настраивается через переменные окружения:
```
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=3600000
```

## Тестирование

```bash
npm test
```

## Лицензия

MIT
