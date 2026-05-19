'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function QuoteDetailError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-20 text-center">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
        style={{ backgroundColor: '#FFEBEE' }}
      >
        <AlertCircle size={32} strokeWidth={1.5} style={{ color: 'var(--color-danger)' }} />
      </div>
      <p className="font-semibold text-base mb-1" style={{ color: 'var(--color-neutral-900)' }}>
        Could not load quote
      </p>
      <p className="text-[13px] text-neutral-500 mb-6">Check your connection and try again.</p>
      <button
        onClick={unstable_retry}
        className="btn btn-secondary"
        style={{ width: 'auto', paddingInline: '24px' }}
      >
        Try again
      </button>
    </div>
  )
}
