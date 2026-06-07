"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PenLine, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
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
            <>
              <span className="text-gray-500">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                退出
              </button>
            </>
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
