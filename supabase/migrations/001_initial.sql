-- 文案生成记录表
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('grass', 'knowledge', 'review', 'life', 'vlog')),
  style TEXT NOT NULL CHECK (style IN ('cute', 'intellectual', 'real', 'funny', 'professional')),
  titles JSONB NOT NULL DEFAULT '[]',
  body TEXT NOT NULL DEFAULT '',
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 每日用量追踪表
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fingerprint TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date),
  UNIQUE(fingerprint, date)
);

-- RLS 索引
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date ON usage_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_usage_logs_fingerprint_date ON usage_logs(fingerprint, date);

-- 启用 RLS
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- generations 表的 RLS 策略
CREATE POLICY "Users can view own generations"
  ON generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations"
  ON generations FOR DELETE
  USING (auth.uid() = user_id);

-- usage_logs 表的 RLS 策略
CREATE POLICY "Users can view own usage"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用量 upsert 存储过程
CREATE OR REPLACE FUNCTION upsert_usage_log(
  p_user_id UUID DEFAULT NULL,
  p_fingerprint TEXT DEFAULT NULL,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
BEGIN
  IF p_user_id IS NOT NULL THEN
    INSERT INTO usage_logs (user_id, date, count)
    VALUES (p_user_id, p_date, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET count = usage_logs.count + 1;
  ELSIF p_fingerprint IS NOT NULL THEN
    INSERT INTO usage_logs (fingerprint, date, count)
    VALUES (p_fingerprint, p_date, 1)
    ON CONFLICT (fingerprint, date)
    DO UPDATE SET count = usage_logs.count + 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
