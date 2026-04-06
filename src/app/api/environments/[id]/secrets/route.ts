import { NextResponse } from 'next/server';
import { getEnvironmentSecrets } from '@/lib/clientRegistry/secretsResolver';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Resolviendo de forma segura a través del servidor
    const secrets = await getEnvironmentSecrets(resolvedParams.id, user.id);

    if (!secrets) {
      return NextResponse.json({ error: 'No secrets found or no access' }, { status: 404 });
    }

    // NUNCA DEVOLVEMOS SECRETOS EN TEXTO PLANO AL CLIENTE (solo metadatos o estado de conexión)
    // El frontend solo recibe validación o métricas.
    return NextResponse.json({
      status: 'success',
      resolved: true,
      message: 'Secrets successfully resolved in backend context',
      // only returning keys metadata not the values
      available_keys: Object.keys(secrets) 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
