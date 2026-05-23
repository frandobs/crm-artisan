'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type QuoteState = {
  status: 'error'
  message?: string
  fieldErrors?: { title?: string; job_site_id?: string }
} | null

export type DeleteQuoteState = { error: string } | null

export async function saveQuoteAction(
  id: string | null,
  _prev: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  const intent      = (formData.get('intent')      as string ?? 'draft')
  const job_site_id = (formData.get('job_site_id') as string ?? '').trim()
  const title       = (formData.get('title')       as string ?? '').trim()
  const issue_date  = (formData.get('issue_date')  as string ?? '').trim()
      || new Date().toISOString().split('T')[0]
  const expiry_date = (formData.get('expiry_date') as string ?? '').trim() || null
  const tax_rate    = Math.max(0, parseFloat(formData.get('tax_rate') as string ?? '0') || 0)
  const notes       = (formData.get('notes')       as string ?? '').trim() || null

  // Parse line items (indexed form fields)
  const items: { description: string; quantity: number; unit_price: number; sort_order: number }[] = []
  let i = 0
  while (formData.get(`items[${i}][description]`) !== null) {
    const description = (formData.get(`items[${i}][description]`) as string ?? '').trim()
    const quantity    = parseFloat(formData.get(`items[${i}][quantity]`)   as string ?? '0')
    const unit_price  = parseFloat(formData.get(`items[${i}][unit_price]`) as string ?? '0')
    items.push({ description, quantity, unit_price, sort_order: i })
    i++
  }

  // Required field validation
  const fieldErrors: { title?: string; job_site_id?: string } = {}
  if (!title)       fieldErrors.title       = 'Title is required'
  if (!job_site_id) fieldErrors.job_site_id = 'Please select a job site'
  if (Object.keys(fieldErrors).length > 0) return { status: 'error', fieldErrors }

  // Line item validation
  for (const [idx, item] of items.entries()) {
    if (!item.description)
      return { status: 'error', message: `Item ${idx + 1}: description is required` }
    if (isNaN(item.quantity) || item.quantity <= 0)
      return { status: 'error', message: `Item ${idx + 1}: quantity must be greater than 0` }
    if (isNaN(item.unit_price) || item.unit_price < 0)
      return { status: 'error', message: `Item ${idx + 1}: unit price must be 0 or more` }
  }

  const status = intent === 'send' ? 'sent' : 'draft'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  let quoteId = id

  if (id) {
    const { error } = await supabase
      .from('quotes')
      .update({ job_site_id, title, issue_date, expiry_date, tax_rate, notes, status })
      .eq('id', id)
    if (error) return { status: 'error', message: 'Could not save quote. Please try again.' }

    await supabase.from('quote_line_items').delete().eq('quote_id', id)
    if (items.length > 0) {
      const { error: e } = await supabase
        .from('quote_line_items')
        .insert(items.map(item => ({ ...item, quote_id: id })))
      if (e) return { status: 'error', message: 'Could not save line items. Please try again.' }
    }
  } else {
    const { data, error } = await supabase
      .from('quotes')
      .insert({ job_site_id, title, issue_date, expiry_date, tax_rate, notes, status })
      .select('id')
      .single()
    if (error || !data) return { status: 'error', message: 'Could not create quote. Please try again.' }

    quoteId = data.id
    if (items.length > 0) {
      const { error: e } = await supabase
        .from('quote_line_items')
        .insert(items.map(item => ({ ...item, quote_id: quoteId })))
      if (e) return { status: 'error', message: 'Could not save line items. Please try again.' }
    }
  }

  revalidatePath('/quotes')
  revalidatePath(`/quotes/${quoteId}`)

  if (intent === 'send') {
    redirect(`/quotes/${quoteId}?success=sent`)
  } else {
    redirect(`/quotes/${quoteId}`)
  }
}

export async function revertToDraftAction(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await supabase.from('quotes').update({ status: 'draft' }).eq('id', id)
  revalidatePath(`/quotes/${id}`)
  redirect(`/quotes/${id}`)
}

export async function acceptQuoteAction(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await supabase.from('quotes').update({ status: 'accepted' }).eq('id', id)
  revalidatePath('/quotes')
  revalidatePath(`/quotes/${id}`)
  redirect(`/quotes/${id}?success=accepted`)
}

export async function declineQuoteAction(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await supabase.from('quotes').update({ status: 'declined' }).eq('id', id)
  revalidatePath('/quotes')
  revalidatePath(`/quotes/${id}`)
  redirect(`/quotes/${id}?success=declined`)
}

export async function deleteQuoteAction(
  id: string,
  _prev: DeleteQuoteState,
  _formData: FormData,
): Promise<DeleteQuoteState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { error } = await supabase.from('quotes').delete().eq('id', id)
  if (error) return { error: 'Could not delete quote. Please try again.' }
  revalidatePath('/quotes')
  redirect('/quotes?success=deleted')
}
