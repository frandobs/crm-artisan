export type LineItemInput = { quantity: number | string; unit_price: number | string }
export type QuoteTotals  = { subtotal: number; taxAmount: number; total: number }

export function calculateQuoteTotal(
  items: LineItemInput[],
  taxRate: number | string,
): QuoteTotals {
  const rate = Math.max(0, parseFloat(String(taxRate)) || 0)
  const subtotal = items.reduce((sum, item) => {
    const qty   = Math.max(0, parseFloat(String(item.quantity))   || 0)
    const price = Math.max(0, parseFloat(String(item.unit_price)) || 0)
    return sum + qty * price
  }, 0)
  const taxAmount = subtotal * (rate / 100)
  return { subtotal, taxAmount, total: subtotal + taxAmount }
}
