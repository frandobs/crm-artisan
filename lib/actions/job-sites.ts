'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type JobSiteState = {
  status: 'error'
  message?: string
  fieldErrors?: { name?: string; client_id?: string }
} | null

export type DeleteJobSiteState = { error: string } | null

export async function createJobSiteAction(
  _prev: JobSiteState,
  formData: FormData
): Promise<JobSiteState> {
  const client_id  = (formData.get('client_id')  as string ?? '').trim()
  const name       = (formData.get('name')        as string ?? '').trim()
  const status     = (formData.get('status')      as string ?? 'planned').trim()
  const start_date = (formData.get('start_date')  as string ?? '').trim() || null
  const address    = (formData.get('address')     as string ?? '').trim() || null
  const notes      = (formData.get('notes')       as string ?? '').trim() || null

  const fieldErrors: { name?: string; client_id?: string } = {}
  if (!client_id) fieldErrors.client_id = 'Please select a client'
  if (!name)      fieldErrors.name      = 'Title is required'

  if (Object.keys(fieldErrors).length > 0)
    return { status: 'error', fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase
    .from('job_sites')
    .insert({ client_id, name, status, start_date, address, notes })

  if (error)
    return { status: 'error', message: 'Could not save job site. Please try again.' }

  revalidatePath('/jobs')
  redirect('/jobs?success=added')
}

export async function updateJobSiteAction(
  id: string,
  _prev: JobSiteState,
  formData: FormData
): Promise<JobSiteState> {
  const client_id  = (formData.get('client_id')  as string ?? '').trim()
  const name       = (formData.get('name')        as string ?? '').trim()
  const status     = (formData.get('status')      as string ?? 'planned').trim()
  const start_date = (formData.get('start_date')  as string ?? '').trim() || null
  const address    = (formData.get('address')     as string ?? '').trim() || null
  const notes      = (formData.get('notes')       as string ?? '').trim() || null

  const fieldErrors: { name?: string; client_id?: string } = {}
  if (!client_id) fieldErrors.client_id = 'Please select a client'
  if (!name)      fieldErrors.name      = 'Title is required'

  if (Object.keys(fieldErrors).length > 0)
    return { status: 'error', fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase
    .from('job_sites')
    .update({ client_id, name, status, start_date, address, notes })
    .eq('id', id)

  if (error)
    return { status: 'error', message: 'Could not update job site. Please try again.' }

  revalidatePath('/jobs')
  redirect('/jobs?success=updated')
}

export async function deleteJobSiteAction(
  id: string,
  _prev: DeleteJobSiteState,
  _formData: FormData
): Promise<DeleteJobSiteState> {
  const supabase = await createClient()

  const { count } = await supabase
    .from('quotes')
    .select('id', { count: 'exact', head: true })
    .eq('job_site_id', id)

  if (count && count > 0)
    return { error: 'This job site has quotes. Remove all its quotes first.' }

  const { error } = await supabase.from('job_sites').delete().eq('id', id)

  if (error)
    return { error: 'Could not delete job site. Please try again.' }

  revalidatePath('/jobs')
  redirect('/jobs?success=deleted')
}
