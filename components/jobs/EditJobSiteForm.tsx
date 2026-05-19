'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { updateJobSiteAction, type JobSiteState } from '@/lib/actions/job-sites'
import type { JobSite } from '@/lib/job-sites'
import type { Client } from '@/lib/clients'

export default function EditJobSiteForm({
  site,
  clients,
}: {
  site: JobSite
  clients: Client[]
}) {
  const action = updateJobSiteAction.bind(null, site.id)
  const [state, formAction, pending] = useActionState<JobSiteState, FormData>(action, null)

  const nameError   = state?.fieldErrors?.name
  const clientError = state?.fieldErrors?.client_id

  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* Header */}
      <div className="screen-header gap-3">
        <Link href="/jobs" aria-label="Back">
          <ArrowLeft size={24} strokeWidth={1.75} style={{ color: 'var(--color-neutral-900)' }} />
        </Link>
        <h1 className="screen-title">Edit job site</h1>
      </div>

      <form action={formAction} className="flex flex-col gap-5 p-4 pb-10">

        {state?.message && (
          <div className="rounded-md p-4" style={{ backgroundColor: '#FFEBEE' }}>
            <p className="text-[13px] font-medium" style={{ color: 'var(--color-danger)' }}>
              {state.message}
            </p>
          </div>
        )}

        {/* Client */}
        <div>
          <label className="input-label" htmlFor="client_id">
            Client <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <select
            id="client_id" name="client_id"
            disabled={pending}
            defaultValue={site.client_id}
            className={`input-field${clientError ? ' error' : ''}`}
          >
            <option value="" disabled>Select a client…</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {clientError && <p className="input-error">{clientError}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="input-label" htmlFor="name">
            Title <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            id="name" name="name" type="text"
            defaultValue={site.name}
            disabled={pending}
            className={`input-field${nameError ? ' error' : ''}`}
          />
          {nameError && <p className="input-error">{nameError}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="input-label" htmlFor="status">Status</label>
          <select
            id="status" name="status"
            disabled={pending}
            defaultValue={site.status}
            className="input-field"
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Start date */}
        <div>
          <label className="input-label" htmlFor="start_date">Start date</label>
          <input
            id="start_date" name="start_date" type="date"
            defaultValue={site.start_date ?? ''}
            disabled={pending}
            className="input-field"
          />
        </div>

        {/* Address */}
        <div>
          <label className="input-label" htmlFor="address">Address</label>
          <input
            id="address" name="address" type="text"
            autoComplete="street-address"
            defaultValue={site.address ?? ''}
            disabled={pending}
            className="input-field"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="input-label" htmlFor="notes">Notes</label>
          <textarea
            id="notes" name="notes" rows={4}
            defaultValue={site.notes ?? ''}
            disabled={pending}
            className="input-field"
            style={{ height: 'auto', paddingTop: '14px', paddingBottom: '14px', resize: 'none' }}
          />
        </div>

        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending
            ? <><Loader2 size={18} className="animate-spin mr-2" />Saving…</>
            : 'Save changes'
          }
        </button>

      </form>
    </div>
  )
}
