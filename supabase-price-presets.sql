-- 가격 프리셋 테이블 생성
-- 관리자가 자주 사용하는 가격을 프리셋으로 저장하고, 캘린더에서 날짜 선택 후 한번에 적용

CREATE TABLE IF NOT EXISTS price_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 프리셋 데이터 추가
INSERT INTO price_presets (name, price, color, display_order) VALUES
  ('비수기', 100000, '#10b981', 1),
  ('평일', 130000, '#3b82f6', 2),
  ('주말', 200000, '#f59e0b', 3),
  ('성수기', 250000, '#ef4444', 4),
  ('특가', 80000, '#8b5cf6', 5)
ON CONFLICT DO NOTHING;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_price_presets_display_order ON price_presets(display_order);
CREATE INDEX IF NOT EXISTS idx_price_presets_is_active ON price_presets(is_active);

-- 참고: 이 스크립트를 Supabase SQL Editor에서 실행하세요.
-- https://supabase.com/dashboard/project/oghdzrpzluzxoyvsexon/editor
