import { ControlPlaneSidebar } from "@/components/layout/ControlPlaneSidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <ControlPlaneSidebar />
      <main className="flex-1 overflow-y-auto">
         {/* Subtle top header for logged user */}
         <div className="h-16 flex items-center justify-end px-8 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10 w-full">
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              {user.email}
            </span>
         </div>
         <div className="max-w-6xl mx-auto w-full">
            {children}
         </div>
      </main>
    </div>
  )
}
