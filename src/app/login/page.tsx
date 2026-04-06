import { login } from './action'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Control Plane Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Service Account Email</label>
            <input type="email" name="email" required placeholder="admin@acmecorp.com" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input type="password" name="password" required placeholder="••••••••" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors mt-2">
            Authenticate
          </button>
        </form>
        
        <div className="mt-6 pt-4 border-t text-xs text-center text-gray-500 flex flex-col gap-1">
          <span>Protected by strict RLS and Server-Side execution.</span>
          <span>Never exposes secrets directly down to the browser.</span>
        </div>
      </div>
    </div>
  )
}
