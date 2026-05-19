import { notFound } from 'next/navigation'
import { getQuoteById } from '@/lib/quotes'
import { getJobSites } from '@/lib/job-sites'
import QuoteEditor from '@/components/quotes/QuoteEditor'
import QuoteDetail from '@/components/quotes/QuoteDetail'

export default async function QuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const quote = await getQuoteById(id)
  if (!quote) notFound()

  if (quote.status === 'draft') {
    const jobSites = await getJobSites()
    return <QuoteEditor quote={quote} jobSites={jobSites} />
  }

  return <QuoteDetail quote={quote} success={sp.success} />
}
