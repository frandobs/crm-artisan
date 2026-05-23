import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'

// Make NEXT_PUBLIC_* vars available to global setup (runs outside Next.js)
try {
  const raw = fs.readFileSync('.env.local', 'utf-8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.+)$/)
    if (m) process.env[m[1]] ??= m[2].trim()
  }
} catch {}

export default defineConfig({
  testDir:       './tests',
  fullyParallel: false,
  workers:       1,
  timeout:       30_000,
  expect:        { timeout: 10_000 },
  reporter:      'list',
  globalSetup:   './tests/global.setup.ts',

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command:             'npm run dev',
    url:                 'http://localhost:3000',
    reuseExistingServer: true,
    timeout:             30_000,
  },
})
