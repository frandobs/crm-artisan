import { getJobSites } from '@/lib/job-sites'
import QuoteEditor from '@/components/quotes/QuoteEditor'

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ jobSiteId?: string }>
}) {
  const [jobSites, params] = await Promise.all([getJobSites(), searchParams])
  return <QuoteEditor quote={null} jobSites={jobSites} defaultJobSiteId={params.jobSiteId} />
}
