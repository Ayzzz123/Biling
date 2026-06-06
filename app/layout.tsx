import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "笔灵 - 小红书 AI 文案助手",
  description: "输入主题，秒出高质量小红书文案。专为中文创作者打造的 AI 文案工具。",
  keywords: ["小红书", "文案", "AI", "写作", "内容创作", "种草"],
  openGraph: {
    title: "笔灵 - 小红书 AI 文案助手",
    description: "输入主题，秒出高质量小红书文案。",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        {children}
      </body>
    </html>
  )
}
