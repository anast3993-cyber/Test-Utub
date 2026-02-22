"use client"

import { useState } from 'react'
import { Play, Coins, LogOut, User as UserIcon } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { AuthModal } from './auth-modal'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')
  const { user, credits, signOut, loading } = useAuth()

  const handleLoginClick = () => {
    setAuthModalTab('login')
    setAuthModalOpen(true)
  }

  const handleRegisterClick = () => {
    setAuthModalTab('register')
    setAuthModalOpen(true)
  }

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <>
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

          {/* Right side - auth & theme */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <>
                {/* Credits display */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950 rounded-full border border-amber-200 dark:border-amber-800">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    {credits}
                  </span>
                </div>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getUserInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.full_name || user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleLoginClick}>
                  Войти
                </Button>
                <Button size="sm" onClick={handleRegisterClick}>
                  Регистрация
                </Button>
              </>
            )}

            <ThemeToggle />
          </div>
        </div>
      </header>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />
    </>
  )
}
