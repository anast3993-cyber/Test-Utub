"use client"

import { useState, useCallback, useEffect } from "react"
import { Header } from "@/components/summatube/header"
import { HeroInput } from "@/components/summatube/hero-input"
import { LoadingState } from "@/components/summatube/loading-state"
import { ResultCard } from "@/components/summatube/result-card"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/summatube/auth-modal"
import { Coins, AlertCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

type AppState = "idle" | "loading" | "result"

interface SummaryResult {
  videoId: string
  videoTitle: string
  channelName: string
  thumbnailUrl: string
  summary: string
  keyPoints: string[]
  timestamps: { time: string; label: string }[]
  remainingCredits?: number
}

function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
  ]
  return patterns.some((p) => p.test(url))
}

export default function Page() {
  const [state, setState] = useState<AppState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')
  const [result, setResult] = useState<SummaryResult | null>(null)
  
  const { user, credits, loading, refreshCredits } = useAuth()

  const handleSubmit = useCallback(async (url: string) => {
    if (!isValidYouTubeUrl(url)) {
      setError("Пожалуйста, введите корректную ссылку на YouTube видео")
      return
    }

    setError(null)
    setState("loading")

    try {
      // Get auth token
      const token = localStorage.getItem('supabase_token')
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401 && data.requiresAuth) {
          // Need to authenticate
          setAuthModalTab('login')
          setAuthModalOpen(true)
          setError(data.error || 'Требуется авторизация')
          setState("idle")
          return
        }
        throw new Error(data.error || 'Ошибка при создании саммари')
      }

      // Refresh credits after successful summary
      await refreshCredits()
      
      setResult(data)
      setState("result")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
      setState("idle")
    }
  }, [refreshCredits])

  const handleReset = useCallback(() => {
    setState("idle")
    setError(null)
    setResult(null)
  }, [])

  const handleAuthRequired = () => {
    setAuthModalTab('login')
    setAuthModalOpen(true)
  }

  // Use mock data for demo when not logged in
  const MOCK_RESULT: SummaryResult = {
    videoId: "aircAruvnKk",
    videoTitle: "Как устроена нейросеть GPT — простое объяснение для каждого",
    channelName: "Технологии будущего",
    thumbnailUrl: "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
    summary: "В этом видео автор подробно разбирает архитектуру больших языковых моделей семейства GPT. Объяснение начинается с базовых понятий нейронных сетей и токенизации текста, затем переходит к механизму внимания (attention), который является ключевой инновацией архитектуры Transformer. Автор использует наглядные визуализации, чтобы показать, как модель обрабатывает входной текст и генерирует ответы токен за токеном.",
    keyPoints: [
      "GPT основан на архитектуре Transformer, предложенной Google в 2017 году в статье «Attention Is All You Need»",
      "Токенизация разбивает текст на подслова, а не на отдельные символы или целые слова, что обеспечивает баланс между словарным запасом и гибкостью",
      "Механизм самовнимания (self-attention) позволяет модели учитывать контекст всего предложения при обработке каждого токена",
      "Обучение происходит на огромных объёмах текстов из интернета с помощью метода предсказания следующего токена",
      "Fine-tuning и RLHF (обучение с подкреплением на основе обратной связи от человека) делают модель полезной и безопасной",
    ],
    timestamps: [
      { time: "00:00", label: "Введение и мотивация" },
      { time: "02:15", label: "Что такое нейронная сеть" },
      { time: "05:40", label: "Токенизация текста" },
      { time: "08:30", label: "Механизм внимания (Attention)" },
      { time: "14:20", label: "Архитектура Transformer" },
      { time: "19:45", label: "Обучение модели и RLHF" },
      { time: "24:10", label: "Итоги и выводы" },
    ],
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />

      {/* Show credits error if user has no credits */}
      {error && state !== "loading" && (
        <div className="mx-auto max-w-[880px] w-full px-6 pt-4">
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleAuthRequired}>
              Войти
            </Button>
          </div>
        </div>
      )}

      {/* Idle state: full-screen hero with centered input */}
      {state === "idle" && (
        <HeroInput onSubmit={handleSubmit} error={error} />
      )}

      {/* Loading state: compact input + skeleton card */}
      {state === "loading" && (
        <main className="flex-1 pt-8">
          <HeroInput onSubmit={handleSubmit} compact error={error} />
          <LoadingState />
        </main>
      )}

      {/* Result state: compact input + result card */}
      {state === "result" && (
        <main className="flex-1 pt-8">
          <HeroInput onSubmit={handleSubmit} compact error={error} />
          <ResultCard result={result || MOCK_RESULT} onReset={handleReset} />
        </main>
      )}

      {/* Minimal footer */}
      <footer className="py-5">
        <p className="text-center text-[11px] text-muted-foreground/40">
          {'SummaTube — AI-саммари YouTube видео'}
        </p>
      </footer>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />
    </div>
  )
}
