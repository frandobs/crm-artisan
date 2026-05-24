'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, Users, CheckCircle2 } from 'lucide-react'
import type { Client } from '@/lib/clients'
import ClientCard from './ClientCard'

const toastMessages: Record<string, string> = {
  added:   'Client added successfully',
  updated: 'Client updated',
  deleted: 'Client deleted',
}

export default function ClientList({ clients, success }: { clients: Client[]; success?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [toastKey, setToastKey] = useState(success)

  useEffect(() => {
    if (!success) return
    setToastKey(success)
    const t = setTimeout(() => {
      setToastKey(undefined)
      router.replace('/clients')
    }, 3000)
    return () => clearTimeout(t)
  }, [success, router])

  const filtered = query.trim()
    ? clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : clients

  return (
    <div className="flex flex-col min-h-full">

      {/* Header */}
      <div className="screen-header">
        <h1 className="screen-title flex-1">Clients</h1>
        <Link
          href="/clients/new"
          aria-label="Add client"
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

      {/* Search */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search
            size={18}
            strokeWidth={1.75}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"
          />
          <input
            type="text"
            placeholder="Search clients..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-2 pb-4">
        {clients.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <NoResults query={query} />
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
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
        <Users size={32} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
      </div>
      <p className="font-semibold text-base mb-1" style={{ color: 'var(--color-neutral-900)' }}>
        No clients yet
      </p>
      <p className="text-[13px] text-neutral-500 mb-6">
        Add your first client to start tracking jobs and quotes.
      </p>
      <Link href="/clients/new" className="btn btn-primary" style={{ width: 'auto', paddingInline: '24px' }}>
        Add your first client
      </Link>
    </div>
  )
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <Search size={32} strokeWidth={1.5} className="text-neutral-200 mb-3" />
      <p className="font-semibold text-base mb-1" style={{ color: 'var(--color-neutral-900)' }}>
        No results for &ldquo;{query}&rdquo;
      </p>
      <p className="text-[13px] text-neutral-500">Try a different name.</p>
    </div>
  )
}
