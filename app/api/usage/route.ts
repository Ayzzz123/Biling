import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getUsageQuota } from "@/lib/usage"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")?.replace("Bearer ", "") ?? ""
    let userId: string | undefined

    if (authHeader) {
      const { data } = await supabase.auth.getUser(authHeader)
      userId = data?.user?.id
    }

    const fingerprint =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "anonymous"

    const quota = await getUsageQuota(userId, fingerprint)

    return NextResponse.json({ quota })
  } catch (error) {
    console.error("Usage API error:", error)
    return NextResponse.json(
      { error: "查询失败" },
      { status: 500 }
    )
  }
}
