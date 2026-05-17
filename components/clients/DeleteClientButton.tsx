'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteClientAction } from '@/lib/actions/clients'

export default function DeleteClientButton({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false)
  const action = deleteClientAction.bind(null, clientId)

  return (
    <>
      <button
        type="button"
        onClick={e => { e.preventDefault(); setOpen(true) }}
        className="flex items-center justify-center w-10 h-10 shrink-0 rounded-md"
        style={{ color: 'var(--color-neutral-500)' }}
        aria-label="Delete client"
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
              Delete client?
            </p>
            <p className="text-[13px] mb-6" style={{ color: 'var(--color-neutral-500)' }}>
              Are you sure? This cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <form action={action}>
                <button type="submit" className="btn btn-destructive">Delete</button>
              </form>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
