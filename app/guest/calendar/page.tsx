'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react'
import { supabase, Room, Booking, DatePricing } from '@/lib/supabase'

export default function GuestCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [datePricing, setDatePricing] = useState<DatePricing[]>([])
  const [selectedDates, setSelectedDates] = useState<{ checkIn: Date | null; checkOut: Date | null }>({
    checkIn: null,
    checkOut: null
  })
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    roomId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadDatePricing()
  }, [currentDate, formData.roomId])

  const loadData = async () => {
    // Load bookings from Supabase
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .order('check_in', { ascending: true })

    if (bookingsData) {
      setBookings(bookingsData as Booking[])
    }

    // Load rooms from Supabase
    const { data: roomsData } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true })

    if (roomsData) {
      setRooms(roomsData as Room[])
      if (roomsData.length > 0) {
        setFormData(prev => ({ ...prev, roomId: roomsData[0].id }))
      }
    }
  }

  const loadDatePricing = async () => {
    if (!formData.roomId) return

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const { data, error } = await supabase
      .from('date_pricing')
      .select('*')
      .eq('room_id', formData.roomId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .eq('is_active', true)

    if (!error && data) {
      setDatePricing(data as DatePricing[])
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date: Date): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // 날짜를 비교 가능한 숫자로 변환
  const dateToNumber = (date: Date): number => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }

  const isDateBooked = (day: number) => {
    const checkDate = new Date(year, month, day)
    const checkDateNum = dateToNumber(checkDate)
    
    return bookings.some(booking => {
      if (booking.status !== 'confirmed') return false
      
      const checkIn = new Date(booking.check_in)
      const checkOut = new Date(booking.check_out)
      const checkInNum = dateToNumber(checkIn)
      const checkOutNum = dateToNumber(checkOut)
      
      // 체크인부터 체크아웃까지 모두 예약완료로 표시 (중복 예약 방지)
      return checkDateNum >= checkInNum && checkDateNum <= checkOutNum
    })
  }

  const isPastDate = (day: number) => {
    const checkDate = new Date(year, month, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today
  }

  // 일자별 가격 가져오기
  const getPriceForDate = (day: number): number => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const pricing = datePricing.find(p => p.date === dateStr)
    
    if (pricing) {
      return pricing.price
    }
    
    // 특별 가격이 없으면 주중/주말 가격 확인
    const selectedRoom = rooms.find(r => r.id === formData.roomId)
    if (!selectedRoom) return 0
    
    // 요일 확인 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    const date = new Date(year, month, day)
    const dayOfWeek = date.getDay()
    
    // 금요일(5), 토요일(6)은 주말 가격
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6
    
    if (isWeekend && selectedRoom.weekend_price) {
      return selectedRoom.weekend_price
    } else if (!isWeekend && selectedRoom.weekday_price) {
      return selectedRoom.weekday_price
    }
    
    // 주중/주말 가격이 없으면 기본 가격 반환
    return selectedRoom.price
  }

  const handleDateClick = (day: number) => {
    if (isPastDate(day) || isDateBooked(day)) {
      return
    }

    const clickedDate = new Date(year, month, day)
    clickedDate.setHours(0, 0, 0, 0)

    // 체크인 날짜가 없거나, 이미 체크인/체크아웃이 모두 선택된 경우
    if (!selectedDates.checkIn || selectedDates.checkOut) {
      setSelectedDates({ checkIn: clickedDate, checkOut: null })
      setShowBookingForm(false)
    } else {
      // 체크인이 있고 체크아웃이 없는 경우
      const checkInNum = dateToNumber(selectedDates.checkIn)
      const clickedNum = dateToNumber(clickedDate)
      
      if (clickedNum > checkInNum) {
        // 체크아웃이 체크인보다 나중 날짜인 경우
        // 중간에 예약된 날짜가 있는지 확인
        let hasBookedDateInRange = false
        const tempDate = new Date(selectedDates.checkIn)
        
        while (dateToNumber(tempDate) < clickedNum) {
          tempDate.setDate(tempDate.getDate() + 1)
          if (isDateBooked(tempDate.getDate()) && tempDate.getMonth() === month && tempDate.getFullYear() === year) {
            hasBookedDateInRange = true
            break
          }
        }
        
        if (hasBookedDateInRange) {
          alert('선택한 기간 내에 이미 예약된 날짜가 있습니다.')
          setSelectedDates({ checkIn: clickedDate, checkOut: null })
        } else {
          setSelectedDates({ checkIn: selectedDates.checkIn, checkOut: clickedDate })
          setShowBookingForm(true)
        }
      } else if (clickedNum === checkInNum) {
        // 같은 날짜를 다시 클릭한 경우
        setSelectedDates({ checkIn: null, checkOut: null })
        setShowBookingForm(false)
      } else {
        // 체크아웃이 체크인보다 빠른 경우, 새로운 체크인으로 설정
        setSelectedDates({ checkIn: clickedDate, checkOut: null })
        setShowBookingForm(false)
      }
    }
  }

  const handleBooking = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut || !formData.guestName || !formData.guestPhone || !formData.roomId) {
      alert('모든 정보를 입력해주세요.')
      return
    }

    const selectedRoom = rooms.find(r => r.id === formData.roomId)
    if (!selectedRoom) {
      alert('객실을 선택해주세요.')
      return
    }

    // 1. 예약 생성
    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          room_id: formData.roomId,
          room_name: selectedRoom.name,
          guest_name: formData.guestName,
          guest_phone: formData.guestPhone,
          check_in: formatDate(selectedDates.checkIn),
          check_out: formatDate(selectedDates.checkOut),
          status: 'confirmed'
        }
      ])
      .select()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      alert('예약에 실패했습니다.')
      return
    }

    // 2. 총 금액 계산 (날짜별 가격 반영)
    let totalPrice = 0
    const checkIn = new Date(selectedDates.checkIn)
    const checkOut = new Date(selectedDates.checkOut)
    const currentDate = new Date(checkIn)
    
    while (currentDate < checkOut) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const specialPrice = datePricing.find(dp => dp.date === dateStr)
      totalPrice += specialPrice ? specialPrice.price : selectedRoom.price
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // 3. 알림 생성
    if (newBooking && newBooking.length > 0) {
      await supabase
        .from('booking_notifications')
        .insert([
          {
            booking_id: newBooking[0].id,
            guest_name: formData.guestName,
            room_name: selectedRoom.name,
            check_in: formatDate(selectedDates.checkIn),
            check_out: formatDate(selectedDates.checkOut),
            total_price: totalPrice,
            is_read: false
          }
        ])
    }

    alert('예약이 완료되었습니다!')
    setShowBookingForm(false)
    setSelectedDates({ checkIn: null, checkOut: null })
    setFormData({ guestName: '', guestPhone: '', roomId: rooms[0]?.id || '' })
    loadData() // Reload data
  }

  const handleCancelSelection = () => {
    setSelectedDates({ checkIn: null, checkOut: null })
    setShowBookingForm(false)
  }

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  const isDateInRange = (day: number) => {
    if (!selectedDates.checkIn) return false
    
    const checkDate = new Date(year, month, day)
    const checkDateNum = dateToNumber(checkDate)
    const checkInNum = dateToNumber(selectedDates.checkIn)
    
    if (selectedDates.checkOut) {
      const checkOutNum = dateToNumber(selectedDates.checkOut)
      return checkDateNum >= checkInNum && checkDateNum <= checkOutNum
    }
    
    return checkDateNum === checkInNum
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-28 bg-gray-50"></div>)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isBooked = isDateBooked(day)
    const isPast = isPastDate(day)
    const isInRange = isDateInRange(day)
    const isCheckIn = selectedDates.checkIn && dateToNumber(new Date(year, month, day)) === dateToNumber(selectedDates.checkIn)
    const isCheckOut = selectedDates.checkOut && dateToNumber(new Date(year, month, day)) === dateToNumber(selectedDates.checkOut)
    const isToday = new Date().getDate() === day && 
                    new Date().getMonth() === month && 
                    new Date().getFullYear() === year
    const dayPrice = getPriceForDate(day)

    days.push(
      <div
        key={day}
        onClick={() => handleDateClick(day)}
        className={`min-h-[110px] sm:h-32 border border-gray-200 p-1 sm:p-2 transition flex flex-col justify-between ${
          isBooked || isPast
            ? 'bg-gray-200 cursor-not-allowed'
            : isInRange
            ? 'bg-blue-100 cursor-pointer hover:bg-blue-200'
            : 'bg-white cursor-pointer hover:bg-gray-50'
        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className={`text-xs sm:text-sm font-semibold mb-1 ${
          isPast ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-900'
        }`}>
          {day}
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center gap-1">
          {isCheckIn && (
            <div className="text-[10px] sm:text-xs font-bold text-blue-700 bg-blue-200 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-center w-full">
              체크인
            </div>
          )}
          
          {isCheckOut && (
            <div className="text-[10px] sm:text-xs font-bold text-blue-700 bg-blue-200 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-center w-full">
              체크아웃
            </div>
          )}
          
          {!isCheckIn && !isCheckOut && (
            <>
              {isBooked ? (
                <div className="text-[10px] sm:text-xs font-medium text-red-600 bg-red-100 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-center w-full">
                  예약완료
                </div>
              ) : isPast ? (
                <div className="text-[10px] sm:text-xs font-medium text-gray-500 px-1 sm:px-2 py-0.5 sm:py-1 text-center w-full">
                  지난날짜
                </div>
              ) : (
                <>
                  <div className="text-[10px] sm:text-xs font-medium text-green-600 bg-green-100 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-center w-full whitespace-nowrap">
                    예약가능
                  </div>
                  <div className="text-[9px] sm:text-xs font-bold text-gray-700 text-center w-full px-0.5">
                    <span className="inline-block">{dayPrice.toLocaleString()}</span>
                    <span className="inline-block">원</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">속초 아파트 - 예약하기</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/guest/guide"
                className="text-white hover:text-blue-100"
              >
                이용안내
              </Link>
              <Link
                href="/"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">📅 예약 방법</h2>
          <div className="space-y-2 text-gray-700">
            <p className="flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">1</span>
              캘린더에서 <strong className="mx-1">체크인 날짜</strong>를 클릭하세요
            </p>
            <p className="flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">2</span>
              <strong className="mx-1">체크아웃 날짜</strong>를 클릭하세요
            </p>
            <p className="flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">3</span>
              예약자 정보를 입력하고 <strong className="mx-1">예약을 완료</strong>하세요
            </p>
          </div>
        </div>

        {/* Selected Dates Display */}
        {selectedDates.checkIn && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-lg font-bold text-gray-900">선택된 날짜</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">체크인:</span> {selectedDates.checkIn.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {selectedDates.checkOut && (
                      <>
                        {' → '}
                        <span className="font-semibold">체크아웃:</span> {selectedDates.checkOut.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelSelection}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="선택 취소"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold">
              {year}년 {monthNames[month]}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mb-6 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-600">예약가능</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm text-gray-600">예약완료</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm text-gray-600">선택된 기간</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
            {dayNames.map((dayName, index) => (
              <div
                key={dayName}
                className={`bg-gray-100 text-center py-3 font-semibold ${
                  index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-900'
                }`}
              >
                {dayName}
              </div>
            ))}
            
            {days}
          </div>
        </div>

        {/* Booking Form */}
        {showBookingForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-300">
            <h2 className="text-2xl font-bold mb-6">✍️ 예약 정보 입력</h2>
            
            <div className="space-y-4">
              {rooms.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    객실 선택 *
                  </label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.name} ({room.room_number}) - {room.price.toLocaleString()}원/박
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예약자 성함 *
                </label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 *
                </label>
                <input
                  type="tel"
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="010-1234-5678"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowBookingForm(false)
                    setSelectedDates({ checkIn: null, checkOut: null })
                  }}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-lg font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 text-lg font-medium"
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span>예약 완료하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {rooms.length === 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
            <p className="text-yellow-800 text-lg">
              ⚠️ 현재 등록된 객실이 없습니다. 관리자에게 문의해주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
