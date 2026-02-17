"use client"

import { useState } from "react"
import { ArrowRight, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroInputProps {
  onSubmit: (url: string) => void
  compact?: boolean
  error?: string | null
}

export function HeroInput({ onSubmit, compact = false, error }: HeroInputProps) {
  const [url, setUrl] = useState("")
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim())
    }
  }

  // Compact mode: small input bar at top of page (loading / result states)
  if (compact) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6">
        <form onSubmit={handleSubmit}>
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-2xl border bg-card px-4 py-2.5 shadow-sm transition-all duration-300",
              focused && "border-foreground/20 shadow-md",
              error && "border-destructive"
            )}
          >
            <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <Button
              type="submit"
              size="sm"
              className="h-8 shrink-0 rounded-xl bg-primary px-3.5 text-primary-foreground transition-all hover:bg-primary/85 active:scale-95"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Summarize</span>
            </Button>
          </div>
          {error && (
            <p className="mt-2.5 text-center text-sm text-destructive animate-fade-up">
              {error}
            </p>
          )}
        </form>
      </div>
    )
  }

  // Full hero mode: centered on screen (idle state)
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="mx-auto w-full max-w-[640px] text-center">
        {/* Badge */}
        <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3.5 py-1.5 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            AI-powered
          </span>
        </div>

        {/* H1 - big, centered */}
        <h1 className="animate-fade-up-delay-1 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-[3.5rem] md:leading-[1.1]">
          Смотрите меньше,
          <br />
          знайте больше.
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up-delay-2 mx-auto mt-5 max-w-[460px] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
          Вставьте ссылку на YouTube ролик, и ИИ подготовит краткий пересказ за секунды.
        </p>

        {/* Input group */}
        <form onSubmit={handleSubmit} className="animate-fade-up-delay-3 mt-10">
          <div
            className={cn(
              "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:rounded-2xl sm:border sm:bg-card sm:p-1.5 sm:shadow-lg sm:transition-all sm:duration-300",
              focused && "sm:border-foreground/20 sm:shadow-xl",
              error && "sm:border-destructive"
            )}
          >
            {/* Input field */}
            <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 shadow-lg sm:flex-1 sm:border-0 sm:bg-transparent sm:px-3 sm:py-2.5 sm:shadow-none">
              <Link2 className="h-5 w-5 shrink-0 text-muted-foreground/60" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none sm:text-[15px]"
              />
            </div>

            {/* Action button */}
            <Button
              type="submit"
              className="h-12 w-full rounded-2xl bg-primary px-6 text-base font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/85 hover:shadow-md active:scale-[0.98] sm:h-10 sm:w-auto sm:rounded-xl sm:px-5 sm:text-sm"
            >
              Суммировать
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-destructive animate-fade-up">
              {error}
            </p>
          )}
        </form>

        {/* Sub-note */}
        <p className="animate-fade-up-delay-3 mt-6 text-xs text-muted-foreground/50">
          {'Бесплатно \u00B7 Без регистрации \u00B7 Без ограничений'}
        </p>
      </div>
    </main>
  )
}
