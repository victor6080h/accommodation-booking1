-- =============================================
-- 아파트 특징 및 사진 관리를 위한 테이블 생성
-- =============================================

-- 1. 아파트 특징 테이블
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 아파트 사진 테이블
CREATE TABLE IF NOT EXISTS apartment_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS (Row Level Security) 정책 설정
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_images ENABLE ROW LEVEL SECURITY;

-- 4. 읽기 권한 (모든 사용자)
CREATE POLICY "Anyone can read features"
  ON features FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read apartment_images"
  ON apartment_images FOR SELECT
  USING (true);

-- 5. 쓰기 권한 (모든 사용자 - 관리자 인증 구현 전까지)
CREATE POLICY "Anyone can insert features"
  ON features FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update features"
  ON features FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete features"
  ON features FOR DELETE
  USING (true);

CREATE POLICY "Anyone can insert apartment_images"
  ON apartment_images FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update apartment_images"
  ON apartment_images FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete apartment_images"
  ON apartment_images FOR DELETE
  USING (true);

-- 6. 초기 데이터 삽입 (기본 특징 3개)
INSERT INTO features (icon, title, description, display_order) VALUES
  ('🏖️', '바다 근처', '속초 해변까지 도보 10분 거리', 1),
  ('🅿️', '주차 가능', '편리한 무료 주차 공간 제공', 2),
  ('🏠', '깨끗한 시설', '최근 리모델링한 깨끗한 공간', 3)
ON CONFLICT DO NOTHING;

-- 7. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_features_display_order ON features(display_order);
CREATE INDEX IF NOT EXISTS idx_features_is_active ON features(is_active);
CREATE INDEX IF NOT EXISTS idx_apartment_images_display_order ON apartment_images(display_order);
CREATE INDEX IF NOT EXISTS idx_apartment_images_is_active ON apartment_images(is_active);

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
