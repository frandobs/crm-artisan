import { test, expect, type Page } from '@playwright/test'

const TEST_EMAIL    = 'test-e2e@crm-artisan.test'
const TEST_PASSWORD = 'TestPass123!'

async function login(page: Page): Promise<void> {
  await page.goto('/login')
  await page.locator('#email').fill(TEST_EMAIL)
  await page.locator('#password').fill(TEST_PASSWORD)
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL('/clients')
}

async function logout(page: Page): Promise<void> {
  await page.locator('nav form button[type="submit"]').click()
  await expect(page).toHaveURL('/login')
}

// ── Protected route redirects ─────────────────────────────────────────────

test.describe('Unauthenticated redirects', () => {
  for (const path of ['/', '/clients', '/jobs', '/quotes', '/dashboard']) {
    test(`${path} redirects to /login`, async ({ page }) => {
      await page.goto(path)
      await expect(page).toHaveURL('/login')
    })
  }
})

// ── Signup ────────────────────────────────────────────────────────────────

test.describe('Signup', () => {
  test('new account lands in app immediately — no email confirmation required', async ({ page }) => {
    const email = `testuser${Date.now()}@crm-artisan.test`
    await page.goto('/signup')
    await page.locator('#email').fill(email)
    await page.locator('#password').fill(TEST_PASSWORD)
    await page.locator('button[type="submit"]').click()
    await expect(page).toHaveURL('/clients')
  })

  test('shows error for password shorter than 6 characters', async ({ page }) => {
    await page.goto('/signup')
    await page.locator('#email').fill('short@example.com')
    await page.locator('#password').fill('abc')
    await page.locator('button[type="submit"]').click()
    await expect(page.getByTestId('auth-error')).toBeVisible()
    await expect(page).toHaveURL('/signup')
  })
})

// ── Login ─────────────────────────────────────────────────────────────────

test.describe('Login', () => {
  test('existing user lands on /clients after login', async ({ page }) => {
    await login(page)
  })

  test('wrong password shows an error', async ({ page }) => {
    await page.goto('/login')
    await page.locator('#email').fill(TEST_EMAIL)
    await page.locator('#password').fill('wrongpassword')
    await page.locator('button[type="submit"]').click()
    await expect(page.getByTestId('auth-error')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('logged-in user visiting /login is redirected to /clients', async ({ page }) => {
    await login(page)
    await page.goto('/login')
    await expect(page).toHaveURL('/clients')
  })
})

// ── Logout ────────────────────────────────────────────────────────────────

test.describe('Logout', () => {
  test('clicking log out returns to /login', async ({ page }) => {
    await login(page)
    await logout(page)
  })

  test('/clients redirects to /login after logout', async ({ page }) => {
    await login(page)
    await logout(page)
    await page.goto('/clients')
    await expect(page).toHaveURL('/login')
  })
})
