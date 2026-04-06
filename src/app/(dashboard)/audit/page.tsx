import { createClient } from "@/lib/supabase/server"
import { Terminal, Info } from "lucide-react"

export default async function AuditPage() {
  const supabase = await createClient()
  
  const { data: audits } = await supabase.from('audit').select(`
    id, action, details, created_at,
    clients (name)
  `).order('created_at', { ascending: false }).limit(20)

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit Trail</h1>
          <p className="text-slate-500 mt-2">Immutable records of internal events across the control plane layer.</p>
        </div>
        <div className="p-3 bg-slate-900 text-slate-300 rounded-lg shadow-sm">
          <Terminal className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-start gap-4 shadow-sm">
         <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
         <div className="text-sm text-indigo-900/80">
            <h4 className="font-semibold text-indigo-950 mb-1">¿Para qué sirve esta pestaña? (Audit Logs)</h4>
            <p>Es un registro "Caja Negra" e inmutable que no se puede borrar. Sirve para detectar vulnerabilidades o rastrear errores. Responde a preguntas vitales en B2B: <i>¿Quién cambió las contraseñas de esta empresa ayer a las 3 AM?</i> Esto es obligatorio si algún día presentáis la empresa a certificaciones ISO 27001 o SOC 2.</p>
         </div>
      </div>
      
      <div className="bg-[#0D1117] border border-slate-800 p-6 rounded-xl text-slate-300 font-mono text-sm shadow-2xl overflow-hidden mt-6">
         <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-500 ml-2 text-xs">secure_audit_stream.sh</span>
         </div>
         <div className="flex flex-col gap-3">
            {audits?.map((log: any) => (
               <div key={log.id} className="flex gap-4 hover:bg-slate-800/50 p-2 rounded items-start">
                  <span className="text-indigo-400 shrink-0">[{new Date(log.created_at).toISOString()}]</span>
                  <span className="text-emerald-400 font-semibold uppercase">{log.action}</span>
                  <span className="text-slate-400 hidden sm:inline-block">({log.clients?.name || 'SYSTEM'})</span>
                  <span className="text-slate-300 truncate">
                    {log.details ? JSON.stringify(log.details) : 'Executed successfully.'}
                  </span>
               </div>
            ))}
            {(!audits || audits.length === 0) && (
               <div className="text-slate-600 italic">
                  $ tail -f /var/log/audit.log<br/><br/>
                  No recent auditable events detected in the stream.
               </div>
            )}
         </div>
      </div>
    </div>
  )
}
