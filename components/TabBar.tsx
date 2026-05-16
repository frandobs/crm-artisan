'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Wrench, FileText, MoreHorizontal } from 'lucide-react'

const tabs = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/clients',   label: 'Clients',   Icon: Users },
  { href: '/jobs',      label: 'Jobs',       Icon: Wrench },
  { href: '/quotes',    label: 'Quotes',     Icon: FileText },
  { href: '/more',      label: 'More',       Icon: MoreHorizontal },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className="tab-bar">
      {tabs.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className={`tab-item${pathname === href ? ' active' : ''}`}>
          <Icon size={24} strokeWidth={1.75} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
