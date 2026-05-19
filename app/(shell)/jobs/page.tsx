import { getJobSites } from '@/lib/job-sites'
import JobSiteList from '@/components/jobs/JobSiteList'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const [jobSites, params] = await Promise.all([getJobSites(), searchParams])
  return <JobSiteList jobSites={jobSites} success={params.success} />
}
