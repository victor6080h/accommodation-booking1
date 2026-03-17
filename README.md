# 🏠 속초 아파트 예약 시스템

## 📌 프로젝트 개요

**여러 사용자가 함께 사용 가능한 실시간 숙박 예약 관리 시스템**

- **프로젝트명**: 속초 아파트
- **기술 스택**: Next.js 14, TypeScript, Tailwind CSS, Supabase PostgreSQL
- **배포 플랫폼**: Vercel
- **데이터 저장**: Supabase (실시간 동기화)

---

## 🌐 사이트 URL

### 게스트용 사이트
- **메인 홈페이지**: https://accommodation-booking1.vercel.app
- **예약 캘린더**: https://accommodation-booking1.vercel.app/guest/calendar
- **이용안내**: https://accommodation-booking1.vercel.app/guest/guide

### 관리자용 사이트 (URL 직접 입력)
- **관리자 대시보드**: https://accommodation-booking1.vercel.app/admin
- **객실 관리**: https://accommodation-booking1.vercel.app/admin/rooms
- **예약 캘린더**: https://accommodation-booking1.vercel.app/admin/calendar
- **이용안내 관리**: https://accommodation-booking1.vercel.app/admin/guide

### 개발 관리
- **GitHub 저장소**: https://github.com/victor6080h/accommodation-booking1
- **Vercel 대시보드**: https://vercel.com/victors-projects-35c00d02/accommodation-booking1
- **Supabase 대시보드**: https://supabase.com/dashboard (프로젝트: sokcho-apartment)

---

## ✨ 주요 기능

### 👥 게스트 기능
1. **예약하기** (`/guest/calendar`)
   - 캘린더에서 체크인/체크아웃 날짜 선택
   - 실시간 예약 가능/완료 상태 확인
   - 객실 선택 및 예약자 정보 입력
   - 즉시 예약 완료

2. **이용안내** (`/guest/guide`)
   - 관리자가 작성한 숙소 이용 안내 확인
   - 체크인/체크아웃 방법, 시설 안내 등

### 🔐 관리자 기능

1. **객실 관리** (`/admin/rooms`)
   - 객실 등록 (객실명, 호수, 가격, 수용 인원, 설명)
   - 객실 수정 및 삭제
   - 등록된 객실 목록 확인

2. **예약 캘린더** (`/admin/calendar`)
   - **월별 매출 통계**: 선택한 월의 총 매출 자동 계산
   - **월별 예약 건수**: 확정된 예약 건수 표시
   - **캘린더 뷰**: 날짜별 예약 가능/완료 상태 시각화
   - **예약 목록**: 월별로 필터링된 예약 상세 정보
   - **예약 취소**: 각 예약을 취소하고 취소 목록으로 이동
   - **취소된 예약**: 취소된 예약 내역 별도 표시 (금액 취소선)

3. **이용안내 관리** (`/admin/guide`)
   - 마크다운 형식으로 이용안내 작성
   - 실시간 미리보기
   - 저장 시 게스트 페이지에 자동 반영

---

## 🗂️ 데이터 구조

### Supabase 테이블

#### 1. `rooms` (객실)
```sql
- id: UUID (Primary Key)
- name: TEXT (객실명)
- room_number: TEXT (호수)
- price: INTEGER (1박 가격)
- capacity: INTEGER (최대 인원)
- description: TEXT (객실 설명)
- created_at: TIMESTAMP
```

#### 2. `bookings` (예약)
```sql
- id: UUID (Primary Key)
- room_id: UUID (객실 ID - Foreign Key)
- room_name: TEXT (객실명)
- guest_name: TEXT (예약자명)
- guest_phone: TEXT (연락처)
- check_in: DATE (체크인 날짜)
- check_out: DATE (체크아웃 날짜)
- status: TEXT (confirmed|completed|cancelled)
- created_at: TIMESTAMP
```

#### 3. `guide_content` (이용안내)
```sql
- id: UUID (Primary Key)
- content: TEXT (안내 내용)
- updated_at: TIMESTAMP
```

---

## 📊 비즈니스 로직

### 예약 가능 여부 확인
- 체크인 ~ 체크아웃 날짜가 기존 예약과 겹치지 않는지 확인
- 과거 날짜는 예약 불가
- 체크아웃 날짜도 예약 완료로 표시 (중복 예약 방지)

### 월별 매출 계산
```
매출 = Σ (객실 1박 가격 × 숙박일수)
- 체크인 날짜가 해당 월에 속하는 예약만 포함
- 확정된 예약(status: 'confirmed')만 계산
- 취소된 예약은 제외
```

### 월별 예약 건수
```
예약 건수 = 해당 월에 체크인 날짜가 있는 확정 예약 수
- status가 'confirmed'인 예약만 카운트
```

---

## 🔐 환경 변수 설정

### Vercel 환경 변수 (이미 설정됨)
```
NEXT_PUBLIC_SUPABASE_URL=https://oghdzrpzluzxoyvsexon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎨 디자인 시스템

### 색상 구분
- **게스트 페이지**: 파란색 (Blue) 계열
- **관리자 페이지**: 회색 (Gray) 계열
- **예약 가능**: 초록색 (Green)
- **예약 완료**: 빨간색 (Red)
- **선택된 날짜**: 파란색 (Blue)

### 주요 UI 컴포넌트
- 캘린더 그리드 레이아웃
- 카드 형식 정보 표시
- 모달 형식 예약 폼
- 통계 대시보드 카드

---

## 🚀 배포 상태

- ✅ **Next.js 14** 프로젝트 설정 완료
- ✅ **Supabase PostgreSQL** 데이터베이스 연동 완료
- ✅ **Vercel 자동 배포** 설정 완료
- ✅ **GitHub 저장소** 연동 완료
- ✅ **실시간 동기화** 작동 확인
- ✅ **관리자 버튼** 게스트 페이지에서 제거 완료

### 최신 업데이트 (2024-03-17)
- 메인 홈페이지에서 관리자 버튼 제거
- 게스트용 네비게이션에서 관리자 링크 완전 삭제
- 관리자 페이지는 URL 직접 입력으로만 접근 가능

---

## 📱 사용 가이드

### 게스트 (숙소 예약)
1. https://accommodation-booking1.vercel.app 접속
2. "예약하기" 버튼 클릭 → 캘린더 페이지로 이동
3. 체크인 날짜 클릭 → 체크아웃 날짜 클릭
4. 객실 선택 및 예약자 정보 입력
5. "예약 완료하기" 클릭 → 예약 완료

### 관리자 (숙소 관리)
1. https://accommodation-booking1.vercel.app/admin 직접 입력하여 접속
2. **객실 관리**: 객실 등록/수정/삭제
3. **예약 캘린더**: 월별 매출, 예약 건수 확인 및 예약 취소
4. **이용안내 관리**: 게스트용 안내 내용 작성

---

## 🔧 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/victor6080h/accommodation-booking1.git
cd accommodation-booking1

# 의존성 설치
npm install

# 환경 변수 설정 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://oghdzrpzluzxoyvsexon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 개발 서버 실행
npm run dev
```

---

## 🌟 향후 개선 사항

### 보안
- [ ] 관리자 로그인 기능 추가
- [ ] 비밀번호 인증 시스템
- [ ] 세션 관리

### 기능
- [ ] 이메일 예약 확인서 발송
- [ ] 결제 시스템 연동
- [ ] 예약자 마이페이지
- [ ] 리뷰 및 평점 시스템
- [ ] 사진 갤러리 추가

### UI/UX
- [ ] 모바일 앱 최적화
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 다크 모드
- [ ] 애니메이션 효과

---

## 📞 문의

- **GitHub Issues**: https://github.com/victor6080h/accommodation-booking1/issues
- **프로젝트 관리자**: victor6080h

---

## 📄 라이센스

© 2024 속초 아파트. All rights reserved.

---

## 🎯 프로젝트 완료 항목

✅ 1. 사이트 제목 "속초 아파트"로 변경  
✅ 2. 관리자 사이트와 게스트 사이트 분리  
✅ 3. 관리자가 객실 직접 등록 (가격, 호수 등)  
✅ 4. 시설 페이지 삭제  
✅ 5. 객실 안내 페이지 생성 (관리자가 직접 작성)  
✅ 6. 예약 가능/완료 상태 캘린더에 직관적 표시  
✅ 7. 관리자 예약 취소 기능  
✅ 8. 월별 매출 확인 기능  
✅ 9. 월별 예약 목록 필터링  
✅ 10. 메인 페이지에서 관리자 버튼 제거  
✅ 11. Supabase 데이터베이스 연동 (다중 사용자 지원)
