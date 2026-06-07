-- 判断用户是否为前 10 名注册
CREATE OR REPLACE FUNCTION is_early_bird(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO user_rank
  FROM auth.users
  WHERE created_at < (SELECT created_at FROM auth.users WHERE id = user_id)
    AND deleted_at IS NULL;

  RETURN user_rank <= 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
