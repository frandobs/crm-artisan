import Link from 'next/link'
import { MapPin, User } from 'lucide-react'
import type { Quote, QuoteStatus } from '@/lib/quotes'
import { calculateQuoteTotal } from '@/lib/calculate-quote-total'
import DeleteQuoteButton from './DeleteQuoteButton'

const chipClass: Record<QuoteStatus, string> = {
  draft:    'chip chip-draft',
  sent:     'chip chip-sent',
  accepted: 'chip chip-accepted',
  declined: 'chip chip-rejected',
}
const statusLabel: Record<QuoteStatus, string> = {
  draft:    'Draft',
  sent:     'Sent',
  accepted: 'Accepted',
  declined: 'Declined',
}

export default function QuoteCard({ quote }: { quote: Quote }) {
  const { total } = calculateQuoteTotal(quote.line_items, quote.tax_rate)

  return (
    <div className="card card-pressable flex items-start gap-2">
      <Link href={`/quotes/${quote.id}`} className="flex-1 min-w-0 block">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-[13px] font-semibold" style={{ color: 'var(--color-neutral-500)' }}>
            {quote.number}
          </p>
          <span className={chipClass[quote.status]} style={{ flexShrink: 0 }}>
            {statusLabel[quote.status]}
          </span>
        </div>
        <p className="font-semibold text-base mb-2" style={{ color: 'var(--color-neutral-900)' }}>
          {quote.title}
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MapPin size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
            <span className="text-[13px] text-neutral-500 truncate">{quote.job_site_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
            <span className="text-[13px] text-neutral-500 truncate">{quote.client_name}</span>
          </div>
        </div>
        {total > 0 && (
          <p className="mt-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
            {total.toFixed(2)}
          </p>
        )}
      </Link>
      <DeleteQuoteButton quoteId={quote.id} />
    </div>
  )
}
