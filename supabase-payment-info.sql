-- 입금 계좌 정보 테이블 생성
-- Supabase SQL Editor에서 실행하세요
-- https://supabase.com/dashboard/project/oghdzrpzluzxoyvsexon/editor

-- 1. payment_info 테이블 생성
CREATE TABLE IF NOT EXISTS payment_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_payment_info_is_active ON payment_info(is_active);

-- 3. RLS 비활성화
ALTER TABLE payment_info DISABLE ROW LEVEL SECURITY;

-- 4. 기본 계좌 정보 삽입
INSERT INTO payment_info (bank_name, account_number, account_holder) VALUES
  ('국민은행', '123456-78-901234', '속초아파트')
ON CONFLICT DO NOTHING;

-- 5. 현재 데이터 확인
SELECT * FROM payment_info WHERE is_active = true;
