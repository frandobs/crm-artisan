'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { signUpAction, type AuthState } from '@/lib/actions/auth'

export default function SignupPage() {
  const [error, formAction, pending] = useActionState<AuthState, FormData>(signUpAction, null)

  return (
    <div className="w-full max-w-sm">

      {/* Brand */}
      <div className="text-center mb-8">
        <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
          CRM Artisan
        </p>
        <p className="text-[13px] mt-1" style={{ color: 'var(--color-neutral-500)' }}>
          Create your account
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
              autoComplete="new-password"
              disabled={pending}
              className="input-field"
            />
          </div>

          <button type="submit" disabled={pending} className="btn btn-primary mt-1">
            {pending
              ? <><Loader2 size={18} className="animate-spin mr-2" />Creating account…</>
              : 'Create account'
            }
          </button>
        </form>

      </div>

      <p className="text-center text-[13px] mt-5" style={{ color: 'var(--color-neutral-500)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
          Log in
        </Link>
      </p>

    </div>
  )
}
