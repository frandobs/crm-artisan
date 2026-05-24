import { describe, it, expect } from 'vitest'
import { isValidEmail } from '../../lib/validate-email'

describe('isValidEmail', () => {
  it('accepts a standard email address', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('accepts a minimal valid address', () => {
    expect(isValidEmail('a@b.c')).toBe(true)
  })

  it('rejects an address with no @', () => {
    expect(isValidEmail('nodomain.com')).toBe(false)
  })

  it('rejects a double @', () => {
    expect(isValidEmail('double@@example.com')).toBe(false)
  })

  it('rejects an address with a space', () => {
    expect(isValidEmail('has space@example.com')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })
})
