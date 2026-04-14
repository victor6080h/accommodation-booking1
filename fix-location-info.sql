-- location_info 테이블 확인 및 수정
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'location_info'
ORDER BY ordinal_position;

-- 2. location_info 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS location_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. is_active 컬럼이 없으면 추가
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'location_info' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE location_info ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- 4. created_at 컬럼이 없으면 추가
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'location_info' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE location_info ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- 5. updated_at 컬럼이 없으면 추가
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'location_info' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE location_info ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- 6. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_location_info_is_active ON location_info(is_active);

-- 7. 현재 데이터 확인
SELECT * FROM location_info;

-- 8. RLS (Row Level Security) 정책 확인 및 설정
-- RLS 비활성화 (개발 단계에서는 편의를 위해)
ALTER TABLE location_info DISABLE ROW LEVEL SECURITY;

-- 또는 RLS를 활성화하고 모든 사용자가 읽고 쓸 수 있도록 설정
-- ALTER TABLE location_info ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Enable read access for all users" ON location_info
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Enable insert access for all users" ON location_info
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Enable update access for all users" ON location_info
--   FOR UPDATE USING (true) WITH CHECK (true);
-- 
-- CREATE POLICY "Enable delete access for all users" ON location_info
--   FOR DELETE USING (true);
