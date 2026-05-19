import { createClient } from '@/lib/supabase/server'

export type JobSiteStatus = 'planned' | 'active' | 'completed' | 'cancelled'

export type JobSite = {
  id: string
  user_id: string
  client_id: string
  client_name: string
  name: string
  address: string | null
  notes: string | null
  status: JobSiteStatus
  start_date: string | null
  created_at: string
}

export async function getJobSites(): Promise<JobSite[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('job_sites')
    .select('id, user_id, client_id, name, address, notes, status, start_date, created_at, clients(name)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map(row => ({
    id: row.id,
    user_id: row.user_id,
    client_id: row.client_id,
    name: row.name,
    address: row.address,
    notes: row.notes,
    status: row.status as JobSiteStatus,
    start_date: row.start_date,
    created_at: row.created_at,
    client_name: (row.clients as unknown as { name: string } | null)?.name ?? '',
  }))
}

export async function getJobSiteById(id: string): Promise<JobSite | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('job_sites')
    .select('id, user_id, client_id, name, address, notes, status, start_date, created_at, clients(name)')
    .eq('id', id)
    .single()

  if (error) return null

  return {
    id: data.id,
    user_id: data.user_id,
    client_id: data.client_id,
    name: data.name,
    address: data.address,
    notes: data.notes,
    status: data.status as JobSiteStatus,
    start_date: data.start_date,
    created_at: data.created_at,
    client_name: (data.clients as unknown as { name: string } | null)?.name ?? '',
  }
}
