'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Plus, Edit2, Trash2, Save, X, Calendar, Check } from 'lucide-react'
import { supabase, Room, DatePricing } from '@/lib/supabase'

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    price: '',
    weekdayPrice: '',
    weekendPrice: '',
    capacity: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  
  // 요일별 가격 설정 상태
  const [showBulkPricing, setShowBulkPricing] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([]) // 0=일, 1=월, ..., 6=토
  const [bulkPrice, setBulkPrice] = useState('')
  const [targetMonth, setTargetMonth] = useState(new Date())

  const weekDays = [
    { index: 0, name: '일', shortName: '일', color: 'text-red-600' },
    { index: 1, name: '월', shortName: '월', color: 'text-gray-700' },
    { index: 2, name: '화', shortName: '화', color: 'text-gray-700' },
    { index: 3, name: '수', shortName: '수', color: 'text-gray-700' },
    { index: 4, name: '목', shortName: '목', color: 'text-gray-700' },
    { index: 5, name: '금', shortName: '금', color: 'text-blue-600' },
    { index: 6, name: '토', shortName: '토', color: 'text-blue-600' }
  ]

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading rooms:', error)
      alert('객실 목록을 불러오는데 실패했습니다.')
    } else {
      setRooms(data || [])
    }
  }

  const handleAddRoom = async () => {
    if (!formData.name || !formData.roomNumber || !formData.price || !formData.capacity) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    setLoading(true)

    const basePrice = parseInt(formData.price)
    const weekdayPrice = formData.weekdayPrice ? parseInt(formData.weekdayPrice) : basePrice
    const weekendPrice = formData.weekendPrice ? parseInt(formData.weekendPrice) : Math.floor(basePrice * 1.2)

    const { data, error } = await supabase
      .from('rooms')
      .insert([
        {
          name: formData.name,
          room_number: formData.roomNumber,
          price: basePrice,
          weekday_price: weekdayPrice,
          weekend_price: weekendPrice,
          capacity: parseInt(formData.capacity),
          description: formData.description
        }
      ])
      .select()

    setLoading(false)

    if (error) {
      console.error('Error adding room:', error)
      alert('객실 등록에 실패했습니다.')
    } else {
      alert('객실이 등록되었습니다!')
      loadRooms()
      resetForm()
    }
  }

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setFormData({
      name: room.name,
      roomNumber: room.room_number,
      price: room.price.toString(),
      weekdayPrice: room.weekday_price?.toString() || room.price.toString(),
      weekendPrice: room.weekend_price?.toString() || Math.floor(room.price * 1.2).toString(),
      capacity: room.capacity.toString(),
      description: room.description || ''
    })
    setIsEditing(true)
    setShowBulkPricing(false)
  }

  const handleUpdateRoom = async () => {
    if (!editingRoom) return

    setLoading(true)

    const basePrice = parseInt(formData.price)
    const weekdayPrice = formData.weekdayPrice ? parseInt(formData.weekdayPrice) : basePrice
    const weekendPrice = formData.weekendPrice ? parseInt(formData.weekendPrice) : Math.floor(basePrice * 1.2)

    const { error } = await supabase
      .from('rooms')
      .update({
        name: formData.name,
        room_number: formData.roomNumber,
        price: basePrice,
        weekday_price: weekdayPrice,
        weekend_price: weekendPrice,
        capacity: parseInt(formData.capacity),
        description: formData.description
      })
      .eq('id', editingRoom.id)

    setLoading(false)

    if (error) {
      console.error('Error updating room:', error)
      alert('객실 수정에 실패했습니다.')
    } else {
      alert('객실이 수정되었습니다!')
      loadRooms()
      resetForm()
    }
  }

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (error) {
      console.error('Error deleting room:', error)
      alert('객실 삭제에 실패했습니다.')
    } else {
      alert('객실이 삭제되었습니다!')
      loadRooms()
    }
  }

  // 요일 선택/해제
  const toggleDaySelection = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex))
    } else {
      setSelectedDays([...selectedDays, dayIndex])
    }
  }

  // 선택한 요일에 가격 일괄 적용
  const applyBulkPricing = async () => {
    if (!editingRoom) {
      alert('먼저 객실을 선택해주세요.')
      return
    }

    if (selectedDays.length === 0) {
      alert('요일을 선택해주세요.')
      return
    }

    if (!bulkPrice || parseInt(bulkPrice) <= 0) {
      alert('가격을 입력해주세요.')
      return
    }

    const price = parseInt(bulkPrice)
    const year = targetMonth.getFullYear()
    const month = targetMonth.getMonth()

    // 해당 월의 모든 날짜 중에서 선택한 요일에 해당하는 날짜 찾기
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const targetDates: string[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      
      if (selectedDays.includes(dayOfWeek)) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        targetDates.push(dateStr)
      }
    }

    if (targetDates.length === 0) {
      alert('해당 월에 선택한 요일이 없습니다.')
      return
    }

    const dayNames = selectedDays.map(i => weekDays[i].name).join(', ')
    if (!confirm(`${year}년 ${month + 1}월의 모든 ${dayNames}요일 (${targetDates.length}일)에\n${price.toLocaleString()}원을 적용하시겠습니까?`)) {
      return
    }

    setLoading(true)

    // 각 날짜에 가격 적용
    for (const dateStr of targetDates) {
      // 기존 가격 확인
      const { data: existing } = await supabase
        .from('date_pricing')
        .select('*')
        .eq('room_id', editingRoom.id)
        .eq('date', dateStr)
        .eq('is_active', true)
        .single()

      if (existing) {
        // 업데이트
        await supabase
          .from('date_pricing')
          .update({ price, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        // 새로 추가
        await supabase
          .from('date_pricing')
          .insert([{
            room_id: editingRoom.id,
            date: dateStr,
            price,
            is_active: true
          }])
      }
    }

    setLoading(false)
    alert(`${targetDates.length}일에 가격이 적용되었습니다!`)
    
    // 초기화
    setSelectedDays([])
    setBulkPrice('')
  }

  const resetForm = () => {
    setFormData({
      name: '',
      roomNumber: '',
      price: '',
      weekdayPrice: '',
      weekendPrice: '',
      capacity: '',
      description: ''
    })
    setIsEditing(false)
    setEditingRoom(null)
    setShowBulkPricing(false)
    setSelectedDays([])
    setBulkPrice('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 객실 관리</span>
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
        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {isEditing ? '객실 수정' : '객실 등록'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                객실명 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 디럭스룸"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                호수 *
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 101호"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1박 가격 (원) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 150000"
              />
              <p className="text-xs text-gray-500 mt-1">기본 가격 (특별 가격 미설정 시)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주중 가격 (원) - 일, 월, 화, 수, 목
              </label>
              <input
                type="number"
                value={formData.weekdayPrice}
                onChange={(e) => setFormData({ ...formData, weekdayPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="미입력 시 기본 가격 적용"
              />
              <p className="text-xs text-gray-500 mt-1">일요일~목요일 가격</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주말 가격 (원) - 금, 토
              </label>
              <input
                type="number"
                value={formData.weekendPrice}
                onChange={(e) => setFormData({ ...formData, weekendPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="미입력 시 기본 가격 × 1.2"
              />
              <p className="text-xs text-gray-500 mt-1">금요일~토요일 가격</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수용 인원 *
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 4"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                객실 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="객실에 대한 상세 설명을 입력하세요"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {isEditing && (
              <>
                <button
                  onClick={() => setShowBulkPricing(!showBulkPricing)}
                  className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  disabled={loading}
                >
                  <Calendar className="w-5 h-5" />
                  <span>요일별 가격 설정</span>
                </button>
                <button
                  onClick={resetForm}
                  className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                  <span>취소</span>
                </button>
              </>
            )}
            <button
              onClick={isEditing ? handleUpdateRoom : handleAddRoom}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              disabled={loading}
            >
              <Save className="w-5 h-5" />
              <span>{loading ? '처리중...' : isEditing ? '수정' : '등록'}</span>
            </button>
          </div>
        </div>

        {/* 요일별 가격 설정 */}
        {isEditing && showBulkPricing && editingRoom && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-purple-200">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-purple-600" />
              요일별 일괄 가격 설정 - {editingRoom.name}
            </h3>
            
            <div className="space-y-4">
              {/* 월 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  적용할 월 선택
                </label>
                <input
                  type="month"
                  value={`${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split('-')
                    setTargetMonth(new Date(parseInt(year), parseInt(month) - 1, 1))
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* 요일 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  적용할 요일 선택 {selectedDays.length > 0 && `(${selectedDays.length}개 선택)`}
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => (
                    <button
                      key={day.index}
                      onClick={() => toggleDaySelection(day.index)}
                      className={`p-4 border-2 rounded-lg transition ${
                        selectedDays.includes(day.index)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`text-center font-bold ${day.color}`}>
                        {day.name}
                      </div>
                      {selectedDays.includes(day.index) && (
                        <Check className="w-5 h-5 mx-auto mt-2 text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 여러 요일을 선택하고 한번에 가격을 적용할 수 있습니다
                </p>
              </div>

              {/* 가격 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  적용할 가격 (원)
                </label>
                <input
                  type="number"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  placeholder="예: 200000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* 적용 버튼 */}
              <button
                onClick={applyBulkPricing}
                disabled={loading || selectedDays.length === 0 || !bulkPrice}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>
                  {loading 
                    ? '처리중...' 
                    : `${targetMonth.getFullYear()}년 ${targetMonth.getMonth() + 1}월의 선택한 요일에 가격 적용`
                  }
                </span>
              </button>

              {/* 사용 안내 */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">💡 사용 방법</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>1. 적용할 월을 선택합니다</li>
                  <li>2. 적용할 요일을 클릭하여 선택합니다 (여러 개 선택 가능)</li>
                  <li>3. 적용할 가격을 입력합니다</li>
                  <li>4. "가격 적용" 버튼을 클릭하면 선택한 요일에 한번에 가격이 적용됩니다</li>
                  <li className="text-purple-600 font-semibold">
                    예: 5월의 모든 금요일과 토요일을 선택하고 200,000원 입력 → 5월 금토요일 전체에 200,000원 적용!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Rooms List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">등록된 객실 목록</h2>
          
          {rooms.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 객실이 없습니다. 위에서 객실을 등록해주세요.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-600">{room.room_number}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        disabled={loading}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        disabled={loading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-blue-600">
                      {room.price.toLocaleString()}원<span className="text-sm text-gray-600">/박</span>
                    </p>
                    {room.weekday_price && (
                      <p className="text-sm text-green-600">
                        주중: {room.weekday_price.toLocaleString()}원
                      </p>
                    )}
                    {room.weekend_price && (
                      <p className="text-sm text-orange-600">
                        주말: {room.weekend_price.toLocaleString()}원
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      최대 인원: {room.capacity}명
                    </p>
                    {room.description && (
                      <p className="text-sm text-gray-600 mt-2">{room.description}</p>
                    )}
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
