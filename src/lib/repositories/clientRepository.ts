import { createClient } from "@/lib/supabase/server"

export async function getAccessibleClients() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
  
  if (error) throw new Error(`Error fetching clients: ${error.message}`)
  return data
}

export async function getClientEnvironments(clientId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('client_environments')
    .select('*')
    .eq('client_id', clientId)
  
  if (error) throw new Error(`Error fetching environments: ${error.message}`)
  return data
}

export async function getClientById(clientId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('clients')
    .select('*')
    .eq('id', clientId)
    .single()
  
  if (error) throw new Error(`Error fetching client: ${error.message}`)
  return data
}
