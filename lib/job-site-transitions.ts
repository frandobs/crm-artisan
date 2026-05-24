import type { JobSiteStatus } from './job-sites'

const ALLOWED: Partial<Record<JobSiteStatus, JobSiteStatus[]>> = {
  planned:   ['active', 'cancelled'],
  active:    ['completed', 'cancelled'],
}

export function canTransition(from: JobSiteStatus, to: JobSiteStatus): boolean {
  return ALLOWED[from]?.includes(to) ?? false
}
