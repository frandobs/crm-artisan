'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthState = string | null

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email    = (formData.get('email')    as string).trim()
  const password = formData.get('password') as string

  if (!email || !password) return 'Email and password are required.'
  if (password.length < 6)  return 'Password must be at least 6 characters.'

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) return error.message

  redirect('/clients')
}

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email    = (formData.get('email')    as string).trim()
  const password = formData.get('password') as string

  if (!email || !password) return 'Email and password are required.'

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return error.message

  redirect('/clients')
}

export async function signOutAction(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
