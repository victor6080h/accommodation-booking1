-- =============================================
-- 일자별 가격 설정 테이블 생성
-- =============================================

-- 1. 일자별 가격 테이블
CREATE TABLE IF NOT EXISTS date_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, date)
);

-- 2. RLS (Row Level Security) 정책 설정
ALTER TABLE date_pricing ENABLE ROW LEVEL SECURITY;

-- 3. 읽기 권한 (모든 사용자)
CREATE POLICY "Anyone can read date_pricing"
  ON date_pricing FOR SELECT
  USING (true);

-- 4. 쓰기 권한 (모든 사용자 - 관리자 인증 구현 전까지)
CREATE POLICY "Anyone can insert date_pricing"
  ON date_pricing FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update date_pricing"
  ON date_pricing FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete date_pricing"
  ON date_pricing FOR DELETE
  USING (true);

-- 5. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_date_pricing_room_id ON date_pricing(room_id);
CREATE INDEX IF NOT EXISTS idx_date_pricing_date ON date_pricing(date);
CREATE INDEX IF NOT EXISTS idx_date_pricing_is_active ON date_pricing(is_active);

-- =============================================
-- 완료!
-- =============================================
-- 이 SQL을 Supabase SQL Editor에서 실행하세요:
-- 1. https://supabase.com/dashboard/project/oghdzrpzluzxoyvsexon
-- 2. 왼쪽 메뉴 "SQL Editor" 클릭
-- 3. "+ New query" 클릭
-- 4. 위 SQL 전체 복사 → 붙여넣기
-- 5. "Run" 버튼 클릭
-- =============================================
