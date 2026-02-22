import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// Get user profile with credits
export async function getUserProfile(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  const { data: credits, error: creditsError } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (profileError || creditsError) return null

  return { profile, credits }
}

// Get user credits
export async function getUserCredits(userId: string) {
  const { data, error } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data?.credits ?? 0
}

// Deduct credit (when user uses the service)
export async function deductCredit(userId: string, amount: number = 1) {
  // First get current credits
  const { data: current, error: getError } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', userId)
    .single()

  if (getError || !current) return { success: false, error: getError?.message }

  if (current.credits < amount) {
    return { success: false, error: 'Недостаточно кредитов' }
  }

  // Deduct credit
  const { error: updateError } = await supabase
    .from('user_credits')
    .update({
      credits: current.credits - amount,
      total_spent: current.credits - amount,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (updateError) return { success: false, error: updateError.message }

  // Record transaction
  await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount: -amount,
      type: 'spent',
      description: 'Использование сервиса'
    })

  return { success: true }
}
