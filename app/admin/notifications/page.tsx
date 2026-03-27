'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Bell, CheckCircle, Calendar, User, Phone, LogOut, RefreshCw } from 'lucide-react'
import { supabase, Booking } from '@/lib/supabase'

export default function AdminNotifications() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // 관리자 로그인 확인
    const loggedIn = localStorage.getItem('admin_logged_in')
    if (!loggedIn) {
      router.push('/admin/login')
      return
    }

    // 알림음 준비
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE')
    }

    loadBookings()

    // 10초마다 새 예약 확인
    const interval = setInterval(() => {
      checkNewBookings()
    }, 10000)

    return () => clearInterval(interval)
  }, [router])

  const loadBookings = async () => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error loading bookings:', error)
    } else if (data) {
      const formattedBookings = data.map(b => ({
        id: b.id,
        roomId: b.room_id,
        roomName: b.room_name,
        guestName: b.guest_name,
        guestPhone: b.guest_phone,
        checkIn: b.check_in,
        checkOut: b.check_out,
        status: b.status as 'confirmed' | 'completed' | 'cancelled',
        createdAt: b.created_at
      }))
      setBookings(formattedBookings)
      
      // 읽지 않은 예약 수 계산 (마지막 확인 시간 이후)
      const unread = formattedBookings.filter(b => 
        new Date(b.createdAt || '') > lastCheckTime && b.status === 'confirmed'
      ).length
      setUnreadCount(unread)
    }

    setLoading(false)
  }

  const checkNewBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('created_at', lastCheckTime.toISOString())
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      // 새 예약이 있으면 알림
      const newBookings = data.filter(b => 
        new Date(b.created_at) > lastCheckTime
      )

      if (newBookings.length > 0) {
        // 소리 알림
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log('Audio play failed:', e))
        }

        // 브라우저 알림
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('새 예약이 도착했습니다!', {
            body: `${newBookings[0].guest_name}님의 예약 (${newBookings.length}건)`,
            icon: '/favicon.ico'
          })
        }

        // 목록 새로고침
        loadBookings()
      }
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        alert('알림 권한이 허용되었습니다!')
      }
    }
  }

  const handleMarkAllRead = () => {
    setLastCheckTime(new Date())
    setUnreadCount(0)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_id')
    router.push('/admin/login')
  }

  const getTimeAgo = (dateStr: string | undefined) => {
    if (!dateStr) return '알 수 없음'
    
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}시간 전`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}일 전`
  }

  const isNew = (dateStr: string | undefined) => {
    if (!dateStr) return false
    return new Date(dateStr) > lastCheckTime
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">예약 알림</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">모두 읽음</span>
                </button>
              )}
              
              <button
                onClick={loadBookings}
                disabled={loading}
                className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                title="새로고침"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-12 h-12 text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">예약 알림</h1>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount}개의 새로운 예약` : '모든 예약 확인 완료'}
                </p>
              </div>
            </div>

            <button
              onClick={requestNotificationPermission}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
            >
              알림 권한 허용
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 알림 사용 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 10초마다 자동으로 새 예약을 확인합니다</li>
            <li>• 새 예약이 오면 소리와 알림으로 알려드립니다</li>
            <li>• "알림 권한 허용" 버튼을 클릭하여 브라우저 알림을 활성화하세요</li>
            <li>• 이 페이지를 열어두면 실시간으로 예약을 확인할 수 있습니다</li>
            <li>• 모바일에서도 접속하여 사용 가능합니다</li>
          </ul>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">아직 예약이 없습니다</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className={`bg-white rounded-xl shadow-lg p-6 transition ${
                  isNew(booking.createdAt)
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {isNew(booking.createdAt) && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                          NEW
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status === 'confirmed' ? '예약확정' : 
                         booking.status === 'cancelled' ? '취소됨' : '완료'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {getTimeAgo(booking.createdAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">예약자</span>
                          <p className="font-bold text-gray-900">{booking.guestName}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">연락처</span>
                          <p className="font-bold text-gray-900">{booking.guestPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">체크인</span>
                          <p className="font-bold text-gray-900">
                            {new Date(booking.checkIn).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">체크아웃</span>
                          <p className="font-bold text-gray-900">
                            {new Date(booking.checkOut).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <span className="text-sm text-gray-600">객실: </span>
                      <span className="font-medium text-gray-900">{booking.roomName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
