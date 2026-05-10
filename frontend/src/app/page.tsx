import { AuditForm } from '@/components/audit/AuditForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">AI Tool Audit</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Analyze your AI tool usage and discover cost-saving opportunities.
          </p>
        </div>
        <AuditForm />
      </div>
    </main>
  )
}
