"use client"

import { ContentType, StyleType, CONTENT_TYPE_LABELS, STYLE_LABELS, STYLE_EMOJIS } from "@/types"
import { cn } from "@/lib/utils"

interface StyleSelectorProps {
  contentType: ContentType
  onContentTypeChange: (type: ContentType) => void
  style: StyleType
  onStyleChange: (style: StyleType) => void
}

const contentTypes = Object.entries(CONTENT_TYPE_LABELS) as [ContentType, string][]
const styles = Object.entries(STYLE_LABELS) as [StyleType, string][]

export default function StyleSelector({
  contentType,
  onContentTypeChange,
  style,
  onStyleChange,
}: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      {/* 内容类型选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          内容类型
        </label>
        <div className="flex flex-wrap gap-2">
          {contentTypes.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => onContentTypeChange(key)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                contentType === key
                  ? "bg-primary-500 text-white shadow-md shadow-primary-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-500"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 人设风格选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          人设风格
        </label>
        <div className="flex flex-wrap gap-2">
          {styles.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => onStyleChange(key)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                style === key
                  ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900"
              )}
            >
              {STYLE_EMOJIS[key]} {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
