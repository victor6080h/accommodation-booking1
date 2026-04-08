// 대한민국 공휴일 및 임시 공휴일 데이터
// 2024년 ~ 2027년

export interface Holiday {
  date: string // YYYY-MM-DD 형식
  name: string
  isTemporary?: boolean // 임시 공휴일 여부
}

// 고정 공휴일 (매년 같은 날짜)
const fixedHolidays = [
  { month: 1, day: 1, name: '신정' },
  { month: 3, day: 1, name: '삼일절' },
  { month: 5, day: 5, name: '어린이날' },
  { month: 6, day: 6, name: '현충일' },
  { month: 8, day: 15, name: '광복절' },
  { month: 10, day: 3, name: '개천절' },
  { month: 10, day: 9, name: '한글날' },
  { month: 12, day: 25, name: '크리스마스' }
]

// 음력 공휴일 (양력 날짜로 변환된 값)
const lunarHolidays: Record<number, Array<{ date: string; name: string }>> = {
  2024: [
    { date: '2024-02-09', name: '설날 연휴' },
    { date: '2024-02-10', name: '설날' },
    { date: '2024-02-11', name: '설날 연휴' },
    { date: '2024-02-12', name: '설날 대체공휴일' },
    { date: '2024-04-10', name: '제22대 국회의원 선거일' },
    { date: '2024-05-06', name: '어린이날 대체공휴일' },
    { date: '2024-05-15', name: '부처님 오신 날' },
    { date: '2024-09-16', name: '추석 연휴' },
    { date: '2024-09-17', name: '추석' },
    { date: '2024-09-18', name: '추석 연휴' }
  ],
  2025: [
    { date: '2025-01-28', name: '설날 연휴' },
    { date: '2025-01-29', name: '설날' },
    { date: '2025-01-30', name: '설날 연휴' },
    { date: '2025-03-03', name: '삼일절 대체공휴일' },
    { date: '2025-05-05', name: '어린이날' },
    { date: '2025-05-06', name: '부처님 오신 날' },
    { date: '2025-10-05', name: '추석 연휴' },
    { date: '2025-10-06', name: '추석' },
    { date: '2025-10-07', name: '추석 연휴' },
    { date: '2025-10-08', name: '추석 대체공휴일' }
  ],
  2026: [
    { date: '2026-02-16', name: '설날 연휴' },
    { date: '2026-02-17', name: '설날' },
    { date: '2026-02-18', name: '설날 연휴' },
    { date: '2026-05-24', name: '부처님 오신 날' },
    { date: '2026-05-25', name: '부처님 오신 날 대체공휴일' },
    { date: '2026-06-08', name: '지방선거일 (예상)' },
    { date: '2026-09-24', name: '추석 연휴' },
    { date: '2026-09-25', name: '추석' },
    { date: '2026-09-26', name: '추석 연휴' }
  ],
  2027: [
    { date: '2027-02-06', name: '설날 연휴' },
    { date: '2027-02-07', name: '설날' },
    { date: '2027-02-08', name: '설날 연휴' },
    { date: '2027-05-13', name: '부처님 오신 날' },
    { date: '2027-09-14', name: '추석 연휴' },
    { date: '2027-09-15', name: '추석' },
    { date: '2027-09-16', name: '추석 연휴' }
  ]
}

// 임시 공휴일 (정부 지정)
const temporaryHolidays: Holiday[] = [
  // 추가 임시 공휴일이 발표되면 여기에 추가
]

// 모든 공휴일 조회
export function getHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = []

  // 고정 공휴일 추가
  fixedHolidays.forEach(holiday => {
    holidays.push({
      date: `${year}-${String(holiday.month).padStart(2, '0')}-${String(holiday.day).padStart(2, '0')}`,
      name: holiday.name
    })
  })

  // 음력 공휴일 추가
  if (lunarHolidays[year]) {
    holidays.push(...lunarHolidays[year])
  }

  // 임시 공휴일 추가
  temporaryHolidays.forEach(holiday => {
    if (holiday.date.startsWith(year.toString())) {
      holidays.push(holiday)
    }
  })

  return holidays
}

// 특정 날짜가 공휴일인지 확인
export function isHoliday(dateStr: string): Holiday | null {
  const year = parseInt(dateStr.split('-')[0])
  const holidays = getHolidays(year)
  return holidays.find(h => h.date === dateStr) || null
}

// 월별 공휴일 조회
export function getHolidaysInMonth(year: number, month: number): Holiday[] {
  const allHolidays = getHolidays(year)
  const monthStr = String(month + 1).padStart(2, '0')
  return allHolidays.filter(h => h.date.startsWith(`${year}-${monthStr}`))
}

// 공휴일 색상 (빨간색)
export const HOLIDAY_COLOR = 'text-red-600'
export const HOLIDAY_BG_COLOR = 'bg-red-50'
