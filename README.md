# 🏠 속초 아파트 예약 시스템

## 📌 프로젝트 개요

**여러 사용자가 함께 사용 가능한 실시간 숙박 예약 관리 시스템**

- **프로젝트명**: 속초 아파트
- **기술 스택**: Next.js 14, TypeScript, Tailwind CSS, Supabase PostgreSQL
- **배포 플랫폼**: Vercel
- **데이터 저장**: Supabase (실시간 동기화)
- **PWA 지원**: 모바일 앱 설치 가능 (관리자 전용)

---

## 🌐 사이트 URL

### 게스트용 사이트
- **메인 홈페이지**: https://accommodation-booking1.vercel.app
- **예약 캘린더**: https://accommodation-booking1.vercel.app/guest/calendar
- **이용안내**: https://accommodation-booking1.vercel.app/guest/guide

### 관리자용 사이트 (로그인 필요)
- **관리자 로그인**: https://accommodation-booking1.vercel.app/admin/login
- **관리자 대시보드**: https://accommodation-booking1.vercel.app/admin
- **객실 관리**: https://accommodation-booking1.vercel.app/admin/rooms
- **예약 캘린더**: https://accommodation-booking1.vercel.app/admin/calendar
- **이용안내 관리**: https://accommodation-booking1.vercel.app/admin/guide
- **아파트 특징**: https://accommodation-booking1.vercel.app/admin/features
- **아파트 사진**: https://accommodation-booking1.vercel.app/admin/images
- **일자별 가격**: https://accommodation-booking1.vercel.app/admin/pricing
- **위치 안내**: https://accommodation-booking1.vercel.app/admin/location
- **관리자 계정**: https://accommodation-booking1.vercel.app/admin/accounts
- **게스트 계정**: https://accommodation-booking1.vercel.app/admin/guest-account

### 개발 관리
- **GitHub 저장소**: https://github.com/victor6080h/accommodation-booking1
- **Vercel 대시보드**: https://vercel.com/victors-projects-35c00d02/accommodation-booking1
- **Supabase 대시보드**: https://supabase.com/dashboard (프로젝트: sokcho-apartment)

---

## ✨ 주요 기능

### 👥 게스트 기능
1. **로그인** (`/guest/login`)
   - 게스트 계정으로 로그인 (관리자가 계정 관리)
   - 비로그인 시 자동으로 로그인 페이지로 리다이렉트

2. **예약하기** (`/guest/calendar`)
   - 캘린더에서 체크인/체크아웃 날짜 선택
   - 실시간 예약 가능/완료 상태 확인
   - 일자별 가격 표시
   - 객실 선택 및 예약자 정보 입력
   - 즉시 예약 완료

3. **이용안내** (`/guest/guide`)
   - 관리자가 작성한 숙소 이용 안내 확인
   - 체크인/체크아웃 방법, 시설 안내 등

### 🔐 관리자 기능

0. **로그인 & 계정 관리**
   - 관리자 로그인 시스템 (`/admin/login`)
   - 관리자 계정 추가/수정/삭제 (`/admin/accounts`)
   - 게스트 계정 관리 (`/admin/guest-account`)

1. **객실 관리** (`/admin/rooms`)
   - 객실 등록 (객실명, 호수, 가격, 수용 인원, 설명)
   - 객실 수정 및 삭제
   - 등록된 객실 목록 확인

2. **예약 캘린더** (`/admin/calendar`)
   - **월별 매출 통계**: 선택한 월의 총 매출 자동 계산 (일자별 가격 반영)
   - **월별 예약 건수**: 확정된 예약 건수 표시
   - **캘린더 뷰**: 날짜별 예약 가능/완료 상태 시각화
   - **예약 목록**: 월별로 필터링된 예약 상세 정보
   - **예약 취소**: 각 예약을 취소하고 취소 목록으로 이동
   - **취소된 예약**: 취소된 예약 내역 별도 표시 (금액 취소선)

3. **일자별 가격 설정** (`/admin/pricing`)
   - 객실별 특정 날짜 가격 설정
   - 주말/평일 다른 가격 적용
   - 캘린더 UI로 직관적 설정
   - 게스트 예약 캘린더에 자동 반영

4. **이용안내 관리** (`/admin/guide`)
   - 마크다운 형식으로 이용안내 작성
   - 실시간 미리보기
   - 저장 시 게스트 페이지에 자동 반영

5. **아파트 특징 관리** (`/admin/features`)
   - 메인 페이지 특징 내용 편집
   - 아이콘, 제목, 설명 관리
   - 표시 순서 및 활성화 상태 관리

6. **아파트 사진 관리** (`/admin/images`)
   - 메인 페이지 사진 업로드
   - Supabase Storage 연동
   - 드래그 앤 드롭 업로드 지원
   - 사진 설명 및 순서 관리

7. **위치 안내 관리** (`/admin/location`)
   - 메인 페이지 위치 정보 수정
   - 주소, 교통편, 주변 관광지 정보 관리

8. **📱 실시간 예약 알림 (PWA)**
   - **실시간 알림**: Supabase Realtime으로 예약 즉시 알림
   - **브라우저 알림**: 푸시 알림 및 소리/진동
   - **알림 센터**: 알림 목록 확인 및 관리
   - **PWA 앱 설치**: 홈 화면에 추가하여 앱처럼 사용
   - **오프라인 지원**: 서비스 워커로 오프라인 캐싱
   - **모바일 최적화**: 터치 친화적 UI/UX

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

#### 4. `features` (아파트 특징)
```sql
- id: UUID (Primary Key)
- icon: TEXT (아이콘)
- title: TEXT (제목)
- description: TEXT (설명)
- display_order: INTEGER (표시 순서)
- is_active: BOOLEAN (활성화 상태)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 5. `apartment_images` (아파트 사진)
```sql
- id: UUID (Primary Key)
- image_url: TEXT (이미지 URL)
- title: TEXT (제목, 선택사항)
- description: TEXT (설명, 선택사항)
- display_order: INTEGER (표시 순서)
- is_active: BOOLEAN (활성화 상태)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 6. `date_pricing` (일자별 가격)
```sql
- id: UUID (Primary Key)
- room_id: UUID (객실 ID - Foreign Key)
- date: DATE (날짜, UNIQUE with room_id)
- price: INTEGER (특별 가격)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 7. `location_info` (위치 정보)
```sql
- id: UUID (Primary Key)
- title: TEXT (제목)
- content: TEXT (내용)
- display_order: INTEGER (표시 순서)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 8. `admin_users` (관리자 계정)
```sql
- id: UUID (Primary Key)
- username: TEXT (아이디, UNIQUE)
- password: TEXT (비밀번호)
- is_active: BOOLEAN (활성화 상태)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 9. `guest_account` (게스트 계정)
```sql
- id: UUID (Primary Key)
- username: TEXT (아이디, 기본값: 'guest')
- password: TEXT (비밀번호)
- is_active: BOOLEAN (활성화 상태)
- created_at: TIMESTAMP
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
매출 = Σ (일자별 가격 × 숙박일수)
- 각 숙박일(체크인 ~ 체크아웃 전날)마다 해당 날짜의 가격 적용
- 일자별 특별 가격이 없으면 객실 기본 가격 적용
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
- ✅ **관리자 로그인 시스템** 구현 완료
- ✅ **게스트 로그인 시스템** 구현 완료
- ✅ **일자별 가격 설정** 구현 완료
- ✅ **위치 안내 관리** 구현 완료
- ✅ **PWA 지원** 구현 완료 (관리자 앱)
- ✅ **실시간 예약 알림** 구현 완료

### 최신 업데이트 (2026-03-27)
- **PWA (Progressive Web App)** 지원 추가
  - 관리자 전용 모바일 앱 설치 가능
  - 홈 화면에 추가하여 앱처럼 사용
  - 오프라인 캐싱 지원
- **실시간 예약 알림**
  - Supabase Realtime으로 예약 즉시 감지
  - 브라우저 푸시 알림 (소리, 진동)
  - 알림 센터에서 알림 내역 관리
  - 알림 클릭 시 예약 캘린더로 바로 이동
- **모바일 최적화 UI/UX**
  - 터치 친화적 관리자 대시보드
  - 반응형 네비게이션 바
  - 모바일에서 직관적이고 전문적인 디자인

---

## 📱 사용 가이드

### 게스트 (숙소 예약)
1. https://accommodation-booking1.vercel.app 접속
2. 게스트 계정으로 로그인 (관리자가 제공한 계정)
3. "예약하기" 버튼 클릭 → 캘린더 페이지로 이동
4. 체크인 날짜 클릭 → 체크아웃 날짜 클릭
5. 일자별 가격 확인 (특별 가격 또는 기본 가격)
6. 객실 선택 및 예약자 정보 입력
7. "예약 완료하기" 클릭 → 예약 완료

### 관리자 (숙소 관리)
1. https://accommodation-booking1.vercel.app/admin/login 에서 로그인
2. **대시보드**: 모든 관리 기능 한눈에 확인
3. **객실 관리**: 객실 등록/수정/삭제
4. **예약 캘린더**: 월별 매출, 예약 건수 확인 및 예약 취소
5. **일자별 가격**: 특정 날짜 가격 설정 (주말/성수기 등)
6. **이용안내 관리**: 게스트용 안내 내용 작성
7. **위치 안내**: 주소, 교통편, 주변 관광지 정보 관리
8. **계정 관리**: 관리자 및 게스트 계정 관리

### 📱 관리자 모바일 앱 설치 (PWA)

#### Android (Chrome)
1. https://accommodation-booking1.vercel.app/admin 접속
2. 하단에 "앱 설치" 팝업 나타남
3. "지금 설치하기" 버튼 클릭
4. 홈 화면에 "속초 아파트 관리자" 아이콘 생성됨
5. 아이콘 클릭 → 앱처럼 실행 (주소창 없음)

#### iOS (Safari)
1. https://accommodation-booking1.vercel.app/admin 접속
2. 하단 공유 버튼 (□↑) 탭
3. "홈 화면에 추가" 선택
4. "추가" 버튼 클릭
5. 홈 화면에 "속초 아파트 관리자" 아이콘 생성됨

#### 앱 기능
- ✅ 설치 후 오프라인에서도 일부 페이지 접근 가능
- ✅ 실시간 예약 알림 수신 (브라우저 알림 권한 필요)
- ✅ 전체 화면 모드 (앱처럼 작동)
- ✅ 빠른 액세스 (홈 화면 아이콘)
- ✅ 알림 소리 및 진동

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

### 기능
- [ ] 예약 빠른 작업 버튼 (예약 확인/취소 원터치)
- [ ] 이메일 예약 확인서 발송
- [ ] 결제 시스템 연동
- [ ] 예약자 마이페이지
- [ ] 리뷰 및 평점 시스템
- [ ] 사진 갤러리 슬라이더

### UI/UX
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 다크 모드
- [ ] 더 많은 애니메이션 효과

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
✅ 8. 월별 매출 확인 기능 (일자별 가격 반영)  
✅ 9. 월별 예약 목록 필터링  
✅ 10. 메인 페이지에서 관리자 버튼 제거  
✅ 11. Supabase 데이터베이스 연동 (다중 사용자 지원)  
✅ 12. 아파트 특징 관리 시스템  
✅ 13. 아파트 사진 업로드 (Supabase Storage + 드래그앤드롭)  
✅ 14. 일자별 가격 설정 시스템  
✅ 15. 위치 안내 관리 시스템  
✅ 16. 관리자 로그인 및 계정 관리  
✅ 17. 게스트 로그인 및 계정 관리  
✅ 18. **PWA 앱 지원 (관리자 전용)**  
✅ 19. **실시간 예약 알림 (Supabase Realtime)**  
✅ 20. **모바일 최적화 UI/UX**
