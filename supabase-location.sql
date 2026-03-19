-- =============================================
-- 위치 정보 테이블 생성
-- =============================================

-- 1. 위치 정보 테이블
CREATE TABLE IF NOT EXISTS location_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 정책 설정
ALTER TABLE location_info ENABLE ROW LEVEL SECURITY;

-- 3. 읽기 권한 (모든 사용자)
CREATE POLICY "Anyone can read location_info"
  ON location_info FOR SELECT
  USING (true);

-- 4. 쓰기 권한 (모든 사용자 - 관리자 인증 구현 전까지)
CREATE POLICY "Anyone can insert location_info"
  ON location_info FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update location_info"
  ON location_info FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete location_info"
  ON location_info FOR DELETE
  USING (true);

-- 5. 초기 데이터 삽입
INSERT INTO location_info (title, content) VALUES
  ('강원도 속초시', '• 속초 해수욕장: 도보 10분
• 속초 관광수산시장: 차량 5분
• 설악산: 차량 15분')
ON CONFLICT DO NOTHING;

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_location_info_is_active ON location_info(is_active);

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
