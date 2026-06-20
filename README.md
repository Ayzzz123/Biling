# 笔灵 (Biling)

> 免费 AI 小红书内容生成器 — 输入主题，秒出爆款笔记。

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-blue)](https://deepseek.com/)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

**线上地址：[biling.site](https://biling.site)**

---

## 这是什么？

笔灵是一个面向中文小红书创作者的 AI 内容生成工具。你只需要输入一个主题，选择内容类型和风格，AI 就会生成一篇完整的小红书笔记——包括爆款标题、正文和标签。

**目标用户：** 小红书博主、内容创作者、市场营销人员。

---

## 功能

- **AI 生成小红书笔记** — 输入主题，选择类型（种草/干货/测评/生活/Vlog）和风格（可爱/知性/真实/搞笑/专业），一键生成
- **多标题生成** — 每次生成 5 个爆款标题供选择
- **风格切换** — 生成后可在不同风格间实时切换，无需重新生成
- **可发布度评分** — AI 对生成内容进行真实感、吸引力、收藏价值、平台适配度四维评分
- **一键复制** — 标题、正文、标签分别复制
- **生成历史** — 登录用户可查看历史记录
- **额度系统** — 匿名用户 2 次/天，注册用户 5 次/天，早鸟用户 15 次/天
- **邀请奖励** — 邀请他人注册可获得额外使用次数
- **热门话题** — 每日更新热门话题推荐

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 14 | App Router, TypeScript |
| 样式 | Tailwind CSS | 响应式设计，移动端优先 |
| 数据库 | Supabase | PostgreSQL + RLS 行级安全 |
| 认证 | Supabase Auth | 邮箱 + 密码登录 |
| AI | DeepSeek API | `deepseek-chat` 模型 |
| 部署 | Vercel | 自动部署 |
| 图标 | Lucide React | v0.x |

---

## 本地开发

### 前提条件

- Node.js 18+
- npm
- Supabase 账号（免费层即可）
- DeepSeek API Key

### 环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DEEPSEEK_API_KEY=sk-...
```

### 安装运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开 http://localhost:3000
```

### 数据库迁移

迁移文件位于 `supabase/migrations/` 目录下，需要按顺序在 Supabase SQL Editor 中手动执行：

1. `001_initial.sql` — 基础表结构
2. `002_early_bird.sql` — 早鸟用户
3. `003_referral.sql` — 邀请系统
4. `004_feedback.sql` — 反馈系统
5. `005_user_profiles.sql` — 用户资料
6. `006_avatar_storage.sql` — 头像存储

---

## 项目结构

```
├── app/
│   ├── api/                    # API 路由
│   │   ├── generate/           # AI 生成 + 用量追踪
│   │   ├── history/            # 生成历史
│   │   ├── usage/              # 额度查询
│   │   ├── trending/           # 热门话题
│   │   ├── referral/           # 邀请系统
│   │   ├── rewrite/            # 文本重写
│   │   └── feedback/           # 用户反馈
│   ├── login/                  # 登录页面
│   ├── feedback/               # 反馈页面
│   └── page.tsx                # 主页
├── components/
│   ├── GeneratorForm.tsx       # 输入表单（主题、类型、风格）
│   ├── ResultCard.tsx          # 生成结果展示
│   ├── Sidebar.tsx             # 侧边栏（历史、资料、邀请）
│   ├── StyleSelector.tsx       # 风格选择器
│   ├── Navbar.tsx              # 导航栏
│   ├── HistoryList.tsx         # 历史记录列表
│   ├── ShareCard.tsx           # 分享卡片
│   ├── FeedbackModal.tsx       # 反馈弹窗
│   └── Toast.tsx               # 提示组件
├── lib/
│   ├── prompt-templates.ts     # AI 提示词模板（核心）
│   ├── deepseek.ts             # DeepSeek API 客户端
│   ├── supabase.ts             # Supabase 客户端 + Token 缓存
│   ├── usage.ts                # 额度管理与追踪
│   ├── fingerprint.ts          # 匿名用户追踪
│   └── email.ts                # 邮件服务
├── types/
│   └── index.ts                # TypeScript 类型定义
├── supabase/
│   └── migrations/             # 数据库迁移脚本
└── public/                     # 静态资源
```

---

## 核心设计

### 提示词工程 (v3.0)

基于 100+ 小红书爆款笔记分析，内置了：

- **6 种标题公式** — 数字冲击、身份反差、痛点、对比、清单、反常识
- **10 种正文结构** — 共情、干货、故事、合集、测评、避坑、教程、观点、日记、问答
- **12 种开头钩子** — 感叹、场景、炸裂、反常识、对话、结果、数字冲击、抱怨、提问、冷知识、情绪、悬念
- **去 AI 味** — 包括禁用词列表、自我检查协议、人类写作信号注入

详见 `lib/prompt-templates.ts`。

### 匿名用户追踪

使用 httpOnly Cookie (`biling_fp`) 对未登录用户进行每日额度限制，基于 User-Agent + IP 的 SHA-256 哈希。

### 用量配额

| 用户类型 | 每日额度 |
|----------|----------|
| 匿名用户 | 2 次 |
| 注册用户 | 5 次 |
| 早鸟用户 | 15 次 |
| 开发者 | 100 次 |

邀请他人注册可获得额外次数奖励。

---

## 部署

```bash
# 构建检查
npm run build

# 部署到生产环境
npx vercel --prod
```

---

## License

MIT
