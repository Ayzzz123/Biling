import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端使用 service_role key（绕过 RLS）
export const getServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
  return createClient(supabaseUrl, serviceRoleKey)
}
