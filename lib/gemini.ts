import { GoogleGenerativeAI } from "@google/generative-ai"
import { GenerateRequest, GenerateResult } from "@/types"
import { buildSystemPrompt, buildUserPrompt } from "./prompt-templates"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const GENERATION_CONFIG = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
}

const MODEL_NAME = "gemini-1.5-flash"

export async function generateContent(
  request: GenerateRequest
): Promise<GenerateResult> {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: GENERATION_CONFIG,
  })

  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(request.topic, request.contentType, request.style)

  const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`

  const result = await model.generateContent(fullPrompt)
  const response = result.response
  const text = response.text()

  // 清理 Gemini 可能包裹的 markdown 代码块
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim()

  try {
    const parsed = JSON.parse(cleaned) as GenerateResult

    if (
      !Array.isArray(parsed.titles) ||
      typeof parsed.body !== "string" ||
      !Array.isArray(parsed.tags)
    ) {
      throw new Error("Gemini 返回了无效的输出格式")
    }

    return parsed
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", text)
    throw new Error("AI 生成失败，请重试")
  }
}
