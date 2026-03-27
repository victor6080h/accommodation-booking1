-- =============================================
-- 관리자 계정 테이블 생성
-- =============================================

-- 1. 관리자 계정 테이블
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 정책 설정
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. 읽기 권한 (모든 사용자)
CREATE POLICY "Anyone can read admin_users"
  ON admin_users FOR SELECT
  USING (true);

-- 4. 쓰기 권한 (모든 사용자 - 관리자 인증 구현 전까지)
CREATE POLICY "Anyone can insert admin_users"
  ON admin_users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update admin_users"
  ON admin_users FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete admin_users"
  ON admin_users FOR DELETE
  USING (true);

-- 5. 초기 관리자 계정 생성
-- 기본 계정: admin / admin1234
INSERT INTO admin_users (username, password) VALUES
  ('admin', 'admin1234')
ON CONFLICT DO NOTHING;

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- =============================================
-- 완료!
-- =============================================
-- 이 SQL을 Supabase SQL Editor에서 실행하세요:
-- 1. https://supabase.com/dashboard/project/oghdzrpzluzxoyvsexon
-- 2. 왼쪽 메뉴 "SQL Editor" 클릭
-- 3. "+ New query" 클릭
-- 4. 위 SQL 전체 복사 → 붙여넣기
-- 5. "Run" 버튼 클릭
--
-- ⚠️ 보안 주의사항:
-- - 초기 비밀번호(admin1234)를 반드시 변경하세요!
-- - 실제 운영환경에서는 비밀번호 해싱이 필요합니다.
-- - 현재는 개발용으로 평문 저장되어 있습니다.
-- =============================================
