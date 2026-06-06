"use client"

import { useState } from "react"
import { Copy, Check, RefreshCw } from "lucide-react"
import { GenerateResult } from "@/types"
import { cn } from "@/lib/utils"

interface ResultCardProps {
  result: GenerateResult
  onRetry: () => void
}

export default function ResultCard({ result, onRetry }: ResultCardProps) {
  const [copied, setCopied] = useState<"title" | "body" | "tags" | null>(null)
  const [selectedTitle, setSelectedTitle] = useState(0)

  const handleCopy = (text: string, type: "title" | "body" | "tags") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const fullContent = `${result.titles[selectedTitle]}\n\n${result.body}\n\n${result.tags.join(" ")}`

  return (
    <div className="space-y-6">
      {/* 标题区 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            📌 爆款标题
          </h3>
          <button
            onClick={() => handleCopy(result.titles.join("\n"), "title")}
            className="text-xs text-gray-400 hover:text-primary-500 flex items-center gap-1 transition-colors"
          >
            {copied === "title" ? (
              <>
                <Check className="w-3.5 h-3.5" /> 已复制
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> 复制全部
              </>
            )}
          </button>
        </div>

        <div className="space-y-2">
          {result.titles.map((title, i) => (
            <button
              key={i}
              onClick={() => setSelectedTitle(i)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all",
                selectedTitle === i
                  ? "border-primary-300 bg-primary-50 text-gray-900"
                  : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
              )}
            >
              <span className="text-sm">{title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 正文区 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            📝 正文
          </h3>
          <button
            onClick={() => handleCopy(result.body, "body")}
            className="text-xs text-gray-400 hover:text-primary-500 flex items-center gap-1 transition-colors"
          >
            {copied === "body" ? (
              <>
                <Check className="w-3.5 h-3.5" /> 已复制
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> 复制
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-100 card-shadow">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
            {result.body}
          </p>
        </div>
      </section>

      {/* 话题标签 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            🏷️ 推荐话题
          </h3>
          <button
            onClick={() => handleCopy(result.tags.join(" "), "tags")}
            className="text-xs text-gray-400 hover:text-primary-500 flex items-center gap-1 transition-colors"
          >
            {copied === "tags" ? (
              <>
                <Check className="w-3.5 h-3.5" /> 已复制
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> 复制
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 一键复制全文 + 重新生成 */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => handleCopy(fullContent, "body")}
          className="flex-1 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
        >
          {copied === "body" ? (
            <>
              <Check className="w-4 h-4" /> 已复制全文
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> 一键复制全文
            </>
          )}
        </button>

        <button
          onClick={onRetry}
          className="py-3 px-6 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          重新生成
        </button>
      </div>
    </div>
  )
}
