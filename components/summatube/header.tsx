"use client"

import { Play } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-14 max-w-[880px] items-center justify-between px-6">
        {/* Logo - left */}
        <a href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Play className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            SummaTube
          </span>
        </a>

        {/* Dark mode toggle - right */}
        <ThemeToggle />
      </div>
    </header>
  )
}
