import { createClient } from '@/lib/supabase/server'

export type Client = {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
  created_at: string
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, phone, email, address, notes, created_at')
    .order('name')

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, phone, email, address, notes, created_at')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}
