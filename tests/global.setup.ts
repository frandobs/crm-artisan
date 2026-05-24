import { test as setup } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

export const TEST_EMAIL    = 'test-e2e@crm-artisan.test'
export const TEST_PASSWORD = 'TestPass123!'
export const AUTH_FILE     = 'tests/.auth-state.json'

setup('create test user and save auth state', async ({ page }) => {
  // 1. Ensure the test user exists (idempotent — "already registered" is not a failure)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { error } = await supabase.auth.signUp({ email: TEST_EMAIL, password: TEST_PASSWORD })
  if (error && !error.message.toLowerCase().includes('already registered')) {
    throw new Error(`Test user setup failed: ${error.message}`)
  }

  // 2. Log in via browser and save the session cookies so CRUD tests skip login
  await page.goto('/login')
  await page.locator('#email').fill(TEST_EMAIL)
  await page.locator('#password').fill(TEST_PASSWORD)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/clients')
  await page.context().storageState({ path: AUTH_FILE })
})
