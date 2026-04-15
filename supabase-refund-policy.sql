-- 환불 규정 테이블 생성
-- Supabase SQL Editor에서 실행하세요
-- https://supabase.com/dashboard/project/oghdzrpzluzxoyvsexon/editor

-- 1. refund_policy 테이블 생성
CREATE TABLE IF NOT EXISTS refund_policy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_refund_policy_is_active ON refund_policy(is_active);

-- 3. RLS 비활성화
ALTER TABLE refund_policy DISABLE ROW LEVEL SECURITY;

-- 4. 기본 환불 규정 삽입
INSERT INTO refund_policy (content) VALUES
('📅 취소 환불 기준 (체크인 기준)

• 체크인 7일 전: 100% 전액 환불
• 체크인 5~6일 전: 80% 환불 (20% 위약금)
• 체크인 3~4일 전: 50% 환불 (50% 위약금)
• 체크인 1~2일 전: 30% 환불 (70% 위약금)
• 체크인 당일 & 노쇼: 환불 불가 (100% 위약금)

⚠️ 환불 유의사항
• 환불은 영업일 기준 3~5일 소요됩니다
• 계좌이체 수수료 500원은 고객 부담
• 예약자 명의 계좌로만 환불 가능

💡 날짜 변경 (1회 무료)
• 체크인 7일 전까지 가능
• 취소보다 날짜 변경이 유리합니다')
ON CONFLICT DO NOTHING;

-- 5. 현재 데이터 확인
SELECT * FROM refund_policy WHERE is_active = true;
