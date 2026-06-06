"use client"

import { useState, FormEvent } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { ContentType, StyleType, GenerateResult, UsageQuota } from "@/types"
import StyleSelector from "./StyleSelector"
import { cn } from "@/lib/utils"

interface GeneratorFormProps {
  onResult: (result: GenerateResult & { quota?: { used: number; limit: number; remaining: number } }) => void
  onError: (error: string) => void
  onLoading: (loading: boolean) => void
  isLoading: boolean
  initialQuota: UsageQuota | null
}

const PLACEHOLDERS = [
  "例如：推荐一款平价好用的面霜",
  "例如：考研上岸经验分享",
  "例如：周末北京citywalk路线",
  "例如：租房避坑指南",
]

export default function GeneratorForm({
  onResult,
  onError,
  onLoading,
  isLoading,
  initialQuota,
}: GeneratorFormProps) {
  const [topic, setTopic] = useState("")
  const [contentType, setContentType] = useState<ContentType>("grass")
  const [style, setStyle] = useState<StyleType>("real")
  const [placeholder] = useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!topic.trim() || topic.trim().length < 2) {
      onError("请输入至少 2 个字的内容主题")
      return
    }

    onLoading(true)
    onError("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), contentType, style }),
      })

      const data = await response.json()

      if (!response.ok) {
        onError(data.error || "生成失败，请稍后重试")
        return
      }

      onResult(data)
    } catch {
      onError("网络错误，请检查连接后重试")
    } finally {
      onLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 主题输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          你想写什么？
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={placeholder}
          maxLength={200}
          rows={3}
          className={cn(
            "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white",
            "text-gray-900 placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent",
            "resize-none transition-all text-base"
          )}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">
            {initialQuota ? `今日剩余 ${initialQuota.remaining} 次` : ""}
          </span>
          <span className="text-xs text-gray-400">
            {topic.length}/200
          </span>
        </div>
      </div>

      {/* 风格选择 */}
      <StyleSelector
        contentType={contentType}
        onContentTypeChange={setContentType}
        style={style}
        onStyleChange={setStyle}
      />

      {/* 生成按钮 */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full py-3.5 rounded-xl font-semibold text-white text-lg transition-all",
          "bg-primary-500 hover:bg-primary-600",
          "shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            正在生成文案...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            生成文案
          </>
        )}
      </button>
    </form>
  )
}
