"use client"

export function LoadingState() {
  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 animate-fade-up">
      {/* Status line */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 rounded-full border-2 border-t-foreground animate-spin" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Анализируем видео...
          </p>
          <p className="text-xs text-muted-foreground">
            Нейросеть смотрит видео и выписывает главное
          </p>
        </div>
      </div>

      {/* Skeleton card */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Video info skeleton */}
        <div className="flex items-start gap-4 border-b border-border/60 p-6">
          <div className="h-[72px] w-[128px] shrink-0 rounded-xl bg-muted animate-shimmer" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-4 w-4/5 rounded-md bg-muted animate-shimmer" />
            <div className="h-3.5 w-2/5 rounded-md bg-muted animate-shimmer" />
          </div>
        </div>

        {/* Summary skeleton */}
        <div className="p-6 space-y-5">
          {/* Section header */}
          <div className="h-3 w-32 rounded bg-muted animate-shimmer" />

          {/* Paragraph lines */}
          <div className="space-y-2.5">
            <div className="h-3.5 w-full rounded bg-muted animate-shimmer" />
            <div className="h-3.5 w-[95%] rounded bg-muted animate-shimmer" />
            <div className="h-3.5 w-4/5 rounded bg-muted animate-shimmer" />
          </div>

          {/* Key points skeleton */}
          <div className="space-y-2.5 pt-1">
            <div className="h-3 w-28 rounded bg-muted animate-shimmer" />
            <div className="flex items-start gap-2.5">
              <div className="h-5 w-5 shrink-0 rounded bg-muted animate-shimmer" />
              <div className="h-3.5 w-full rounded bg-muted animate-shimmer" />
            </div>
            <div className="flex items-start gap-2.5">
              <div className="h-5 w-5 shrink-0 rounded bg-muted animate-shimmer" />
              <div className="h-3.5 w-11/12 rounded bg-muted animate-shimmer" />
            </div>
            <div className="flex items-start gap-2.5">
              <div className="h-5 w-5 shrink-0 rounded bg-muted animate-shimmer" />
              <div className="h-3.5 w-3/4 rounded bg-muted animate-shimmer" />
            </div>
          </div>

          {/* Timestamps skeleton */}
          <div className="space-y-2 pt-1">
            <div className="h-3 w-20 rounded bg-muted animate-shimmer" />
            <div className="h-8 w-full rounded-lg bg-muted/50 animate-shimmer" />
            <div className="h-8 w-full rounded-lg bg-muted/50 animate-shimmer" />
            <div className="h-8 w-full rounded-lg bg-muted/50 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}
