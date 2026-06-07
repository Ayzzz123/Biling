import { supabase, getServiceSupabase } from "./supabase"
import { UsageQuota } from "@/types"

const ANONYMOUS_DAILY_LIMIT = 2
const LOGGED_IN_DAILY_LIMIT = 5
const EARLY_BIRD_DAILY_LIMIT = 15

export function getLimit(isLoggedIn: boolean): number {
  if (!isLoggedIn) return ANONYMOUS_DAILY_LIMIT
  return LOGGED_IN_DAILY_LIMIT
}

async function checkEarlyBird(userId: string): Promise<boolean> {
  try {
    const client = getServiceSupabase()
    const { data } = await client.rpc("is_early_bird", { user_id: userId })
    return data === true
  } catch {
    return false
  }
}

async function getEffectiveLimit(userId?: string): Promise<number> {
  if (!userId) return ANONYMOUS_DAILY_LIMIT

  const isEarlyBird = await checkEarlyBird(userId)
  if (isEarlyBird) return EARLY_BIRD_DAILY_LIMIT

  return LOGGED_IN_DAILY_LIMIT
}

export async function getUsageQuota(
  userId?: string,
  fingerprint?: string
): Promise<UsageQuota> {
  const today = new Date().toISOString().split("T")[0]
  const isLoggedIn = !!userId

  if (isLoggedIn && userId) {
    const client = getServiceSupabase()
    const { data } = await client
      .from("usage_logs")
      .select("count")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle()

    const used = data?.count ?? 0
    const limit = await getEffectiveLimit(userId)

    return { used, limit, remaining: Math.max(0, limit - used) }
  }

  if (fingerprint) {
    const { data } = await supabase
      .from("usage_logs")
      .select("count")
      .eq("fingerprint", fingerprint)
      .eq("date", today)
      .maybeSingle()

    const used = data?.count ?? 0
    const limit = getLimit(false)

    return { used, limit, remaining: Math.max(0, limit - used) }
  }

  return { used: 0, limit: ANONYMOUS_DAILY_LIMIT, remaining: ANONYMOUS_DAILY_LIMIT }
}

export async function incrementUsage(
  userId?: string,
  fingerprint?: string
): Promise<void> {
  const today = new Date().toISOString().split("T")[0]
  const client = getServiceSupabase()

  if (userId) {
    await client.rpc("upsert_usage_log", {
      p_user_id: userId,
      p_fingerprint: null,
      p_date: today,
    })
  } else if (fingerprint) {
    await client.rpc("upsert_usage_log", {
      p_user_id: null,
      p_fingerprint: fingerprint,
      p_date: today,
    })
  }
}
