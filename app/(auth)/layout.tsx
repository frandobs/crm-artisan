export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-5"
         style={{ backgroundColor: 'var(--color-neutral-100)' }}>
      {children}
    </div>
  )
}
