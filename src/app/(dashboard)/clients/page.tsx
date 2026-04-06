import { getAccessibleClients } from "@/lib/repositories/clientRepository";
import Link from "next/link";
import { FolderGit2, Info } from "lucide-react";

export default async function ClientsPage() {
  const clients = await getAccessibleClients();

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Registered Clients</h1>
          <p className="text-gray-500 mt-2">Manage control plane multi-tenant instances (RLS actively filtering views).</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shadow-sm border border-blue-100">
          <FolderGit2 className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-8 flex items-start gap-4 shadow-sm">
         <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
         <div className="text-sm text-indigo-900/80">
            <h4 className="font-semibold text-indigo-950 mb-1">¿Para qué sirve esta pestaña? (Clients Map)</h4>
            <p>Aquí gestionas las diferentes "Empresas/Agencias" (Inquilinos o Tenants) de tu plataforma. Desde aquí se centralizan las credenciales (API Keys de N8N, bases de datos locales, etc) de manera aislada para que una empresa jamás acceda a los datos de la otra, resolviéndose su configuración en el lado oscuro del servidor (KMS).</p>
         </div>
      </div>
      
      <div className="grid gap-4">
        {clients?.map((client: any) => (
          <Link href={`/clients/${client.id}`} key={client.id}>
            <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center group">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{client.name}</h3>
                <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">{client.id}</p>
              </div>
              <span className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Manage &rarr;</span>
            </div>
          </Link>
        ))}
        {(!clients || clients.length === 0) && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-500">
            No clients found. RLS might be hiding them if you don't have access.
          </div>
        )}
      </div>
    </div>
  );
}
