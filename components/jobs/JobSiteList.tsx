'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Wrench, CheckCircle2 } from 'lucide-react'
import type { JobSite, JobSiteStatus } from '@/lib/job-sites'
import JobSiteCard from './JobSiteCard'

type Filter = 'all' | JobSiteStatus

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Planned',   value: 'planned' },
  { label: 'Active',    value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const toastMessages: Record<string, string> = {
  added:   'Job site added',
  updated: 'Job site updated',
  deleted: 'Job site deleted',
}

export default function JobSiteList({
  jobSites,
  success,
}: {
  jobSites: JobSite[]
  success?: string
}) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')
  const [toastKey, setToastKey] = useState(success)

  useEffect(() => {
    if (!success) return
    router.replace('/jobs')
    const t = setTimeout(() => setToastKey(undefined), 3000)
    return () => clearTimeout(t)
  }, [success, router])

  const filtered = filter === 'all'
    ? jobSites
    : jobSites.filter(s => s.status === filter)

  return (
    <div className="flex flex-col min-h-full">

      {/* Header */}
      <div className="screen-header">
        <h1 className="screen-title flex-1">Jobs</h1>
        <Link
          href="/jobs/new"
          aria-label="Add job site"
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
        {jobSites.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <NoResults filter={filter as JobSiteStatus} />
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(site => (
              <JobSiteCard key={site.id} site={site} />
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
        <Wrench size={32} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
      </div>
      <p className="font-semibold text-base mb-1" style={{ color: 'var(--color-neutral-900)' }}>
        No job sites yet
      </p>
      <p className="text-[13px] text-neutral-500 mb-6">
        Add your first job site to start tracking work and quotes.
      </p>
      <Link href="/jobs/new" className="btn btn-primary" style={{ width: 'auto', paddingInline: '24px' }}>
        Add your first job site
      </Link>
    </div>
  )
}

function NoResults({ filter }: { filter: JobSiteStatus }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <Wrench size={32} strokeWidth={1.5} className="text-neutral-200 mb-3" />
      <p className="font-semibold text-base mb-1" style={{ color: 'var(--color-neutral-900)' }}>
        No {filter} job sites
      </p>
      <p className="text-[13px] text-neutral-500">Try a different filter.</p>
    </div>
  )
}
