'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, CheckCircle2 } from 'lucide-react'
import type { Quote, QuoteStatus } from '@/lib/quotes'
import QuoteCard from './QuoteCard'

type Filter = 'all' | QuoteStatus

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All',      value: 'all' },
  { label: 'Draft',    value: 'draft' },
  { label: 'Sent',     value: 'sent' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Declined', value: 'declined' },
]

const toastMessages: Record<string, string> = {
  deleted: 'Quote deleted',
}

export default function QuoteList({ quotes, success }: { quotes: Quote[]; success?: string }) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')
  const [toastKey, setToastKey] = useState(success)

  useEffect(() => {
    if (!success) return
    setToastKey(success)
    const t = setTimeout(() => {
      setToastKey(undefined)
      router.replace('/quotes')
    }, 3000)
    return () => clearTimeout(t)
  }, [success, router])

  const filtered = filter === 'all'
    ? quotes
    : quotes.filter(q => q.status === filter)

  return (
    <div className="flex flex-col min-h-full">

      {/* Header */}
      <div className="screen-header">
        <h1 className="screen-title flex-1">Quotes</h1>
        <Link
          href="/quotes/new"
          aria-label="New quote"
          className="flex items-center justify-center w-9 h-9 rounded-md"
          style={{ backgroundColor: 'var(--color-primary-tint)', color: 'var(--color-primary)' }}
        >
          <Plus size={20} strokeWidth={2} />
        </Link>
      </div>

      {/* Success toast */}
      {toastKey && toastMessages[toastKey] && (
        <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#E8F5E9' }}>
          <CheckCircle2 size={16} strokeWidth={2} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
          <p className="text-[13px] font-medium" style={{ color: 'var(--color-success)' }}>
            {toastMessages[toastKey]}
          </p>
        </div>
      )}

      {/* Status filter chips */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className="chip shrink-0"
              style={
                filter === value
                  ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                  : { backgroundColor: '#fff', color: 'var(--color-neutral-500)', boxShadow: 'var(--shadow-card)' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-2 pb-4">
        {quotes.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <NoResults filter={filter as QuoteStatus} />
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(q => <QuoteCard key={q.id} quote={q} />)}
          </div>
        )}
      </div>

    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
        style={{ backgroundColor: 'var(--color-primary-tint)' }}
      >
        <FileText size={32} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
      </div>
      <p className="font-semibold text-base mb-1" style={{ color: 'var(--color-neutral-900)' }}>
        No quotes yet
      </p>
      <p className="text-[13px] text-neutral-500 mb-6">
        Create your first quote from a job site.
      </p>
      <Link href="/quotes/new" className="btn btn-primary" style={{ width: 'auto', paddingInline: '24px' }}>
        New quote
      </Link>
    </div>
  )
}

function NoResults({ filter }: { filter: QuoteStatus }) {
  const label: Record<QuoteStatus, string> = {
    draft: 'draft', sent: 'sent', accepted: 'accepted', declined: 'declined',
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <FileText size={32} strokeWidth={1.5} className="text-neutral-200 mb-3" />
      <p className="font-semibold text-base mb-1" style={{ color: 'var(--color-neutral-900)' }}>
        No {label[filter]} quotes
      </p>
      <p className="text-[13px] text-neutral-500">Try a different filter.</p>
    </div>
  )
}
