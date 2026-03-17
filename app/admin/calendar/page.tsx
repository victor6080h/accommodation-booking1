'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, ChevronLeft, ChevronRight, XCircle, DollarSign, TrendingUp } from 'lucide-react'
import { supabase, Room as SupabaseRoom, Booking as SupabaseBooking } from '@/lib/supabase'

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
  totalPrice?: number
}

export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Load bookings from Supabase
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .order('check_in', { ascending: true })

    if (bookingsData) {
      const formattedBookings = bookingsData.map(b => ({
        id: b.id,
        roomId: b.room_id,
        roomName: b.room_name,
        guestName: b.guest_name,
        guestPhone: b.guest_phone,
        checkIn: b.check_in,
        checkOut: b.check_out,
        status: b.status as 'confirmed' | 'completed' | 'cancelled'
      }))
      setBookings(formattedBookings)
    }

    // Load rooms from Supabase
    const { data: roomsData } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true })

    if (roomsData) {
      const formattedRooms = roomsData.map(r => ({
        id: r.id,
        name: r.name,
        roomNumber: r.room_number,
        price: r.price,
        capacity: r.capacity,
        description: r.description || ''
      }))
      setRooms(formattedRooms)
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

  // 예약 취소 함수
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('정말 이 예약을 취소하시겠습니까?')) {
      return
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    if (error) {
      console.error('Error cancelling booking:', error)
      alert('예약 취소에 실패했습니다.')
      return
    }

    alert('예약이 취소되었습니다.')
    loadData() // Reload data
  }

  // 숙박일수 계산
  const calculateNights = (checkIn: string, checkOut: string): number => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // 예약 총 금액 계산
  const calculateBookingPrice = (booking: Booking): number => {
    const room = rooms.find(r => r.id === booking.roomId)
    if (!room) return 0
    
    const nights = calculateNights(booking.checkIn, booking.checkOut)
    return room.price * nights
  }

  // 월별 매출 계산
  const calculateMonthlyRevenue = () => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    
    // 시간 정보 제거
    monthStart.setHours(0, 0, 0, 0)
    monthEnd.setHours(23, 59, 59, 999)

    return bookings
      .filter(booking => {
        if (booking.status !== 'confirmed') return false
        const checkIn = new Date(booking.checkIn)
        checkIn.setHours(0, 0, 0, 0)
        return checkIn >= monthStart && checkIn <= monthEnd
      })
      .reduce((total, booking) => {
        return total + calculateBookingPrice(booking)
      }, 0)
  }

  // 월별 예약 건수
  const getMonthlyBookingCount = () => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    
    // 시간 정보 제거
    monthStart.setHours(0, 0, 0, 0)
    monthEnd.setHours(23, 59, 59, 999)

    return bookings.filter(booking => {
      if (booking.status !== 'confirmed') return false
      const checkIn = new Date(booking.checkIn)
      checkIn.setHours(0, 0, 0, 0)
      return checkIn >= monthStart && checkIn <= monthEnd
    }).length
  }

  const isDateBooked = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return bookings.some(booking => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      const currentDate = new Date(dateStr)
      return currentDate >= checkIn && currentDate <= checkOut && booking.status === 'confirmed'
    })
  }

  const getBookingForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return bookings.find(booking => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      const currentDate = new Date(dateStr)
      return currentDate >= checkIn && currentDate <= checkOut && booking.status === 'confirmed'
    })
  }

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  const monthlyRevenue = calculateMonthlyRevenue()
  const monthlyBookings = getMonthlyBookingCount()

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>)
  }

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
        {/* Monthly Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">{year}년 {monthNames[month]} 매출</p>
                <p className="text-3xl font-bold mt-2">{monthlyRevenue.toLocaleString()}원</p>
                <p className="text-green-100 text-xs mt-1">체크인 기준</p>
              </div>
              <div className="bg-white/20 p-4 rounded-full">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">{year}년 {monthNames[month]} 예약 건수</p>
                <p className="text-3xl font-bold mt-2">{monthlyBookings}건</p>
                <p className="text-blue-100 text-xs mt-1">확정된 예약만 포함</p>
              </div>
              <div className="bg-white/20 p-4 rounded-full">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

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

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-6">{year}년 {monthNames[month]} 예약 목록</h3>
          
          {(() => {
            const monthStart = new Date(year, month, 1)
            const monthEnd = new Date(year, month + 1, 0)
            monthStart.setHours(0, 0, 0, 0)
            monthEnd.setHours(23, 59, 59, 999)
            
            const monthlyConfirmedBookings = bookings.filter(b => {
              if (b.status !== 'confirmed') return false
              const checkIn = new Date(b.checkIn)
              checkIn.setHours(0, 0, 0, 0)
              return checkIn >= monthStart && checkIn <= monthEnd
            })
            
            return monthlyConfirmedBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {year}년 {monthNames[month]}에 예약 내역이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyConfirmedBookings
                  .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
                  .map((booking) => {
                    const nights = calculateNights(booking.checkIn, booking.checkOut)
                    const totalPrice = calculateBookingPrice(booking)
                    
                    return (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-xl font-bold text-gray-900">{booking.roomName}</h4>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                예약확정
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-semibold">예약자:</span> {booking.guestName} ({booking.guestPhone})
                              </p>
                              <p>
                                <span className="font-semibold">체크인:</span> {booking.checkIn} → <span className="font-semibold">체크아웃:</span> {booking.checkOut}
                              </p>
                              <p>
                                <span className="font-semibold">숙박일수:</span> {nights}박
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600 mb-3">
                              {totalPrice.toLocaleString()}원
                            </p>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>예약 취소</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )
          })()}
        </div>

        {/* Cancelled Bookings */}
        {(() => {
          const monthStart = new Date(year, month, 1)
          const monthEnd = new Date(year, month + 1, 0)
          monthStart.setHours(0, 0, 0, 0)
          monthEnd.setHours(23, 59, 59, 999)
          
          const monthlyCancelledBookings = bookings.filter(b => {
            if (b.status !== 'cancelled') return false
            const checkIn = new Date(b.checkIn)
            checkIn.setHours(0, 0, 0, 0)
            return checkIn >= monthStart && checkIn <= monthEnd
          })
          
          return monthlyCancelledBookings.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-2xl font-bold mb-6 text-gray-600">{year}년 {monthNames[month]} 취소된 예약</h3>
              <div className="space-y-4">
                {monthlyCancelledBookings
                  .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())
                  .map((booking) => {
                    const nights = calculateNights(booking.checkIn, booking.checkOut)
                    const totalPrice = calculateBookingPrice(booking)
                    
                    return (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-700">{booking.roomName}</h4>
                              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                예약취소
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              예약자: {booking.guestName} | 체크인: {booking.checkIn} → 체크아웃: {booking.checkOut} | {nights}박
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-500 line-through">
                              {totalPrice.toLocaleString()}원
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
