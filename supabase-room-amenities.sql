-- 숙소 시설 정보 테이블 생성
-- Supabase SQL Editor에서 실행하세요
-- https://supabase.com/dashboard/project/oghdzrpzluzxoyvsexon/editor

-- 1. room_amenities 테이블 생성
CREATE TABLE IF NOT EXISTS room_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'structure', 'basic', 'additional'
  icon TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_room_amenities_category ON room_amenities(category);
CREATE INDEX IF NOT EXISTS idx_room_amenities_display_order ON room_amenities(display_order);
CREATE INDEX IF NOT EXISTS idx_room_amenities_is_active ON room_amenities(is_active);

-- 3. RLS 비활성화
ALTER TABLE room_amenities DISABLE ROW LEVEL SECURITY;

-- 4. 기본 데이터 삽입 (방 구조)
INSERT INTO room_amenities (category, icon, name, description, display_order) VALUES
  ('structure', '🛏️', '방', '3개', 1),
  ('structure', '🛁', '화장실', '2개', 2),
  ('structure', '🍳', '주방', '1개', 3),
  ('structure', '🛋️', '거실', '1개', 4)
ON CONFLICT DO NOTHING;

-- 5. 기본 데이터 삽입 (건물 유형 및 면적)
INSERT INTO room_amenities (category, icon, name, description, display_order) VALUES
  ('building', '🏢', '건물 유형', '아파트', 5),
  ('building', '📐', '전용 면적', '31평 (102㎡)', 6)
ON CONFLICT DO NOTHING;

-- 6. 기본 데이터 삽입 (엘리베이터 및 주차)
INSERT INTO room_amenities (category, icon, name, description, display_order) VALUES
  ('facility', '🛗', '엘리베이터', '있음', 7),
  ('facility', '🅿️', '주차', '무료 주차(여유)', 8)
ON CONFLICT DO NOTHING;

-- 7. 기본 데이터 삽입 (기본 옵션)
INSERT INTO room_amenities (category, icon, name, description, display_order) VALUES
  ('basic', '❄️', '냉장고', '있음', 10),
  ('basic', '🌪️', '세탁기', '있음', 11),
  ('basic', '🔥', '에어컨', '있음', 12),
  ('basic', '📺', 'TV', '있음', 13),
  ('basic', '📶', '와이파이', '무료', 14),
  ('basic', '🔌', '싱크대', '있음', 15),
  ('basic', '🎮', '가스레인지', '있음', 16),
  ('basic', '🛏️', '침대', '있음', 17),
  ('basic', '📞', '인덕션', '없음', 18)
ON CONFLICT DO NOTHING;

-- 8. 기본 데이터 삽입 (추가 옵션)
INSERT INTO room_amenities (category, icon, name, description, display_order) VALUES
  ('additional', '📺', '도어락', '있음', 20),
  ('additional', '📹', 'CCTV', '있음', 21),
  ('additional', '🍽️', '관리실', '있음', 22),
  ('additional', '🍽️', '식탁', '있음', 23),
  ('additional', '📺', '전자레인지', '있음', 24),
  ('additional', '🔒', '전기밥솥', '있음', 25),
  ('additional', '🚗', '쇼파', '있음', 26),
  ('additional', '📚', '책상', '있음', 27),
  ('additional', '👔', '옷장', '있음', 28),
  ('additional', '🛁', '신발장', '있음', 29),
  ('additional', '🛁', '화장대', '있음', 30),
  ('additional', '💨', '욕조', '있음', 31),
  ('additional', '💨', '건조기', '있음', 32),
  ('additional', '🪟', '발코니/베란다', '있음', 33),
  ('additional', '👗', '드레스룸', '있음', 34),
  ('additional', '📺', '카트', '있음', 35),
  ('additional', '🧾', '공기청정기', '있음', 36)
ON CONFLICT DO NOTHING;

-- 9. 현재 데이터 확인
SELECT 
  category,
  COUNT(*) as count,
  STRING_AGG(name, ', ') as items
FROM room_amenities
GROUP BY category
ORDER BY 
  CASE category
    WHEN 'structure' THEN 1
    WHEN 'building' THEN 2
    WHEN 'facility' THEN 3
    WHEN 'basic' THEN 4
    WHEN 'additional' THEN 5
  END;

-- 10. 전체 데이터 확인
SELECT * FROM room_amenities ORDER BY category, display_order;
