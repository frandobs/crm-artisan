import { getQuotes } from '@/lib/quotes'
import QuoteList from '@/components/quotes/QuoteList'

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const [quotes, params] = await Promise.all([getQuotes(), searchParams])
  return <QuoteList quotes={quotes} success={params.success} />
}
