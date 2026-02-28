# Настройка Supabase для SummaTube

## Что уже создано в базе данных

1. **Таблица `profiles`** - профили пользователей
2. **Таблица `user_credits`** - кредиты пользователей
3. **Таблица `credit_transactions`** - история транзакций
4. **RLS политики** - безопасность данных
5. **Триггер** - автоматическое начисление 5 кредитов при регистрации

## Конфигурация Supabase

### Текущие настройки

- **Project URL:** https://txmaeyidlzdgnorulyio.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bWFleWlkbHpkZ25vcnVseWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NjU0MjAsImV4cCI6MjA4NzM0MTQyMH0.61xxOUmnvnJ4zSO-KGQGor2NCYxslsjCNBeGTOW2tWk

### Что нужно сделать

#### 1. Отключить подтверждение email (опционально)

Для регистрации без подтверждения email:
1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите проект "you tube_base"
3. Перейдите в **Authentication** → **Providers** → **Email**
4. Отключите **Confirm email**

#### 2. Добавить ключи в .env.local

Создайте или обновите файл `.env.local` в корне проекта:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://txmaeyidlzdgnorulyio.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bWFleWlkbHpkZ25vcnVseWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NjU0MjAsImV4cCI6MjA4NzM0MTQyMH0.61xxOUmnvnJ4zSO-KGQGor2NCYxslsjCNBeGTOW2tWk
```

#### 3. Переменные для Vercel

При деплое на Vercel добавьте эти переменные в настройках проекта:
- `NEXT_PUBLIC_SUPABASE_URL` - https://txmaeyidlzdgnorulyio.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bWFleWlkbHpkZ25vcnVseWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NjU0MjAsImV4cCI6MjA4NzM0MTQyMH0.61xxOUmnvnJ4zSO-KGQGor2NCYxslsjCNBeGTOW2tWk

## Как работает система

1. **Регистрация:** Пользователь регистрируется → автоматически получает 5 кредитов
2. **Вход:** При входе отображается количество кредитов в шапке
3. **Использование:** При каждом использовании сервиса списывается 1 кредит
4. **Безопасность:** Пользователь может видеть и изменять только свои данные

## Структура файлов

```
src/lib/supabase.ts       - Клиент Supabase и функции для работы с БД
hooks/use-auth.tsx        - Хук для управления авторизацией
app/api/auth/signup/     - API регистрации
app/api/auth/login/      - API входа
app/api/auth/logout/     - API выхода
app/api/auth/me/         - API получения данных пользователя
components/summatube/auth-modal.tsx  - Модальное окно авторизации
components/summatube/header.tsx      - Шапка с кредитами
```

## Запуск

```bash
npm install
npm run dev
```
