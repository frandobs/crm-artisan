import { describe, it, expect } from 'vitest'
import { canTransition } from '../../lib/job-site-transitions'

describe('canTransition', () => {
  it('allows planned → active', () => {
    expect(canTransition('planned', 'active')).toBe(true)
  })

  it('allows active → completed', () => {
    expect(canTransition('active', 'completed')).toBe(true)
  })

  it('allows planned → cancelled', () => {
    expect(canTransition('planned', 'cancelled')).toBe(true)
  })

  it('allows active → cancelled', () => {
    expect(canTransition('active', 'cancelled')).toBe(true)
  })

  it('blocks completed → planned', () => {
    expect(canTransition('completed', 'planned')).toBe(false)
  })

  it('blocks completed → active', () => {
    expect(canTransition('completed', 'active')).toBe(false)
  })

  it('blocks cancelled → any other status', () => {
    expect(canTransition('cancelled', 'planned')).toBe(false)
    expect(canTransition('cancelled', 'active')).toBe(false)
    expect(canTransition('cancelled', 'completed')).toBe(false)
  })
})
