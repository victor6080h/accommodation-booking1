'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, ChevronLeft, ChevronRight } from 'lucide-react'

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

export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<any[]>([])

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('bookings')
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }

    // Load rooms from localStorage
    const savedRooms = localStorage.getItem('rooms')
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms))
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
      // 체크인부터 체크아웃까지 모두 예약완료로 표시 (중복 예약 방지)
      return currentDate >= checkIn && currentDate <= checkOut && booking.status === 'confirmed'
    })
  }

  const getBookingForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return bookings.find(booking => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      const currentDate = new Date(dateStr)
      // 체크인부터 체크아웃까지 모두 예약완료로 표시 (중복 예약 방지)
      return currentDate >= checkIn && currentDate <= checkOut && booking.status === 'confirmed'
    })
  }

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  const days = []
  // Empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isBooked = isDateBooked(day)
    const booking = getBookingForDate(day)
    const isToday = new Date().getDate() === day && 
                    new Date().getMonth() === month && 
                    new Date().getFullYear() === year

    days.push(
      <div
        key={day}
        className={`h-24 border border-gray-200 p-2 ${
          isBooked ? 'bg-red-50' : 'bg-white'
        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
          {day}
        </div>
        {isBooked && booking && (
          <div className="mt-1">
            <div className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
              예약완료
            </div>
            <div className="text-xs text-gray-600 mt-1 truncate">
              {booking.guestName}
            </div>
          </div>
        )}
        {!isBooked && (
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
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 예약 캘린더</span>
            </Link>
            
            <Link
              href="/admin"
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              대시보드
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Calendar Header */}
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
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
            {/* Day headers */}
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
            
            {/* Calendar days */}
            {days}
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-6">예약 목록</h3>
          
          {bookings.filter(b => b.status === 'confirmed').length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              현재 예약 내역이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings
                .filter(b => b.status === 'confirmed')
                .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
                .map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{booking.roomName}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          예약자: {booking.guestName} ({booking.guestPhone})
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          체크인: {booking.checkIn} → 체크아웃: {booking.checkOut}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        예약확정
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
