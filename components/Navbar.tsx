"use client"

import Link from "next/link"
import { PenLine } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
          <PenLine className="w-5 h-5 text-primary-500" />
          笔灵
        </Link>
      </div>
    </nav>
  )
}
