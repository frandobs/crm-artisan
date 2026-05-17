import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import type { Client } from '@/lib/clients'
import DeleteClientButton from './DeleteClientButton'

export default function ClientCard({ client }: { client: Client }) {
  return (
    <div className="card card-pressable flex items-center gap-2">
      <Link href={`/clients/${client.id}/edit`} className="flex-1 min-w-0 block">
        <p className="font-semibold text-base" style={{ color: 'var(--color-neutral-900)' }}>
          {client.name}
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {client.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
              <span className="text-[13px] text-neutral-500">{client.phone}</span>
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
              <span className="text-[13px] text-neutral-500">{client.email}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
              <span className="text-[13px] text-neutral-500">{client.address}</span>
            </div>
          )}
        </div>
      </Link>
      <DeleteClientButton clientId={client.id} />
    </div>
  )
}
