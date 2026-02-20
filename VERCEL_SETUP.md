# Настройка деплоя на Vercel

## После деплоя необходимо настроить Environment Variables

### Шаг 1: Перейдите на Vercel Dashboard
1. Откройте https://vercel.com/dashboard
2. Найдите проект `youtube-summary-backend-omega` или `anast3993-cybers-projects/youtube-summary-app`

### Шаг 2: Настройте Environment Variables

В разделе **Environment Variables** добавьте следующие переменные:

#### Обязательные переменные:

1. **SUPADATA_API_KEY**
   - Значение: `sd_a8d3fd05e7f9be99867b2042c50f8dd1`
   - Описание: API ключ для Supadata (получение транскриптов)

2. **GEMINI_API_KEY** или **GEMINI_API_KEYS**
   - **Вариант A (один ключ):**
     - Переменная: `GEMINI_API_KEY`
     - Значение: `AIzaSyB4VCnL3mglsiQJQ6-_SMiUo-Fhn3YY09o`
   - **Вариант B (несколько ключей для обхода лимитов - рекомендуется):**
     - Переменная: `GEMINI_API_KEYS`
     - Значение: `key1,key2,key3` (через запятую)
     - Описание: API ключи для Google Gemini с автоматической ротацией
   - Как получить ключи: https://aistudio.google.com/app/apikey

#### Опциональные переменные:

3. **RATE_LIMIT_MAX** (по умолчанию: 10)
   - Значение: `10`
   - Описание: Максимальное количество запросов в окне

4. **RATE_LIMIT_WINDOW_MS** (по умолчанию: 3600000)
   - Значение: `3600000`
   - Описание: Окно rate limiting в миллисекундах (1 час)

### Шаг 3: Redeploy

После добавления environment variables:
1. Перейдите во вкладку **Deployments**
2. Найдите последний деплой
3. Нажмите **...** → **Redeploy**
4. Или создайте новый деплой, отправив изменения

### Шаг 4: Проверьте работу API

После успешного деплоя проверьте:

1. **Health check:**
   ```
   GET https://youtube-summary-backend-omega.vercel.app/api/summarize
   ```

2. **Check transcript:**
   ```bash
   curl -X POST https://youtube-summary-backend-omega.vercel.app/api/check-transcript \
     -H "Content-Type: application/json" \
     -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
   ```

3. **Generate summary:**
   ```bash
   curl -X POST https://youtube-summary-backend-omega.vercel.app/api/summarize \
     -H "Content-Type: application/json" \
     -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
   ```

### Шаг 5: Тестирование на сайте

Откройте https://youtube-summary-backend-omega.vercel.app/ и попробуйте видео с субтитрами:

- https://www.youtube.com/watch?v=dQw4w9WgXcQ (Rick Astley)
- https://www.youtube.com/watch?v=8UXQz-n8U1w (Technical video)
- https://www.youtube.com/watch?v=kJQP7kiw5Fk (Educational)

## Устранение неполадок

### Ошибка 401/403
- Проверьте, что все environment variables добавлены правильно
- Убедитесь, что значения API ключей верные

### Ошибка 500
- Проверьте логи в Vercel (вкладка **Functions** → выберите функцию → **Logs**)
- Убедитесь, что видео имеет доступные субтитры/транскрипт

### Ошибка "Transcript not available"
- Видео может не иметь автоматических субтитров
- Попробуйте другое видео с субтитрами
- Убедитесь, что видео не является Shorts (короткие видео часто без транскриптов)

## Примечания

- Supadata API имеет бесплатный тариф: 100 запросов/месяц
- Gemini API также имеет бесплатный лимит
- Для Shorts видео транскрипт обычно недоступен
- Лучше тестировать видео длительностью 2+ минуты с четкой речью