'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

interface Room {
  id: string
  name: string
  roomNumber: string
  price: number
  capacity: number
  description: string
}

interface Booking {
  id: string
  roomId: string
  roomName: string
  guestName: string
  guestPhone: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'completed' | 'cancelled'
}

export default function GuestCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
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
    const savedBookings = localStorage.getItem('bookings')
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }

    const savedRooms = localStorage.getItem('rooms')
    if (savedRooms) {
      const parsedRooms = JSON.parse(savedRooms)
      setRooms(parsedRooms)
      if (parsedRooms.length > 0) {
        setFormData(prev => ({ ...prev, roomId: parsedRooms[0].id }))
      }
    }
  }, [])

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

  const isDateBooked = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return bookings.some(booking => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      const currentDate = new Date(dateStr)
      return currentDate >= checkIn && currentDate < checkOut && booking.status === 'confirmed'
    })
  }

  const isPastDate = (day: number) => {
    const dateStr = new Date(year, month, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dateStr < today
  }

  const handleDateClick = (day: number) => {
    if (isPastDate(day) || isDateBooked(day)) return

    const clickedDate = new Date(year, month, day)

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      // Start new selection
      setSelectedDates({ checkIn: clickedDate, checkOut: null })
    } else {
      // Complete selection
      if (clickedDate > selectedDates.checkIn) {
        setSelectedDates({ ...selectedDates, checkOut: clickedDate })
        setShowBookingForm(true)
      } else {
        setSelectedDates({ checkIn: clickedDate, checkOut: null })
      }
    }
  }

  const handleBooking = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut || !formData.guestName || !formData.guestPhone || !formData.roomId) {
      alert('모든 정보를 입력해주세요.')
      return
    }

    const selectedRoom = rooms.find(r => r.id === formData.roomId)
    if (!selectedRoom) {
      alert('객실을 선택해주세요.')
      return
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      roomId: formData.roomId,
      roomName: selectedRoom.name,
      guestName: formData.guestName,
      guestPhone: formData.guestPhone,
      checkIn: selectedDates.checkIn.toISOString().split('T')[0],
      checkOut: selectedDates.checkOut.toISOString().split('T')[0],
      status: 'confirmed'
    }

    const updatedBookings = [...bookings, newBooking]
    localStorage.setItem('bookings', JSON.stringify(updatedBookings))
    setBookings(updatedBookings)

    alert('예약이 완료되었습니다!')
    setShowBookingForm(false)
    setSelectedDates({ checkIn: null, checkOut: null })
    setFormData({ guestName: '', guestPhone: '', roomId: rooms[0]?.id || '' })
  }

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  const isDateInRange = (day: number) => {
    if (!selectedDates.checkIn) return false
    const date = new Date(year, month, day)
    if (selectedDates.checkOut) {
      return date >= selectedDates.checkIn && date <= selectedDates.checkOut
    }
    return date.getTime() === selectedDates.checkIn.getTime()
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isBooked = isDateBooked(day)
    const isPast = isPastDate(day)
    const isInRange = isDateInRange(day)
    const isToday = new Date().getDate() === day && 
                    new Date().getMonth() === month && 
                    new Date().getFullYear() === year

    days.push(
      <div
        key={day}
        onClick={() => handleDateClick(day)}
        className={`h-24 border border-gray-200 p-2 transition ${
          isBooked || isPast
            ? 'bg-gray-200 cursor-not-allowed'
            : isInRange
            ? 'bg-blue-100 cursor-pointer hover:bg-blue-200'
            : 'bg-white cursor-pointer hover:bg-gray-50'
        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className={`text-sm font-semibold ${
          isPast ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-900'
        }`}>
          {day}
        </div>
        {isBooked ? (
          <div className="mt-1">
            <div className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
              예약완료
            </div>
          </div>
        ) : isPast ? (
          <div className="mt-1">
            <div className="text-xs font-medium text-gray-500 px-2 py-1">
              지난날짜
            </div>
          </div>
        ) : (
          <div className="mt-1">
            <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
              예약가능
            </div>
          </div>
        )}
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
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">예약 방법</h2>
          <div className="space-y-2 text-gray-600">
            <p>1. 캘린더에서 체크인 날짜를 클릭하세요</p>
            <p>2. 체크아웃 날짜를 클릭하세요</p>
            <p>3. 예약자 정보를 입력하고 예약을 완료하세요</p>
          </div>
        </div>

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
          <div className="flex items-center justify-center space-x-6 mb-6">
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
              <span className="text-sm text-gray-600">선택된 날짜</span>
            </div>
          </div>

          {/* Selected dates display */}
          {selectedDates.checkIn && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-center text-lg">
                <span className="font-bold">체크인:</span> {selectedDates.checkIn.toLocaleDateString('ko-KR')}
                {selectedDates.checkOut && (
                  <>
                    {' → '}
                    <span className="font-bold">체크아웃:</span> {selectedDates.checkOut.toLocaleDateString('ko-KR')}
                  </>
                )}
              </p>
            </div>
          )}

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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">예약 정보 입력</h2>
            
            <div className="space-y-4">
              {rooms.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    객실 선택 *
                  </label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.name} ({room.roomNumber}) - {room.price.toLocaleString()}원/박
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="010-1234-5678"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowBookingForm(false)
                    setSelectedDates({ checkIn: null, checkOut: null })
                  }}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  취소
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span>예약하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {rooms.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              현재 등록된 객실이 없습니다. 관리자에게 문의해주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
