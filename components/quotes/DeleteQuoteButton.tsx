'use client'

import { useState, useActionState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteQuoteAction, type DeleteQuoteState } from '@/lib/actions/quotes'

export default function DeleteQuoteButton({ quoteId }: { quoteId: string }) {
  const [open, setOpen] = useState(false)
  const boundAction = deleteQuoteAction.bind(null, quoteId)
  const [state, formAction, pending] = useActionState<DeleteQuoteState, FormData>(boundAction, null)

  return (
    <>
      <button
        type="button"
        onClick={e => { e.preventDefault(); setOpen(true) }}
        className="flex items-center justify-center w-10 h-10 shrink-0 rounded-md"
        style={{ color: 'var(--color-neutral-500)' }}
        aria-label="Delete quote"
      >
        <Trash2 size={17} strokeWidth={1.75} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <div className="card w-full max-w-xs">
            <p className="font-semibold text-base mb-1" style={{ color: 'var(--color-neutral-900)' }}>
              Delete quote?
            </p>
            <p
              className="text-[13px] mb-6"
              style={{ color: state?.error ? 'var(--color-danger)' : 'var(--color-neutral-500)' }}
            >
              {state?.error ?? 'Are you sure? This cannot be undone.'}
            </p>
            <div className="flex flex-col gap-3">
              {!state?.error && (
                <form action={formAction}>
                  <button type="submit" disabled={pending} className="btn btn-destructive">
                    {pending ? 'Deleting…' : 'Delete'}
                  </button>
                </form>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-secondary"
              >
                {state?.error ? 'OK' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
