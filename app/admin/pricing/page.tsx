'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Save, X, Check, Tag } from 'lucide-react'
import { supabase, Room, DatePricing, PricePreset } from '@/lib/supabase'

export default function AdminPricing() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [datePricing, setDatePricing] = useState<DatePricing[]>([])
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [loading, setLoading] = useState(false)
  
  // 프리셋 관련 상태
  const [presets, setPresets] = useState<PricePreset[]>([])
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [showPresetManager, setShowPresetManager] = useState(false)
  const [editingPreset, setEditingPreset] = useState<PricePreset | null>(null)
  const [presetForm, setPresetForm] = useState({ name: '', price: '', color: '#3b82f6' })

  useEffect(() => {
    loadRooms()
    loadPresets()
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

  const loadPresets = async () => {
    const { data, error } = await supabase
      .from('price_presets')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error loading presets:', error)
    } else {
      setPresets(data || [])
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
    setSelectedDates([])
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDates([])
  }

  const getPriceForDate = (dateStr: string): number | null => {
    const pricing = datePricing.find(p => p.date === dateStr)
    return pricing ? pricing.price : null
  }

  // 날짜 선택/해제
  const toggleDateSelection = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr))
    } else {
      setSelectedDates([...selectedDates, dateStr])
    }
  }

  // 프리셋 적용
  const applyPresetToSelected = async (preset: PricePreset) => {
    if (!selectedRoom || selectedDates.length === 0) {
      alert('날짜를 선택해주세요.')
      return
    }

    if (!confirm(`선택한 ${selectedDates.length}개 날짜에 "${preset.name}" 가격(${preset.price.toLocaleString()}원)을 적용하시겠습니까?`)) {
      return
    }

    setLoading(true)

    for (const dateStr of selectedDates) {
      const existing = datePricing.find(p => p.date === dateStr)

      if (existing) {
        await supabase
          .from('date_pricing')
          .update({ price: preset.price, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('date_pricing')
          .insert([{
            room_id: selectedRoom.id,
            date: dateStr,
            price: preset.price,
            is_active: true
          }])
      }
    }

    setLoading(false)
    alert(`${selectedDates.length}개 날짜에 가격이 적용되었습니다!`)
    setSelectedDates([])
    loadDatePricing()
  }

  // 프리셋 추가/수정
  const handleSavePreset = async () => {
    if (!presetForm.name || !presetForm.price) {
      alert('프리셋 이름과 가격을 입력해주세요.')
      return
    }

    setLoading(true)

    if (editingPreset) {
      // 수정
      const { error } = await supabase
        .from('price_presets')
        .update({
          name: presetForm.name,
          price: parseInt(presetForm.price),
          color: presetForm.color,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPreset.id)

      if (error) {
        console.error('Error updating preset:', error)
        alert('프리셋 수정에 실패했습니다.')
      } else {
        alert('프리셋이 수정되었습니다!')
        resetPresetForm()
        loadPresets()
      }
    } else {
      // 추가
      const { error } = await supabase
        .from('price_presets')
        .insert([{
          name: presetForm.name,
          price: parseInt(presetForm.price),
          color: presetForm.color,
          display_order: presets.length + 1,
          is_active: true
        }])

      if (error) {
        console.error('Error adding preset:', error)
        alert('프리셋 추가에 실패했습니다.')
      } else {
        alert('프리셋이 추가되었습니다!')
        resetPresetForm()
        loadPresets()
      }
    }

    setLoading(false)
  }

  const handleDeletePreset = async (id: string) => {
    if (!confirm('이 프리셋을 삭제하시겠습니까?')) return

    setLoading(true)

    const { error } = await supabase
      .from('price_presets')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (error) {
      console.error('Error deleting preset:', error)
      alert('삭제에 실패했습니다.')
    } else {
      alert('프리셋이 삭제되었습니다!')
      loadPresets()
    }
  }

  const resetPresetForm = () => {
    setPresetForm({ name: '', price: '', color: '#3b82f6' })
    setEditingPreset(null)
    setShowPresetManager(false)
  }

  const handleSetPrice = async (dateStr: string, price: number) => {
    if (!selectedRoom || price <= 0) return

    setLoading(true)

    const existing = datePricing.find(p => p.date === dateStr)

    if (existing) {
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
          <>
            {/* 가격 프리셋 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center">
                  <Tag className="w-6 h-6 mr-2" />
                  가격 프리셋
                </h2>
                <button
                  onClick={() => setShowPresetManager(!showPresetManager)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>프리셋 관리</span>
                </button>
              </div>

              {showPresetManager && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-3">
                    {editingPreset ? '프리셋 수정' : '새 프리셋 추가'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      value={presetForm.name}
                      onChange={(e) => setPresetForm({ ...presetForm, name: e.target.value })}
                      placeholder="프리셋 이름 (예: 성수기)"
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={presetForm.price}
                      onChange={(e) => setPresetForm({ ...presetForm, price: e.target.value })}
                      placeholder="가격 (예: 250000)"
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="color"
                      value={presetForm.color}
                      onChange={(e) => setPresetForm({ ...presetForm, color: e.target.value })}
                      className="px-3 py-2 border rounded-lg h-full"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSavePreset}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                      >
                        {editingPreset ? '수정' : '추가'}
                      </button>
                      {editingPreset && (
                        <button
                          onClick={resetPresetForm}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                          취소
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-2">
                  💡 캘린더에서 날짜를 선택한 후, 아래 프리셋 버튼을 클릭하면 한번에 가격이 적용됩니다.
                  {selectedDates.length > 0 && (
                    <span className="ml-2 font-bold text-blue-600">
                      (현재 {selectedDates.length}개 날짜 선택됨)
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {presets.map(preset => (
                    <div key={preset.id} className="relative">
                      <button
                        onClick={() => applyPresetToSelected(preset)}
                        disabled={loading || selectedDates.length === 0}
                        className="w-full p-4 rounded-lg border-2 transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          borderColor: preset.color,
                          backgroundColor: `${preset.color}10`
                        }}
                      >
                        <div className="font-bold text-lg" style={{ color: preset.color }}>
                          {preset.name}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          {preset.price.toLocaleString()}원
                        </div>
                      </button>
                      <div className="absolute top-1 right-1 flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingPreset(preset)
                            setPresetForm({
                              name: preset.name,
                              price: preset.price.toString(),
                              color: preset.color
                            })
                            setShowPresetManager(true)
                          }}
                          className="p-1 bg-white rounded shadow hover:bg-gray-100"
                          title="수정"
                        >
                          <Edit2 className="w-3 h-3 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-1 bg-white rounded shadow hover:bg-gray-100"
                          title="삭제"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDates.length > 0 && (
                <button
                  onClick={() => setSelectedDates([])}
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  선택 해제 ({selectedDates.length}개)
                </button>
              )}
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
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

              <div className="grid grid-cols-7 gap-2">
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

                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const customPrice = getPriceForDate(dateStr)
                  const isEditing = editingDate === dateStr
                  const isSelected = selectedDates.includes(dateStr)
                  const dayOfWeek = (startingDayOfWeek + index) % 7
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                  return (
                    <div
                      key={day}
                      onClick={() => !isEditing && toggleDateSelection(dateStr)}
                      className={`aspect-square border-2 rounded-lg p-2 transition cursor-pointer ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-100' 
                          : isWeekend 
                            ? 'bg-blue-50 border-gray-200' 
                            : 'bg-white border-gray-200'
                      } hover:border-blue-400`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`text-sm font-semibold ${
                          dayOfWeek === 0 ? 'text-red-600' : dayOfWeek === 6 ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {day}
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
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
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex space-x-1 mt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSetPrice(dateStr, parseInt(editPrice))
                              }}
                              disabled={loading || !editPrice}
                              className="flex-1 text-xs bg-blue-600 text-white px-1 py-1 rounded hover:bg-blue-700 disabled:bg-gray-300"
                            >
                              <Save className="w-3 h-3 mx-auto" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
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
                                  onClick={(e) => {
                                    e.stopPropagation()
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
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeletePrice(dateStr)
                                  }}
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
                                onClick={(e) => {
                                  e.stopPropagation()
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

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">💡 사용 안내</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <span className="font-semibold">캘린더에서 날짜 클릭</span>: 날짜를 선택/해제합니다</li>
                  <li>• <span className="font-semibold">프리셋 버튼 클릭</span>: 선택한 모든 날짜에 한번에 가격이 적용됩니다</li>
                  <li>• <span className="font-semibold">➕ 버튼</span>: 개별 날짜에 직접 가격을 입력할 수 있습니다</li>
                  <li>• <span className="font-semibold">프리셋 관리</span>: 자주 사용하는 가격을 프리셋으로 저장하여 재사용할 수 있습니다</li>
                  <li>• <span className="bg-blue-50 px-2 py-1 rounded">주말</span>은 파란색 배경으로 표시됩니다</li>
                </ul>
              </div>
            </div>
          </>
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
