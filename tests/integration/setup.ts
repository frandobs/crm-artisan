import { readFileSync } from 'fs'

try {
  const raw = readFileSync('.env.local', 'utf-8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.+)$/)
    if (m) process.env[m[1]] ??= m[2].trim()
  }
} catch {}
