import TabBar from '@/components/TabBar'

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-20">
        {children}
      </main>
      <TabBar />
    </div>
  )
}
