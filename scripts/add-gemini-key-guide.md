# Как получить Gemini API ключ

## Шаги для получения нового API ключа:

### 1. Перейдите на официальный сайт
Откройте: https://aistudio.google.com/app/apikey

### 2. Войдите в Google аккаунт
- Используйте ваш Google аккаунт (Gmail)
- При необходимости создайте новый аккаунт

### 3. Создайте API ключ
- Нажмите кнопку **"Create API key"** или **"Get API key"**
- Система сгенерирует ключ вида: `AIzaSy...`
- Скопируйте ключ (нажмите на иконку копирования)

### 4. Добавьте ключ в проект

Откройте файл `.env.local` и добавьте ключ в переменную `GEMINI_API_KEYS`:

```bash
# Текущая конфигурация:
GEMINI_API_KEYS=AIzaSyB4VCnL3mglsiQJQ6-_SMiUo-Fhn3YY09o,AIzaSyD2EtWigNcJ64slQGCmip7kAXGThpUKdLI

# После добавления третьего ключа:
GEMINI_API_KEYS=AIzaSyB4VCnL3mglsiQJQ6-_SMiUo-Fhn3YY09o,AIzaSyD2EtWigNcJ64slQGCmip7kAXGThpUKdLI,ВАШ_НОВЫЙ_КЛЮЧ
```

### 5. Сохраните файл
- Нажмите Ctrl+S в VS Code
- Сервер автоматически перезагрузится

### 6. Проверьте конфигурацию
```bash
node scripts/check-api-keys.js
```

## Важные замечания:

✅ **Бесплатно:** API ключи бесплатны  
✅ **Несколько ключей:** Можно создать сколько угодно ключей  
✅ **Лимиты:** У каждого ключа свои лимиты (обычно 60 запросов/мин)  
✅ **Ротация:** Система автоматически использует ключи по кругу  
✅ **Безопасность:** Никому не передавайте свои API ключи  

## Если ключ не работает:

1. Проверьте, что ключ скопирован полностью
2. Убедитесь, что ключ начинается с `AIzaSy`
3. Проверьте, что в `.env.local` нет лишних пробелов
4. Перезапустите сервер: Ctrl+C и `npm run dev`

## После добавления ключа:

Протестируйте суммаризацию:
```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/shorts/f4031U5v_qw?si=V_huDb_ZsQAf9jWF"}'
```

## Для Vercel:

Не забудьте добавить те же ключи в Vercel Environment Variables:
1. Перейдите на https://vercel.com/dashboard
2. Выберите проект `youtube-summary-backend-omega`
3. Settings → Environment Variables
4. Добавьте `GEMINI_API_KEYS` со всеми ключами через запятую
5. Redeploy проект