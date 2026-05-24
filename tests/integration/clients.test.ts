import { describe, it, expect, beforeAll } from 'vitest'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { USERS } from '../test-config'

// ── helpers ──────────────────────────────────────────────────────────────────

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

async function signedInClient(email: string, password: string): Promise<SupabaseClient> {
  const client = anonClient()
  const { error } = await client.auth.signInWithPassword({ email, password })
  if (error) throw new Error(`Auth failed for ${email}: ${error.message}`)
  return client
}

async function getUserId(client: SupabaseClient): Promise<string> {
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

// ── suite ─────────────────────────────────────────────────────────────────────

describe('Client CRUD — integration against Supabase', () => {
  let db1: SupabaseClient   // primary test user
  let db2: SupabaseClient   // secondary test user
  let uid1: string

  beforeAll(async () => {
    db1  = await signedInClient(USERS.primary.email,   USERS.primary.password)
    db2  = await signedInClient(USERS.secondary.email, USERS.secondary.password)
    uid1 = await getUserId(db1)
  })

  // ── create ─────────────────────────────────────────────────────────────────

  it('saves a client with valid data and returns an id', async () => {
    const name = `Integration Client ${Date.now()}`

    const { data, error } = await db1
      .from('clients')
      .insert({ user_id: uid1, name })
      .select('id, name')
      .single()

    try {
      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data!.id).toBeTruthy()
      expect(data!.name).toBe(name)
    } finally {
      if (data?.id) await db1.from('clients').delete().eq('id', data.id)
    }
  })

  it('rejects a null name with a NOT NULL database error', async () => {
    const { data, error } = await db1
      .from('clients')
      .insert({ user_id: uid1, name: null })
      .select('id')
      .single()

    expect(error).not.toBeNull()
    expect(error!.code).toBe('23502')   // PostgreSQL not_null_violation
    expect(data).toBeNull()
    // no cleanup needed — insert failed, nothing was written
  })

  it('accepts an empty-string name at the DB level (the guard lives in the action)', async () => {
    const { data, error } = await db1
      .from('clients')
      .insert({ user_id: uid1, name: '' })
      .select('id')
      .single()

    try {
      expect(error).toBeNull()
      expect(data!.id).toBeTruthy()
    } finally {
      if (data?.id) await db1.from('clients').delete().eq('id', data.id)
    }
  })

  // ── edit ───────────────────────────────────────────────────────────────────

  it('updates the target row and leaves other rows untouched', async () => {
    const ts = Date.now()
    const { data: target }    = await db1.from('clients').insert({ user_id: uid1, name: `Target ${ts}`    }).select('id').single()
    const { data: bystander } = await db1.from('clients').insert({ user_id: uid1, name: `Bystander ${ts}` }).select('id').single()

    try {
      const { error: updateError } = await db1
        .from('clients')
        .update({ name: `Target ${ts} Updated` })
        .eq('id', target!.id)

      expect(updateError).toBeNull()

      const { data: updatedTarget } = await db1
        .from('clients').select('name').eq('id', target!.id).single()
      expect(updatedTarget!.name).toBe(`Target ${ts} Updated`)

      const { data: unchanged } = await db1
        .from('clients').select('name').eq('id', bystander!.id).single()
      expect(unchanged!.name).toBe(`Bystander ${ts}`)
    } finally {
      await db1.from('clients').delete().in('id', [target!.id, bystander!.id])
    }
  })

  // ── delete ─────────────────────────────────────────────────────────────────

  it('removes the client so it can no longer be fetched', async () => {
    const { data: created } = await db1
      .from('clients')
      .insert({ user_id: uid1, name: `Delete me ${Date.now()}` })
      .select('id').single()

    try {
      const { error: deleteError } = await db1
        .from('clients').delete().eq('id', created!.id)

      expect(deleteError).toBeNull()

      const { data: gone } = await db1
        .from('clients').select('id').eq('id', created!.id).maybeSingle()

      expect(gone).toBeNull()
    } finally {
      // no-op if delete already succeeded; safety net if assertion failed early
      await db1.from('clients').delete().eq('id', created!.id)
    }
  })

  // ── RLS isolation ──────────────────────────────────────────────────────────

  it("user B's client list does not include user A's clients", async () => {
    const name = `User1 Private ${Date.now()}`

    const { data: created } = await db1
      .from('clients')
      .insert({ user_id: uid1, name })
      .select('id').single()

    try {
      // User B queries the full client list filtered to the specific id
      const { data: results } = await db2
        .from('clients')
        .select('id')
        .eq('id', created!.id)

      expect(results).toHaveLength(0)
    } finally {
      await db1.from('clients').delete().eq('id', created!.id)
    }
  })
})
