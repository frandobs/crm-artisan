'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { signInAction, type AuthState } from '@/lib/actions/auth'

export default function LoginPage() {
  const [error, formAction, pending] = useActionState<AuthState, FormData>(signInAction, null)

  return (
    <div className="w-full max-w-sm">

      {/* Brand */}
      <div className="text-center mb-8">
        <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
          CRM Artisan
        </p>
        <p className="text-[13px] mt-1" style={{ color: 'var(--color-neutral-500)' }}>
          Sign in to your account
        </p>
      </div>

      <div className="card flex flex-col gap-4">

        {error && (
          <div className="rounded-md px-4 py-3" style={{ backgroundColor: '#FFEBEE' }}>
            <p className="text-[13px] font-medium" style={{ color: 'var(--color-danger)' }}>
              {error}
            </p>
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              autoComplete="email"
              autoFocus
              disabled={pending}
              className="input-field"
            />
          </div>

          <div>
            <label className="input-label" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              autoComplete="current-password"
              disabled={pending}
              className="input-field"
            />
          </div>

          <button type="submit" disabled={pending} className="btn btn-primary mt-1">
            {pending
              ? <><Loader2 size={18} className="animate-spin mr-2" />Signing in…</>
              : 'Log in'
            }
          </button>
        </form>

      </div>

      <div className="flex flex-col items-center gap-2 mt-5">
        <p className="text-[13px]" style={{ color: 'var(--color-neutral-500)' }}>
          No account?{' '}
          <Link href="/signup" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            Create one
          </Link>
        </p>
        <Link
          href="/forgot-password"
          className="text-[13px]"
          style={{ color: 'var(--color-neutral-500)' }}
        >
          Forgot password?
        </Link>
      </div>

    </div>
  )
}
