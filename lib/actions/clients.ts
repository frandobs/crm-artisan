'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type CreateClientState = {
  status: 'error'
  message?: string
  fieldErrors?: { name?: string; email?: string }
} | null

export async function createClientAction(
  _prev: CreateClientState,
  formData: FormData
): Promise<CreateClientState> {
  const name    = (formData.get('name')    as string ?? '').trim()
  const phone   = (formData.get('phone')   as string ?? '').trim() || null
  const email   = (formData.get('email')   as string ?? '').trim() || null
  const address = (formData.get('address') as string ?? '').trim() || null
  const notes   = (formData.get('notes')   as string ?? '').trim() || null

  const fieldErrors: { name?: string; email?: string } = {}
  if (!name) fieldErrors.name = 'Name is required'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = 'Enter a valid email address'

  if (Object.keys(fieldErrors).length > 0)
    return { status: 'error', fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .insert({ name, phone, email, address, notes })

  if (error)
    return { status: 'error', message: 'Could not save client. Please try again.' }

  revalidatePath('/clients')
  redirect('/clients?success=added')
}

export type UpdateClientState = {
  status: 'error'
  message?: string
  fieldErrors?: { name?: string; email?: string }
} | null

export async function updateClientAction(
  id: string,
  _prev: UpdateClientState,
  formData: FormData
): Promise<UpdateClientState> {
  const name    = (formData.get('name')    as string ?? '').trim()
  const phone   = (formData.get('phone')   as string ?? '').trim() || null
  const email   = (formData.get('email')   as string ?? '').trim() || null
  const address = (formData.get('address') as string ?? '').trim() || null
  const notes   = (formData.get('notes')   as string ?? '').trim() || null

  const fieldErrors: { name?: string; email?: string } = {}
  if (!name) fieldErrors.name = 'Name is required'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = 'Enter a valid email address'

  if (Object.keys(fieldErrors).length > 0)
    return { status: 'error', fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .update({ name, phone, email, address, notes })
    .eq('id', id)

  if (error)
    return { status: 'error', message: 'Could not update client. Please try again.' }

  revalidatePath('/clients')
  redirect('/clients?success=updated')
}

export async function deleteClientAction(id: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('clients').delete().eq('id', id)
  revalidatePath('/clients')
  redirect('/clients?success=deleted')
}
