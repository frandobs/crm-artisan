import Link from 'next/link'
import { User, MapPin, Calendar } from 'lucide-react'
import type { JobSite, JobSiteStatus } from '@/lib/job-sites'
import DeleteJobSiteButton from './DeleteJobSiteButton'

const chipClass: Record<JobSiteStatus, string> = {
  planned:   'chip chip-scheduled',
  active:    'chip chip-progress',
  completed: 'chip chip-completed',
  cancelled: 'chip chip-rejected',
}

const statusLabel: Record<JobSiteStatus, string> = {
  planned:   'Planned',
  active:    'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function JobSiteCard({ site }: { site: JobSite }) {
  return (
    <div className="card card-pressable flex items-start gap-2">
      <Link href={`/jobs/${site.id}/edit`} className="flex-1 min-w-0 block">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="font-semibold text-base truncate" style={{ color: 'var(--color-neutral-900)' }}>
            {site.name}
          </p>
          <span className={chipClass[site.status]} style={{ flexShrink: 0 }}>
            {statusLabel[site.status]}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <User size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
            <span className="text-[13px] text-neutral-500 truncate">{site.client_name}</span>
          </div>
          {site.address && (
            <div className="flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
              <span className="text-[13px] text-neutral-500 truncate">{site.address}</span>
            </div>
          )}
          {site.start_date && (
            <div className="flex items-center gap-2">
              <Calendar size={14} strokeWidth={1.75} className="shrink-0 text-neutral-500" />
              <span className="text-[13px] text-neutral-500">{formatDate(site.start_date)}</span>
            </div>
          )}
        </div>
      </Link>
      <DeleteJobSiteButton siteId={site.id} />
    </div>
  )
}
