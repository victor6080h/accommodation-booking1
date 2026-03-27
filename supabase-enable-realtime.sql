-- Supabase Realtime 활성화 스크립트

-- 1. bookings 테이블에 대한 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- 2. Realtime 확인 (이 쿼리는 실행하지 말고 참고용)
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- 3. 테이블 권한 확인
GRANT SELECT ON bookings TO anon;
GRANT SELECT ON bookings TO authenticated;

-- 참고: 위 명령어를 Supabase SQL Editor에서 실행하세요.
-- https://supabase.com/dashboard/project/oghdzrpzluzxoyvsexon/editor
