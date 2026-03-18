// Supabase 연결 테스트
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oghdzrpzluzxoyvsexon.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9naGR6cnB6bHV6eG95dnNleG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjgzNTYsImV4cCI6MjA4OTMwNDM1Nn0.fdAExA3an9K-NbFLV0Ffx4S50B4DAYSwoLYQl9h9pHY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Supabase 연결 테스트 시작...\n')

  // 1. rooms 테이블 읽기 테스트
  console.log('1️⃣ rooms 테이블 읽기 테스트...')
  const { data: rooms, error: readError } = await supabase
    .from('rooms')
    .select('*')
  
  if (readError) {
    console.error('❌ 읽기 실패:', readError.message)
  } else {
    console.log('✅ 읽기 성공:', rooms.length, '개의 객실')
  }

  // 2. rooms 테이블 쓰기 테스트
  console.log('\n2️⃣ rooms 테이블 쓰기 테스트...')
  const { data: newRoom, error: insertError } = await supabase
    .from('rooms')
    .insert([
      {
        name: '테스트 객실',
        room_number: '999호',
        price: 100000,
        capacity: 2,
        description: '테스트용 객실입니다.'
      }
    ])
    .select()
  
  if (insertError) {
    console.error('❌ 쓰기 실패:', insertError.message)
    console.error('상세:', insertError)
  } else {
    console.log('✅ 쓰기 성공:', newRoom)
    
    // 3. 테스트 데이터 삭제
    if (newRoom && newRoom.length > 0) {
      console.log('\n3️⃣ 테스트 데이터 삭제...')
      const { error: deleteError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', newRoom[0].id)
      
      if (deleteError) {
        console.error('❌ 삭제 실패:', deleteError.message)
      } else {
        console.log('✅ 삭제 성공')
      }
    }
  }

  // 4. bookings 테이블 테스트
  console.log('\n4️⃣ bookings 테이블 읽기 테스트...')
  const { data: bookings, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
  
  if (bookingError) {
    console.error('❌ 읽기 실패:', bookingError.message)
  } else {
    console.log('✅ 읽기 성공:', bookings.length, '개의 예약')
  }

  // 5. guide_content 테이블 테스트
  console.log('\n5️⃣ guide_content 테이블 읽기 테스트...')
  const { data: guide, error: guideError } = await supabase
    .from('guide_content')
    .select('*')
  
  if (guideError) {
    console.error('❌ 읽기 실패:', guideError.message)
  } else {
    console.log('✅ 읽기 성공:', guide.length, '개의 안내')
  }

  console.log('\n✅ 테스트 완료!\n')
}

testConnection()
