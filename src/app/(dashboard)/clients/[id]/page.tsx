import { getClientById, getClientEnvironments } from "@/lib/repositories/clientRepository";
import { ShieldAlert, Server, KeyRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let client, environments;
  try {
    client = await getClientById(resolvedParams.id);
    environments = await getClientEnvironments(resolvedParams.id);
  } catch (e) {
    notFound();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <Link href="/clients" className="text-sm font-medium text-blue-600 hover:underline mb-6 inline-block">&larr; Back to Clients</Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{client.name}</h1>
        <p className="text-gray-500 uppercase tracking-wider text-sm mt-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-orange-500" />
          Strict RLS Boundary 
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Environments</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {environments?.map((env: any) => (
          <div key={env.id} className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium capitalize">{env.environment}</h3>
              </div>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-mono">
                {env.id.split('-')[0]}
              </span>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border text-sm font-mono text-gray-600 mb-4 whitespace-pre-wrap overflow-hidden">
              {JSON.stringify(env.config, null, 2)}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 bg-orange-50/50 p-2 rounded border border-orange-100">
              <KeyRound className="w-4 h-4 text-orange-400" />
              <span className="truncate flex-1">SecRef: {env.service_role_secret_ref}</span>
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-end">
              <button disabled className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed cursor-help" title="Secrets can only be resolved server-side. Not exposed to browser.">
                Resolve Secrets (Server Only)
              </button>
            </div>
          </div>
        ))}
        {(!environments || environments.length === 0) && (
          <div className="col-span-2 text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
            No environments configured for this tenant.
          </div>
        )}
      </div>
    </div>
  );
}
