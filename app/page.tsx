"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/summatube/header"
import { HeroInput } from "@/components/summatube/hero-input"
import { LoadingState } from "@/components/summatube/loading-state"
import { ResultCard } from "@/components/summatube/result-card"

type AppState = "idle" | "loading" | "result"

const MOCK_RESULT = {
  videoTitle:
    "Как устроена нейросеть GPT \u2014 простое объяснение для каждого",
  channelName: "Технологии будущего",
  thumbnailUrl:
    "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
  summary:
    "В этом видео автор подробно разбирает архитектуру больших языковых моделей семейства GPT. Объяснение начинается с базовых понятий нейронных сетей и токенизации текста, затем переходит к механизму внимания (attention), который является ключевой инновацией архитектуры Transformer. Автор использует наглядные визуализации, чтобы показать, как модель обрабатывает входной текст и генерирует ответы токен за токеном.",
  keyPoints: [
    "GPT основан на архитектуре Transformer, предложенной Google в 2017 году в статье \u00ABAttention Is All You Need\u00BB",
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

  const handleSubmit = useCallback((url: string) => {
    if (!isValidYouTubeUrl(url)) {
      setError("Пожалуйста, введите корректную ссылку на YouTube видео")
      return
    }

    setError(null)
    setState("loading")

    // Simulate AI processing (replace with real API call)
    setTimeout(() => {
      setState("result")
    }, 3200)
  }, [])

  const handleReset = useCallback(() => {
    setState("idle")
    setError(null)
  }, [])

  return (
    <div className="flex min-h-svh flex-col">
      <Header />

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
          <ResultCard result={MOCK_RESULT} onReset={handleReset} />
        </main>
      )}

      {/* Minimal footer */}
      <footer className="py-5">
        <p className="text-center text-[11px] text-muted-foreground/40">
          {'SummaTube \u2014 AI-\u0441\u0430\u043C\u043C\u0430\u0440\u0438 YouTube \u0432\u0438\u0434\u0435\u043E'}
        </p>
      </footer>
    </div>
  )
}
