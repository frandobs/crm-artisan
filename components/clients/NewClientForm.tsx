'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClientAction, type CreateClientState } from '@/lib/actions/clients'

export default function NewClientForm() {
  const [state, action, pending] = useActionState<CreateClientState, FormData>(
    createClientAction,
    null
  )
  const [localErrors, setLocalErrors] = useState<{ name?: string; email?: string }>({})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget)
    const name  = (data.get('name')  as string ?? '').trim()
    const email = (data.get('email') as string ?? '').trim()

    const errors: { name?: string; email?: string } = {}
    if (!name) errors.name = 'Name is required'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = 'Enter a valid email address'

    if (Object.keys(errors).length > 0) {
      e.preventDefault()
      setLocalErrors(errors)
      return
    }
    setLocalErrors({})
  }

  const nameError  = localErrors.name  ?? state?.fieldErrors?.name
  const emailError = localErrors.email ?? state?.fieldErrors?.email

  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* Header */}
      <div className="screen-header gap-3">
        <Link href="/clients" aria-label="Back">
          <ArrowLeft size={24} strokeWidth={1.75} style={{ color: 'var(--color-neutral-900)' }} />
        </Link>
        <h1 className="screen-title">New client</h1>
      </div>

      <form action={action} onSubmit={handleSubmit} className="flex flex-col gap-5 p-4 pb-10">

        {/* General server error */}
        {state?.message && (
          <div className="rounded-md p-4" style={{ backgroundColor: '#FFEBEE' }}>
            <p className="text-[13px] font-medium" style={{ color: 'var(--color-danger)' }}>
              {state.message}
            </p>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="input-label" htmlFor="name">
            Name <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            id="name" name="name" type="text"
            autoComplete="name"
            disabled={pending}
            onChange={() => localErrors.name && setLocalErrors(p => ({ ...p, name: undefined }))}
            className={`input-field${nameError ? ' error' : ''}`}
          />
          {nameError && <p className="input-error">{nameError}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="input-label" htmlFor="phone">Phone</label>
          <input
            id="phone" name="phone" type="tel"
            autoComplete="tel"
            disabled={pending}
            className="input-field"
          />
        </div>

        {/* Email */}
        <div>
          <label className="input-label" htmlFor="email">Email</label>
          <input
            id="email" name="email" type="text"
            autoComplete="email"
            disabled={pending}
            onChange={() => localErrors.email && setLocalErrors(p => ({ ...p, email: undefined }))}
            className={`input-field${emailError ? ' error' : ''}`}
          />
          {emailError && <p className="input-error">{emailError}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="input-label" htmlFor="address">Address</label>
          <input
            id="address" name="address" type="text"
            autoComplete="street-address"
            disabled={pending}
            className="input-field"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="input-label" htmlFor="notes">Notes</label>
          <textarea
            id="notes" name="notes" rows={4}
            disabled={pending}
            className="input-field"
            style={{ height: 'auto', paddingTop: '14px', paddingBottom: '14px', resize: 'none' }}
          />
        </div>

        {/* Submit */}
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending
            ? <><Loader2 size={18} className="animate-spin mr-2" />Saving…</>
            : 'Save client'
          }
        </button>

      </form>
    </div>
  )
}
