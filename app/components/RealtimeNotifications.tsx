'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Notification {
  id: string
  title: string
  message: string
  bookingId?: string
  timestamp: number
}

export default function RealtimeNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)

  useEffect(() => {
    // 알림 권한 확인
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }

    // Supabase Realtime 구독
    const channel = supabase
      .channel('bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          const booking = payload.new as any
          
          // 알림 생성
          const notification: Notification = {
            id: booking.id,
            title: '새 예약 알림',
            message: `${booking.guest_name}님의 예약이 접수되었습니다.\n객실: ${booking.room_name}\n체크인: ${booking.check_in}`,
            bookingId: booking.id,
            timestamp: Date.now()
          }

          // 알림 목록에 추가
          setNotifications(prev => [notification, ...prev])

          // 브라우저 알림 표시
          if (permission === 'granted') {
            showBrowserNotification(notification)
          }

          // 소리 재생
          playNotificationSound()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [permission])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('이 브라우저는 알림을 지원하지 않습니다.')
      return
    }

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result === 'granted') {
      // 서비스 워커 푸시 구독
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        // TODO: 푸시 구독 로직 추가 (VAPID 키 필요)
      }
    }
  }

  const showBrowserNotification = (notification: Notification) => {
    if (permission !== 'granted') return

    const options: NotificationOptions = {
      body: notification.message,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: `booking-${notification.bookingId}`,
      requireInteraction: true,
      data: {
        url: '/admin/calendar',
        bookingId: notification.bookingId
      }
    }

    const n = new Notification(notification.title, options)

    n.onclick = () => {
      window.focus()
      window.location.href = '/admin/calendar'
      n.close()
    }
  }

  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizYIG2m98OScTgwOUqns77RgGAg1j9bxx3Yk')
      audio.volume = 0.3
      audio.play().catch(e => console.log('Audio play failed:', e))
    } catch (e) {
      console.log('Audio playback not supported')
    }
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="relative">
      {/* 알림 버튼 */}
      <button
        onClick={() => setShowNotificationCenter(!showNotificationCenter)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="알림"
      >
        {permission === 'granted' ? (
          <Bell className="w-6 h-6 text-gray-600" />
        ) : (
          <BellOff className="w-6 h-6 text-gray-400" />
        )}
        
        {/* 알림 배지 */}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {/* 알림 센터 */}
      {showNotificationCenter && (
        <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[500px] flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">알림</h3>
            <div className="flex items-center gap-2">
              {permission !== 'granted' && (
                <button
                  onClick={requestPermission}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  알림 켜기
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  모두 지우기
                </button>
              )}
              <button
                onClick={() => setShowNotificationCenter(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* 알림 목록 */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">새로운 알림이 없습니다</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors relative group"
                >
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                  
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(notification.timestamp).toLocaleString('ko-KR')}
                  </p>
                  
                  {notification.bookingId && (
                    <a
                      href="/admin/calendar"
                      className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      예약 확인하기 →
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 배경 클릭 시 닫기 */}
      {showNotificationCenter && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotificationCenter(false)}
        />
      )}
    </div>
  )
}
