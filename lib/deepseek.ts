import { GenerateRequest, GenerateResult } from "@/types"
import { buildSystemPrompt, buildUserPrompt } from "./prompt-templates"

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ""

export async function generateContent(
  request: GenerateRequest
): Promise<GenerateResult> {
  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(request.topic, request.contentType, request.style)

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("DeepSeek API error:", response.status, errorText)
    throw new Error("AI 生成失败，请稍后重试")
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ""

  try {
    const parsed = JSON.parse(text) as GenerateResult

    if (
      !Array.isArray(parsed.titles) ||
      typeof parsed.body !== "string" ||
      !Array.isArray(parsed.tags)
    ) {
      throw new Error("AI 返回了无效的输出格式")
    }

    return parsed
  } catch (e) {
    console.error("Failed to parse DeepSeek response:", text)
    throw new Error("AI 生成失败，请重试")
  }
}
