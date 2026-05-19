'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Calendar, CheckCircle2 } from 'lucide-react'
import type { Quote, QuoteStatus } from '@/lib/quotes'
import { calculateQuoteTotal } from '@/lib/calculate-quote-total'
import {
  revertToDraftAction,
  acceptQuoteAction,
  declineQuoteAction,
} from '@/lib/actions/quotes'

const chipClass: Record<QuoteStatus, string> = {
  draft:    'chip chip-draft',
  sent:     'chip chip-sent',
  accepted: 'chip chip-accepted',
  declined: 'chip chip-rejected',
}
const statusLabel: Record<QuoteStatus, string> = {
  draft: 'Draft', sent: 'Sent', accepted: 'Accepted', declined: 'Declined',
}
const toastMessage: Record<string, string> = {
  sent:     'Quote sent',
  accepted: 'Quote accepted',
  declined: 'Quote declined',
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function QuoteDetail({ quote, success }: { quote: Quote; success?: string }) {
  const router = useRouter()
  const [toastKey, setToastKey] = useState(success)

  useEffect(() => {
    if (!success) return
    router.replace(`/quotes/${quote.id}`)
    const t = setTimeout(() => setToastKey(undefined), 3000)
    return () => clearTimeout(t)
  }, [success, router, quote.id])

  const totals       = calculateQuoteTotal(quote.line_items, quote.tax_rate)
  const revertAction = revertToDraftAction.bind(null, quote.id)
  const acceptAction = acceptQuoteAction.bind(null, quote.id)
  const declineAction = declineQuoteAction.bind(null, quote.id)

  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* Header */}
      <div className="screen-header gap-3">
        <Link href="/quotes" aria-label="Back">
          <ArrowLeft size={24} strokeWidth={1.75} style={{ color: 'var(--color-neutral-900)' }} />
        </Link>
        <h1 className="screen-title flex-1">{quote.number}</h1>
        <span className={chipClass[quote.status]}>{statusLabel[quote.status]}</span>
      </div>

      <div className="flex flex-col gap-4 p-4 pb-10">

        {/* Success toast */}
        {toastKey && toastMessage[toastKey] && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-md" style={{ backgroundColor: '#E8F5E9' }}>
            <CheckCircle2 size={16} strokeWidth={2} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <p className="text-[13px] font-medium" style={{ color: 'var(--color-success)' }}>
              {toastMessage[toastKey]}
            </p>
          </div>
        )}

        {/* Meta card */}
        <div className="card flex flex-col gap-3">
          <p className="font-semibold text-base" style={{ color: 'var(--color-neutral-900)' }}>
            {quote.title}
          </p>
          <div className="divider" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
              <span className="text-[13px] text-neutral-500">{quote.job_site_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
              <span className="text-[13px] text-neutral-500">{quote.client_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
              <span className="text-[13px] text-neutral-500">
                {formatDate(quote.issue_date)}
                {quote.expiry_date && ` → ${formatDate(quote.expiry_date)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Line items */}
        {quote.line_items.length > 0 && (
          <div className="card">
            <p className="section-header mb-3">Line items</p>
            <div className="flex flex-col gap-3">
              {quote.line_items.map(item => (
                <div key={item.id}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[15px]">{item.description}</span>
                    <span className="text-[15px] font-medium shrink-0">
                      {(item.quantity * item.unit_price).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[13px]" style={{ color: 'var(--color-neutral-500)' }}>
                    {item.quantity} × {item.unit_price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="divider my-3" />
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-[13px]" style={{ color: 'var(--color-neutral-500)' }}>Subtotal</span>
                <span className="text-[13px] font-medium">{totals.subtotal.toFixed(2)}</span>
              </div>
              {quote.tax_rate > 0 && (
                <div className="flex justify-between">
                  <span className="text-[13px]" style={{ color: 'var(--color-neutral-500)' }}>Tax ({quote.tax_rate}%)</span>
                  <span className="text-[13px] font-medium">{totals.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {quote.notes && (
          <div className="card">
            <p className="section-header mb-2">Notes</p>
            <p className="text-[13px]" style={{ color: 'var(--color-neutral-900)', whiteSpace: 'pre-wrap' }}>
              {quote.notes}
            </p>
          </div>
        )}

        {/* Actions — sent only */}
        {quote.status === 'sent' && (
          <div className="flex flex-col gap-3">
            <form action={acceptAction}>
              <button type="submit" className="btn btn-primary">Mark accepted</button>
            </form>
            <form action={declineAction}>
              <button type="submit" className="btn btn-destructive">Mark declined</button>
            </form>
            <form action={revertAction}>
              <button type="submit" className="btn btn-ghost">Revert to draft</button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
