'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { supabase, Room, DatePricing } from '@/lib/supabase'

export default function AdminPricing() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [datePricing, setDatePricing] = useState<DatePricing[]>([])
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      loadDatePricing()
    }
  }, [selectedRoom, currentDate])

  const loadRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading rooms:', error)
    } else {
      setRooms(data || [])
      if (data && data.length > 0) {
        setSelectedRoom(data[0])
      }
    }
  }

  const loadDatePricing = async () => {
    if (!selectedRoom) return

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const { data, error } = await supabase
      .from('date_pricing')
      .select('*')
      .eq('room_id', selectedRoom.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .eq('is_active', true)

    if (error) {
      console.error('Error loading date pricing:', error)
    } else {
      setDatePricing(data || [])
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startingDayOfWeek = new Date(year, month, 1).getDay()
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getPriceForDate = (dateStr: string): number | null => {
    const pricing = datePricing.find(p => p.date === dateStr)
    return pricing ? pricing.price : null
  }

  const handleSetPrice = async (dateStr: string, price: number) => {
    if (!selectedRoom || price <= 0) return

    setLoading(true)

    // 기존 가격 확인
    const existing = datePricing.find(p => p.date === dateStr)

    if (existing) {
      // 업데이트
      const { error } = await supabase
        .from('date_pricing')
        .update({ price, updated_at: new Date().toISOString() })
        .eq('id', existing.id)

      if (error) {
        console.error('Error updating price:', error)
        alert('가격 수정에 실패했습니다.')
      } else {
        alert('가격이 수정되었습니다!')
        loadDatePricing()
      }
    } else {
      // 새로 추가
      const { error } = await supabase
        .from('date_pricing')
        .insert([{
          room_id: selectedRoom.id,
          date: dateStr,
          price,
          is_active: true
        }])

      if (error) {
        console.error('Error adding price:', error)
        alert('가격 설정에 실패했습니다.')
      } else {
        alert('가격이 설정되었습니다!')
        loadDatePricing()
      }
    }

    setEditingDate(null)
    setEditPrice('')
    setLoading(false)
  }

  const handleDeletePrice = async (dateStr: string) => {
    if (!confirm('이 날짜의 가격 설정을 삭제하시겠습니까?')) return

    const pricing = datePricing.find(p => p.date === dateStr)
    if (!pricing) return

    setLoading(true)

    const { error } = await supabase
      .from('date_pricing')
      .delete()
      .eq('id', pricing.id)

    setLoading(false)

    if (error) {
      console.error('Error deleting price:', error)
      alert('삭제에 실패했습니다.')
    } else {
      alert('가격 설정이 삭제되었습니다!')
      loadDatePricing()
    }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 일자별 가격 설정</span>
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
        {/* Room Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">객실 선택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`p-4 border-2 rounded-lg transition ${
                  selectedRoom?.id === room.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-bold text-lg">{room.name}</div>
                <div className="text-sm text-gray-600">{room.room_number}</div>
                <div className="text-blue-600 font-semibold mt-2">
                  기본가: {room.price.toLocaleString()}원/박
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedRoom && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold">
                {year}년 {month + 1}월 - {selectedRoom.name}
              </h2>
              
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div
                  key={day}
                  className={`text-center font-bold py-2 ${
                    index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const customPrice = getPriceForDate(dateStr)
                const isEditing = editingDate === dateStr
                const dayOfWeek = (startingDayOfWeek + index) % 7
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                return (
                  <div
                    key={day}
                    className={`aspect-square border rounded-lg p-2 transition ${
                      isWeekend ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    <div className={`text-sm font-semibold ${
                      dayOfWeek === 0 ? 'text-red-600' : dayOfWeek === 6 ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {day}
                    </div>

                    {isEditing ? (
                      <div className="mt-1">
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-full text-xs px-1 py-1 border rounded"
                          placeholder="가격"
                          autoFocus
                        />
                        <div className="flex space-x-1 mt-1">
                          <button
                            onClick={() => handleSetPrice(dateStr, parseInt(editPrice))}
                            disabled={loading || !editPrice}
                            className="flex-1 text-xs bg-blue-600 text-white px-1 py-1 rounded hover:bg-blue-700 disabled:bg-gray-300"
                          >
                            <Save className="w-3 h-3 mx-auto" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingDate(null)
                              setEditPrice('')
                            }}
                            className="flex-1 text-xs bg-gray-500 text-white px-1 py-1 rounded hover:bg-gray-600"
                          >
                            <X className="w-3 h-3 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1">
                        {customPrice ? (
                          <>
                            <div className="text-xs font-bold text-blue-600">
                              {customPrice.toLocaleString()}원
                            </div>
                            <div className="flex space-x-1 mt-1">
                              <button
                                onClick={() => {
                                  setEditingDate(dateStr)
                                  setEditPrice(customPrice.toString())
                                }}
                                disabled={loading}
                                className="flex-1 text-xs bg-gray-100 text-gray-700 px-1 py-1 rounded hover:bg-gray-200"
                                title="수정"
                              >
                                <Edit2 className="w-3 h-3 mx-auto" />
                              </button>
                              <button
                                onClick={() => handleDeletePrice(dateStr)}
                                disabled={loading}
                                className="flex-1 text-xs bg-red-100 text-red-700 px-1 py-1 rounded hover:bg-red-200"
                                title="삭제"
                              >
                                <Trash2 className="w-3 h-3 mx-auto" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-xs text-gray-500">
                              {selectedRoom.price.toLocaleString()}원
                            </div>
                            <button
                              onClick={() => {
                                setEditingDate(dateStr)
                                setEditPrice(selectedRoom.price.toString())
                              }}
                              disabled={loading}
                              className="w-full mt-1 text-xs bg-green-100 text-green-700 px-1 py-1 rounded hover:bg-green-200 flex items-center justify-center"
                              title="가격 설정"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">💡 사용 안내</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <span className="font-semibold">기본가</span> (회색): 객실에 설정된 기본 가격</li>
                <li>• <span className="font-semibold text-blue-600">특별가</span> (파란색): 해당 날짜에 설정된 특별 가격</li>
                <li>• <span className="bg-blue-50 px-2 py-1 rounded">주말</span>은 파란색 배경으로 표시</li>
                <li>• ➕ 버튼을 클릭하여 날짜별 가격을 설정할 수 있습니다</li>
                <li>• 설정된 가격은 게스트 예약 페이지의 캘린더에 표시됩니다</li>
              </ul>
            </div>
          </div>
        )}

        {rooms.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>등록된 객실이 없습니다.</p>
            <Link
              href="/admin/rooms"
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              객실 등록하러 가기 →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
