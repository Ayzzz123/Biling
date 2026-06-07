"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">登录 / 注册 笔灵</h1>
        <p className="text-center text-sm text-gray-400 mb-6">
          无需密码，验证邮箱即可登录
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
          🎉 <strong>早鸟活动：</strong>前 10 名注册用户每日可享 <strong>15 次</strong> 免费生成，之后注册的用户每天 5 次。名额有限，先到先得！
        </div>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-green-700 font-medium mb-2">📧 验证链接已发送</p>
            <p className="text-sm text-green-600">
              请查看 <strong>{email}</strong> 的收件箱，点击邮件中的链接即可登录。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendLink} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "发送中..." : "发送验证链接"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              首次使用即自动注册，点击邮件中的链接即可登录
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
