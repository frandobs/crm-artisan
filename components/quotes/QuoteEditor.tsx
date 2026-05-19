'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, X, Download } from 'lucide-react'
import { saveQuoteAction, type QuoteState } from '@/lib/actions/quotes'
import { calculateQuoteTotal } from '@/lib/calculate-quote-total'
import type { Quote } from '@/lib/quotes'
import type { JobSite } from '@/lib/job-sites'

type LineItemDraft = { key: string; description: string; quantity: string; unit_price: string }

export default function QuoteEditor({
  quote,
  jobSites,
  defaultJobSiteId,
}: {
  quote: Quote | null
  jobSites: JobSite[]
  defaultJobSiteId?: string
}) {
  const action = saveQuoteAction.bind(null, quote?.id ?? null)
  const [state, formAction, pending] = useActionState<QuoteState, FormData>(action, null)

  const [items, setItems] = useState<LineItemDraft[]>(
    quote?.line_items.map(li => ({
      key: li.id,
      description: li.description,
      quantity:    String(li.quantity),
      unit_price:  String(li.unit_price),
    })) ?? []
  )
  const [taxRate, setTaxRate] = useState(String(quote?.tax_rate ?? 0))
  const [lastIntent, setLastIntent] = useState<'draft' | 'send' | null>(null)

  const totals = calculateQuoteTotal(items, taxRate)

  function addItem() {
    setItems(prev => [...prev, { key: `new-${Date.now()}`, description: '', quantity: '1', unit_price: '0' }])
  }

  function updateItem(idx: number, field: keyof Omit<LineItemDraft, 'key'>, value: string) {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const titleError = state?.fieldErrors?.title
  const siteError  = state?.fieldErrors?.job_site_id

  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* Header */}
      <div className="screen-header gap-3">
        <Link href="/quotes" aria-label="Back">
          <ArrowLeft size={24} strokeWidth={1.75} style={{ color: 'var(--color-neutral-900)' }} />
        </Link>
        <h1 className="screen-title flex-1">
          {quote ? quote.number : 'New quote'}
        </h1>
      </div>

      <form action={formAction} className="flex flex-col gap-5 p-4 pb-10">

        {/* Server error */}
        {state?.message && (
          <div className="rounded-md p-4" style={{ backgroundColor: '#FFEBEE' }}>
            <p className="text-[13px] font-medium" style={{ color: 'var(--color-danger)' }}>
              {state.message}
            </p>
          </div>
        )}

        {/* Job site */}
        <div>
          <label className="input-label" htmlFor="job_site_id">
            Job site <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <select
            id="job_site_id" name="job_site_id"
            disabled={pending}
            defaultValue={quote?.job_site_id ?? defaultJobSiteId ?? ''}
            className={`input-field${siteError ? ' error' : ''}`}
          >
            <option value="" disabled>Select a job site…</option>
            {jobSites.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.client_name}
              </option>
            ))}
          </select>
          {siteError && <p className="input-error">{siteError}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="input-label" htmlFor="title">
            Title <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            id="title" name="title" type="text"
            defaultValue={quote?.title ?? ''}
            disabled={pending}
            className={`input-field${titleError ? ' error' : ''}`}
          />
          {titleError && <p className="input-error">{titleError}</p>}
        </div>

        {/* Issue date */}
        <div>
          <label className="input-label" htmlFor="issue_date">Issue date</label>
          <input
            id="issue_date" name="issue_date" type="date"
            defaultValue={quote?.issue_date ?? new Date().toISOString().split('T')[0]}
            disabled={pending}
            className="input-field"
          />
        </div>

        {/* Expiry date */}
        <div>
          <label className="input-label" htmlFor="expiry_date">Expiry date</label>
          <input
            id="expiry_date" name="expiry_date" type="date"
            defaultValue={quote?.expiry_date ?? ''}
            disabled={pending}
            className="input-field"
          />
        </div>

        {/* Tax rate */}
        <div>
          <label className="input-label" htmlFor="tax_rate">Tax rate (%)</label>
          <input
            id="tax_rate" name="tax_rate" type="number"
            min="0" max="100" step="0.01"
            value={taxRate}
            onChange={e => setTaxRate(e.target.value)}
            disabled={pending}
            className="input-field"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="input-label" htmlFor="notes">Notes</label>
          <textarea
            id="notes" name="notes" rows={3}
            defaultValue={quote?.notes ?? ''}
            disabled={pending}
            className="input-field"
            style={{ height: 'auto', paddingTop: '14px', paddingBottom: '14px', resize: 'none' }}
          />
        </div>

        {/* Line items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="section-header">Line items</span>
            <button
              type="button"
              onClick={addItem}
              disabled={pending}
              className="flex items-center gap-1 text-[13px] font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add item
            </button>
          </div>

          {items.length === 0 && (
            <p className="text-[13px] text-center py-4" style={{ color: 'var(--color-neutral-500)' }}>
              No items yet — tap "Add item" to start.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {items.map((item, idx) => {
              const qty   = Math.max(0, parseFloat(item.quantity)   || 0)
              const price = Math.max(0, parseFloat(item.unit_price) || 0)

              return (
                <div key={item.key} className="card relative">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={pending}
                    className="absolute top-3 right-3 flex items-center justify-center w-7 h-7"
                    style={{ color: 'var(--color-neutral-500)' }}
                    aria-label="Remove item"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>

                  <div className="mb-3 pr-8">
                    <label className="input-label" htmlFor={`desc-${idx}`}>Description</label>
                    <input
                      id={`desc-${idx}`}
                      name={`items[${idx}][description]`}
                      type="text"
                      value={item.description}
                      onChange={e => updateItem(idx, 'description', e.target.value)}
                      disabled={pending}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="input-label" htmlFor={`qty-${idx}`}>Qty</label>
                      <input
                        id={`qty-${idx}`}
                        name={`items[${idx}][quantity]`}
                        type="number" step="any" min="0.01"
                        value={item.quantity}
                        onChange={e => updateItem(idx, 'quantity', e.target.value)}
                        disabled={pending}
                        className="input-field text-right"
                      />
                    </div>
                    <div>
                      <label className="input-label" htmlFor={`price-${idx}`}>Unit price</label>
                      <input
                        id={`price-${idx}`}
                        name={`items[${idx}][unit_price]`}
                        type="number" step="any" min="0"
                        value={item.unit_price}
                        onChange={e => updateItem(idx, 'unit_price', e.target.value)}
                        disabled={pending}
                        className="input-field text-right"
                      />
                    </div>
                    <div>
                      <label className="input-label">Total</label>
                      <div
                        className="input-field flex items-center justify-end font-medium"
                        style={{ backgroundColor: 'var(--color-neutral-200)', userSelect: 'none' }}
                      >
                        {(qty * price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Totals */}
        {items.length > 0 && (
          <div className="card flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px]" style={{ color: 'var(--color-neutral-500)' }}>Subtotal</span>
              <span className="text-[13px] font-medium">{totals.subtotal.toFixed(2)}</span>
            </div>
            {parseFloat(taxRate) > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[13px]" style={{ color: 'var(--color-neutral-500)' }}>Tax ({taxRate}%)</span>
                <span className="text-[13px] font-medium">{totals.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="divider" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                {totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <button
          type="submit" name="intent" value="draft"
          disabled={pending}
          onClick={() => setLastIntent('draft')}
          className="btn btn-secondary"
        >
          {pending && lastIntent === 'draft'
            ? <><Loader2 size={18} className="animate-spin mr-2" />Saving…</>
            : 'Save draft'
          }
        </button>
        <button
          type="submit" name="intent" value="send"
          disabled={pending}
          onClick={() => setLastIntent('send')}
          className="btn btn-primary"
        >
          {pending && lastIntent === 'send'
            ? <><Loader2 size={18} className="animate-spin mr-2" />Sending…</>
            : 'Send quote'
          }
        </button>

        {quote && (
          <a
            href={`/api/quotes/${quote.id}/pdf`}
            download={`${quote.number}.pdf`}
            className="btn btn-secondary flex items-center justify-center gap-2"
          >
            <Download size={16} strokeWidth={2} />
            Download PDF
          </a>
        )}

      </form>
    </div>
  )
}
