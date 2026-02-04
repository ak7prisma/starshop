import { createClient } from "../utils/server"

export async function getUserRole(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('idProfil', userId)
    .single()
  return data?.role
}