import { createClient } from '@supabase/supabase-js'

export const TEST_EMAIL    = 'test-e2e@crm-artisan.test'
export const TEST_PASSWORD = 'TestPass123!'

export default async function globalSetup() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { error } = await supabase.auth.signUp({
    email:    TEST_EMAIL,
    password: TEST_PASSWORD,
  })

  // "User already registered" is expected on repeat runs — not a failure
  if (error && !error.message.toLowerCase().includes('already registered')) {
    throw new Error(`Test user setup failed: ${error.message}`)
  }
}
