import { createClient } from "@/lib/supabase/server"
import { ShieldCheck, Network, Info } from "lucide-react"

export default async function AccessPage() {
  const supabase = await createClient()
  
  // Obtenemos los accesos (RLS se encargará de que solo veas lo que te permite la DB)
  const { data: accesses } = await supabase.from('access').select(`
    id, role, created_at,
    clients (name)
  `).order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Access Control</h1>
          <p className="text-slate-500 mt-2">Role mapping managed strictly via Server Actions & RLS enforcement.</p>
        </div>
        <div className="p-3 bg-slate-100 text-slate-600 rounded-lg shadow-sm border">
          <Network className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-8 flex items-start gap-4 shadow-sm">
         <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
         <div className="text-sm text-indigo-900/80">
            <h4 className="font-semibold text-indigo-950 mb-1">¿Para qué sirve esta pestaña? (Access Controls)</h4>
            <p>Esto es el "Cerebro" de los permisos. Define "Quién" (Email/User) puede acceder a "Qué" (Cliente). Si creas un nuevo usuario en la plataforma, por defecto no verá absolutamente nada. Aquí emparejas al usuario con el Cliente específico, otorgándole un nivel de poder (Ej. Admin, Viewer).</p>
         </div>
      </div>
      
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Client Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Role</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Established</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accesses?.map((acc: any) => (
              <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 border-l-[3px] border-l-transparent hover:border-l-indigo-500">{acc.clients?.name || 'Unknown Client'}</td>
                <td className="px-6 py-4">
                   <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200 font-mono text-xs font-semibold uppercase tracking-wider">
                     <ShieldCheck className="w-3 h-3" />
                     {acc.role}
                   </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(acc.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!accesses || accesses.length === 0) && (
              <tr>
                 <td colSpan={3} className="px-6 py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 m-4 rounded-xl">
                    No access mappings found. Connect via SQL or Admin Endpoint.
                 </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
