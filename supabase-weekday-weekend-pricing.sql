-- rooms 테이블에 주중/주말 가격 컬럼 추가

-- 1. 주중 가격 컬럼 추가 (일~목: 일, 월, 화, 수, 목)
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS weekday_price INTEGER;

-- 2. 주말 가격 컬럼 추가 (금~토: 금, 토)
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS weekend_price INTEGER;

-- 3. 기존 데이터 업데이트 (기존 price를 주중 가격으로, 주말은 +20% 기본값)
UPDATE rooms 
SET weekday_price = price, 
    weekend_price = CAST(price * 1.2 AS INTEGER)
WHERE weekday_price IS NULL;

-- 4. 주중/주말 가격이 NULL이면 기본 price 사용하도록 기본값 설정
-- (이미 있는 데이터는 위에서 업데이트됨)

-- 참고: 이 스크립트를 Supabase SQL Editor에서 실행하세요.
-- https://supabase.com/dashboard/project/oghdzrpzluzxoyvsexon/editor
