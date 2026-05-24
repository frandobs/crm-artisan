import { describe, it, expect } from 'vitest'
import { calculateQuoteTotal } from '../../lib/calculate-quote-total'

describe('calculateQuoteTotal', () => {
  it('returns zero for an empty item list', () => {
    expect(calculateQuoteTotal([], 0)).toEqual({ subtotal: 0, taxAmount: 0, total: 0 })
  })

  it('calculates a single line item with no tax', () => {
    const result = calculateQuoteTotal([{ quantity: 2, unit_price: 50 }], 0)
    expect(result).toEqual({ subtotal: 100, taxAmount: 0, total: 100 })
  })

  it('sums multiple line items and applies tax correctly', () => {
    const items = [
      { quantity: 8,  unit_price: 75  },
      { quantity: 1,  unit_price: 200 },
    ]
    const result = calculateQuoteTotal(items, 20)
    expect(result.subtotal).toBe(800)
    expect(result.taxAmount).toBe(160)
    expect(result.total).toBe(960)
  })

  it('ignores a line item where quantity is 0', () => {
    const items = [
      { quantity: 0, unit_price: 999 },
      { quantity: 3, unit_price: 10  },
    ]
    const result = calculateQuoteTotal(items, 0)
    expect(result.subtotal).toBe(30)
  })

  it('handles a very high price without floating-point drift', () => {
    // 99 999.99 × 1 000 = 99 999 990 — representable exactly in IEEE 754
    const result = calculateQuoteTotal([{ quantity: 1000, unit_price: 99_999.99 }], 0)
    expect(result.subtotal).toBeCloseTo(99_999_990, 2)
    expect(result.total).toBeCloseTo(99_999_990, 2)
  })

  it('parses string inputs (as received from form data)', () => {
    const result = calculateQuoteTotal([{ quantity: '3', unit_price: '25.50' }], '10')
    expect(result.subtotal).toBeCloseTo(76.5)
    expect(result.taxAmount).toBeCloseTo(7.65)
    expect(result.total).toBeCloseTo(84.15)
  })

  it('does not crash on a negative quantity and treats it as zero', () => {
    expect(() => calculateQuoteTotal([{ quantity: -5, unit_price: 100 }], 0)).not.toThrow()
    const result = calculateQuoteTotal([{ quantity: -5, unit_price: 100 }], 0)
    expect(result.subtotal).toBe(0)
  })
})
