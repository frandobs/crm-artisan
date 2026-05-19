import { createClient } from '@/lib/supabase/server'

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined'

export type LineItem = {
  id: string
  description: string
  quantity: number
  unit_price: number
  sort_order: number
}

export type Quote = {
  id: string
  job_site_id: string
  job_site_name: string
  client_name: string
  number: string
  title: string
  status: QuoteStatus
  issue_date: string
  expiry_date: string | null
  notes: string | null
  tax_rate: number
  created_at: string
  line_items: LineItem[]
}

const SELECT = `
  id, job_site_id, number, title, status, issue_date, expiry_date, notes, tax_rate, created_at,
  job_sites ( name, clients ( name ) ),
  quote_line_items ( id, description, quantity, unit_price, sort_order )
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Quote {
  const site = row.job_sites as { name: string; clients: { name: string } } | null
  return {
    id:            row.id,
    job_site_id:   row.job_site_id,
    job_site_name: site?.name ?? '',
    client_name:   site?.clients?.name ?? '',
    number:        row.number,
    title:         row.title,
    status:        row.status as QuoteStatus,
    issue_date:    row.issue_date,
    expiry_date:   row.expiry_date,
    notes:         row.notes,
    tax_rate:      Number(row.tax_rate),
    created_at:    row.created_at,
    line_items: ((row.quote_line_items ?? []) as LineItem[])
      .sort((a, b) => a.sort_order - b.sort_order),
  }
}

export async function getQuotes(): Promise<Quote[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quotes')
    .select(SELECT)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(mapRow)
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quotes')
    .select(SELECT)
    .eq('id', id)
    .single()

  if (error) return null
  return mapRow(data)
}
