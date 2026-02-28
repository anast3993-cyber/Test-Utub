import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserProfile } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0]
        }
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // If email confirmation is required, tell the user
    if (data.user && !data.session) {
      return NextResponse.json({
        message: 'Регистрация успешна! Проверьте email для подтверждения.',
        requiresEmailConfirmation: true
      })
    }

    // Get user profile and credits after successful registration
    if (data.user && data.session) {
      const profile = await getUserProfile(data.user.id)
      
      return NextResponse.json({
        user: {
          id: data.user.id,
          email: data.user.email,
          ...profile?.profile
        },
        session: data.session,
        credits: profile?.credits?.credits ?? 5
      })
    }

    return NextResponse.json({
      user: data.user,
      session: data.session
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
