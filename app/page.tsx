"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import GeneratorForm from "@/components/GeneratorForm"
import ResultCard from "@/components/ResultCard"
import { GenerateResult, UsageQuota } from "@/types"

export default function HomePage() {
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [quota, setQuota] = useState<UsageQuota | null>(null)

  useEffect(() => {
    fetchQuota()
  }, [])

  const fetchQuota = async () => {
    try {
      const res = await fetch("/api/usage")
      if (res.ok) {
        const data = await res.json()
        setQuota(data.quota)
      }
    } catch {
      // 静默失败
    }
  }

  const handleResult = (
    data: GenerateResult & { quota?: { used: number; limit: number; remaining: number } }
  ) => {
    setResult(data)
    setError("")
    if (data.quota) {
      setQuota(data.quota)
    }
  }

  const handleError = (msg: string) => {
    setError(msg)
    setResult(null)
  }

  const handleRetry = () => {
    setResult(null)
    setError("")
  }

  return (
    <>
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            笔灵 ✨
          </h1>
          <p className="text-lg text-gray-500">
            输入主题，秒出高质量小红书文案
          </p>
        </div>

        {/* 生成表单 */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <GeneratorForm
            onResult={handleResult}
            onError={handleError}
            onLoading={setIsLoading}
            isLoading={isLoading}
            initialQuota={quota}
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* 生成结果 */}
        {result && !isLoading && (
          <ResultCard result={result} onRetry={handleRetry} />
        )}

        {/* 底部 CTA */}
        {!result && !isLoading && !error && (
          <div className="text-center mt-12 py-8">
            <p className="text-sm text-gray-400 mb-3">
              每天免费 {quota?.limit ?? 1} 次 · 注册即享 3 次/天
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
              <span>✨ 去 AI 味</span>
              <span>·</span>
              <span>🎯 5 种内容类型</span>
              <span>·</span>
              <span>💅 5 种人设风格</span>
              <span>·</span>
              <span>📋 一键复制</span>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
