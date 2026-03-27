-- =============================================
-- 게스트 계정 테이블 생성
-- =============================================

-- 1. 게스트 계정 테이블
CREATE TABLE IF NOT EXISTS guest_account (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL DEFAULT 'guest',
  password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 정책 설정
ALTER TABLE guest_account ENABLE ROW LEVEL SECURITY;

-- 3. 읽기 권한 (모든 사용자)
CREATE POLICY "Anyone can read guest_account"
  ON guest_account FOR SELECT
  USING (true);

-- 4. 쓰기 권한 (모든 사용자)
CREATE POLICY "Anyone can insert guest_account"
  ON guest_account FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update guest_account"
  ON guest_account FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete guest_account"
  ON guest_account FOR DELETE
  USING (true);

-- 5. 초기 게스트 계정 생성
-- 기본 계정: guest / guest1234
INSERT INTO guest_account (username, password) VALUES
  ('guest', 'guest1234')
ON CONFLICT DO NOTHING;

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_guest_account_is_active ON guest_account(is_active);

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
-- - 초기 비밀번호(guest1234)를 반드시 변경하세요!
-- - 게스트 계정은 단일 계정만 사용합니다
-- - 관리자 페이지에서 비밀번호를 변경할 수 있습니다
-- =============================================
