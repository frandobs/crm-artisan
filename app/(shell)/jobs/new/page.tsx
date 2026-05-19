import { getClients } from '@/lib/clients'
import NewJobSiteForm from '@/components/jobs/NewJobSiteForm'

export default async function NewJobSitePage() {
  const clients = await getClients()
  return <NewJobSiteForm clients={clients} />
}
