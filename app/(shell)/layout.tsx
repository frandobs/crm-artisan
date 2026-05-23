import TabBar from '@/components/TabBar'
import { createClient } from '@/lib/supabase/server'

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-20">
        {children}
      </main>
      <TabBar email={user?.email ?? ''} />
    </div>
  )
}
