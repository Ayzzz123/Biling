import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { generateContent } from "@/lib/gemini"
import { getUsageQuota, incrementUsage } from "@/lib/usage"
import { GenerateRequest, CONTENT_TYPE_LABELS, STYLE_LABELS } from "@/types"

const VALID_CONTENT_TYPES = Object.keys(CONTENT_TYPE_LABELS)
const VALID_STYLES = Object.keys(STYLE_LABELS)

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<GenerateRequest>

    // --- 输入验证 ---
    if (!body.topic || typeof body.topic !== "string") {
      return NextResponse.json({ error: "请输入创作主题" }, { status: 400 })
    }

    const topic = body.topic.trim().slice(0, 200)
    if (topic.length < 2) {
      return NextResponse.json({ error: "主题太短，至少 2 个字" }, { status: 400 })
    }

    // 清洗输入：移除可能的 prompt 注入标记
    const cleanedTopic = topic
      .replace(/```/g, "")
      .replace(/<\|/g, "")
      .replace(/\|>/g, "")
      .replace(/\[SYSTEM\]/gi, "")
      .replace(/\[USER\]/gi, "")
      .replace(/\[ASSISTANT\]/gi, "")

    if (!VALID_CONTENT_TYPES.includes(body.contentType ?? "")) {
      return NextResponse.json({ error: "请选择有效的内容类型" }, { status: 400 })
    }

    if (!VALID_STYLES.includes(body.style ?? "")) {
      return NextResponse.json({ error: "请选择有效的风格" }, { status: 400 })
    }

    const contentType = body.contentType!
    const style = body.style!

    // --- 额度检查 ---
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

    if (quota.remaining <= 0) {
      return NextResponse.json(
        {
          error: `今日免费额度已用完（${quota.limit} 次/天）。注册登录可提升至 3 次/天。`,
          quota,
        },
        { status: 429 }
      )
    }

    // --- 调用 AI ---
    const generateRequest: GenerateRequest = {
      topic: cleanedTopic,
      contentType,
      style,
    }

    const result = await generateContent(generateRequest)

    // --- 记录用量 ---
    await incrementUsage(userId, fingerprint)

    // --- 保存记录（如果已登录） ---
    let recordId: string | null = null
    if (userId) {
      const { data } = await supabase
        .from("generations")
        .insert({
          user_id: userId,
          topic: cleanedTopic,
          content_type: contentType,
          style,
          titles: result.titles,
          body: result.body,
          tags: result.tags,
        })
        .select("id")
        .single()

      recordId = data?.id ?? null
    }

    return NextResponse.json({
      ...result,
      recordId,
      quota: {
        used: quota.used + 1,
        limit: quota.limit,
        remaining: quota.limit - (quota.used + 1),
      },
    })
  } catch (error) {
    console.error("Generate API error:", error)

    const message =
      error instanceof Error ? error.message : "生成失败，请稍后重试"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
