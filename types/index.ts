// 内容类型
export type ContentType = "grass" | "knowledge" | "review" | "life" | "vlog"

// 人设风格
export type StyleType = "cute" | "intellectual" | "real" | "funny" | "professional"

// 内容类型的中文映射
export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  grass: "种草笔记",
  knowledge: "干货分享",
  review: "好物测评",
  life: "生活记录",
  vlog: "Vlog",
}

// 风格的中文映射
export const STYLE_LABELS: Record<StyleType, string> = {
  cute: "可爱",
  intellectual: "知性",
  real: "真实分享",
  funny: "搞笑",
  professional: "专业",
}

// 风格表情
export const STYLE_EMOJIS: Record<StyleType, string> = {
  cute: "🌸",
  intellectual: "📚",
  real: "💬",
  funny: "🤪",
  professional: "💼",
}

// 生成请求
export interface GenerateRequest {
  topic: string
  contentType: ContentType
  style: StyleType
}

// 生成结果
export interface GenerateResult {
  titles: string[]
  body: string
  tags: string[]
}

// 生成记录（数据库）
export interface GenerationRecord {
  id: string
  userId: string | null
  topic: string
  contentType: ContentType
  style: StyleType
  titles: string[]
  body: string
  tags: string[]
  createdAt: string
}

// 使用配额
export interface UsageQuota {
  used: number
  limit: number
  remaining: number
}
