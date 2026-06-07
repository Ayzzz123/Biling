"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PenLine, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

type UserLevel = "" | "测试" | "普通" | "开发者"

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [level, setLevel] = useState<UserLevel>("")
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)

      if (u && data.session) {
        const res = await fetch("/api/usage", {
          headers: { Authorization: `Bearer ${data.session.access_token}` },
        })
        if (res.ok) {
          const { quota } = await res.json()
          if (quota.limit >= 99999) setLevel("开发者")
          else if (quota.limit >= 15) setLevel("测试")
          else setLevel("普通")
        }
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (!u) setLevel("")

      if (u && session) {
        const res = await fetch("/api/usage", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (res.ok) {
          const { quota } = await res.json()
          if (quota.limit >= 99999) setLevel("开发者")
          else if (quota.limit >= 15) setLevel("测试")
          else setLevel("普通")
        }
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setLevel("")
    router.push("/")
  }

  return (
    <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
          <PenLine className="w-5 h-5 text-primary-500" />
          笔灵
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-gray-700 text-xs">{user.email}</div>
                {level && (
                  <div className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium inline-block">
                    {level}
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                退出
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              登录 / 注册
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
