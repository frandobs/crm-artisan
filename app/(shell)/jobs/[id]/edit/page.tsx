import { notFound } from 'next/navigation'
import { getJobSiteById } from '@/lib/job-sites'
import { getClients } from '@/lib/clients'
import EditJobSiteForm from '@/components/jobs/EditJobSiteForm'

export default async function EditJobSitePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [site, clients] = await Promise.all([getJobSiteById(id), getClients()])
  if (!site) notFound()
  return <EditJobSiteForm site={site} clients={clients} />
}
