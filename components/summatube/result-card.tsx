"use client"

import { useState } from "react"
import {
  Copy,
  Check,
  Share2,
  RotateCcw,
  Clock,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Timestamp {
  time: string
  label: string
}

interface SummaryResult {
  videoTitle: string
  channelName: string
  thumbnailUrl: string
  summary: string
  keyPoints: string[]
  timestamps: Timestamp[]
}

interface ResultCardProps {
  result: SummaryResult
  onReset: () => void
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = `${result.videoTitle}\n\n${result.summary}\n\nКлючевые тезисы:\n${result.keyPoints.map((p) => `- ${p}`).join("\n")}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `SummaTube: ${result.videoTitle}`,
        text: result.summary,
      })
    } else {
      handleCopy()
    }
  }

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 animate-fade-up">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Video info header */}
        <div className="flex items-start gap-4 border-b border-border/50 p-6">
          <div className="relative h-[72px] w-[128px] shrink-0 overflow-hidden rounded-xl bg-muted">
            <img
              src={result.thumbnailUrl}
              alt={result.videoTitle}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card/90 shadow-sm backdrop-blur-sm">
                <div className="ml-0.5 h-0 w-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-foreground" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h2 className="text-[15px] font-semibold leading-snug text-foreground line-clamp-2">
              {result.videoTitle}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {result.channelName}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {/* Summary section */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Краткое содержание
            </h3>
            <p className="mt-3.5 text-[15px] leading-[1.7] text-foreground/85">
              {result.summary}
            </p>
          </div>

          {/* Key points */}
          {result.keyPoints.length > 0 && (
            <div className="mt-7">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Ключевые тезисы
              </h3>
              <ul className="mt-3.5 space-y-3">
                {result.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-[1.6] text-foreground/85">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timestamps */}
          {result.timestamps.length > 0 && (
            <div className="mt-7">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Таймкоды
              </h3>
              <div className="mt-3.5 space-y-1">
                {result.timestamps.map((ts, i) => (
                  <button
                    key={i}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-200 hover:bg-secondary/70"
                  >
                    <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    <span className="text-xs font-mono font-semibold text-foreground/70 tabular-nums">
                      {ts.time}
                    </span>
                    <span className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                      {ts.label}
                    </span>
                    <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions footer */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border/50 px-6 py-3.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-lg text-xs text-muted-foreground transition-all duration-200 hover:text-foreground"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Копировать текст
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-lg text-xs text-muted-foreground transition-all duration-200 hover:text-foreground"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" />
            Поделиться
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-lg text-xs transition-all duration-200"
            onClick={onReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Суммировать другое видео
          </Button>
        </div>
      </div>
    </div>
  )
}
