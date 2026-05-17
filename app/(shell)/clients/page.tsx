import { getClients } from '@/lib/clients'
import ClientList from '@/components/clients/ClientList'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const [clients, params] = await Promise.all([getClients(), searchParams])
  return <ClientList clients={clients} success={params.success} />
}
