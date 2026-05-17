import { getClients } from '@/lib/clients'
import ClientList from '@/components/clients/ClientList'

export default async function ClientsPage() {
  const clients = await getClients()
  return <ClientList clients={clients} />
}
