'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react'
import { supabase, RoomAmenity } from '@/lib/supabase'

const categoryLabels = {
  structure: '방 구조',
  building: '건물 유형 및 면적',
  facility: '엘리베이터 및 주차',
  basic: '기본 옵션',
  additional: '추가 옵션'
}

const categoryOrder = ['structure', 'building', 'facility', 'basic', 'additional']

export default function AdminAmenities() {
  const [amenities, setAmenities] = useState<RoomAmenity[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingAmenity, setEditingAmenity] = useState<RoomAmenity | null>(null)
  const [formData, setFormData] = useState({
    category: 'basic' as 'structure' | 'building' | 'facility' | 'basic' | 'additional',
    icon: '',
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadAmenities()
  }, [])

  const loadAmenities = async () => {
    const { data, error } = await supabase
      .from('room_amenities')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error loading amenities:', error)
      alert('시설 목록을 불러오는데 실패했습니다.')
    } else {
      setAmenities(data || [])
    }
  }

  const handleAddAmenity = async () => {
    if (!formData.icon || !formData.name) {
      alert('아이콘과 이름은 필수 항목입니다.')
      return
    }

    setLoading(true)

    const categoryAmenities = amenities.filter(a => a.category === formData.category)
    const maxOrder = categoryAmenities.length > 0 
      ? Math.max(...categoryAmenities.map(a => a.display_order)) 
      : 0

    const { error } = await supabase
      .from('room_amenities')
      .insert([
        {
          category: formData.category,
          icon: formData.icon,
          name: formData.name,
          description: formData.description || null,
          display_order: maxOrder + 1,
          is_active: true
        }
      ])

    setLoading(false)

    if (error) {
      console.error('Error adding amenity:', error)
      alert('시설 등록에 실패했습니다.')
    } else {
      alert('시설이 등록되었습니다!')
      loadAmenities()
      resetForm()
    }
  }

  const handleEditAmenity = (amenity: RoomAmenity) => {
    setEditingAmenity(amenity)
    setFormData({
      category: amenity.category,
      icon: amenity.icon,
      name: amenity.name,
      description: amenity.description || ''
    })
    setIsEditing(true)
  }

  const handleUpdateAmenity = async () => {
    if (!editingAmenity) return

    setLoading(true)

    const { error } = await supabase
      .from('room_amenities')
      .update({
        category: formData.category,
        icon: formData.icon,
        name: formData.name,
        description: formData.description || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingAmenity.id)

    setLoading(false)

    if (error) {
      console.error('Error updating amenity:', error)
      alert('시설 수정에 실패했습니다.')
    } else {
      alert('시설이 수정되었습니다!')
      loadAmenities()
      resetForm()
    }
  }

  const handleDeleteAmenity = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    setLoading(true)

    const { error} = await supabase
      .from('room_amenities')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (error) {
      console.error('Error deleting amenity:', error)
      alert('시설 삭제에 실패했습니다.')
    } else {
      alert('시설이 삭제되었습니다!')
      loadAmenities()
    }
  }

  const handleToggleActive = async (amenity: RoomAmenity) => {
    const { error } = await supabase
      .from('room_amenities')
      .update({ is_active: !amenity.is_active })
      .eq('id', amenity.id)

    if (error) {
      console.error('Error toggling amenity:', error)
      alert('상태 변경에 실패했습니다.')
    } else {
      loadAmenities()
    }
  }

  const handleMoveUp = async (amenity: RoomAmenity) => {
    const categoryAmenities = amenities.filter(a => a.category === amenity.category)
    const index = categoryAmenities.findIndex(a => a.id === amenity.id)
    
    if (index === 0) return

    const prevAmenity = categoryAmenities[index - 1]
    
    await supabase
      .from('room_amenities')
      .update({ display_order: prevAmenity.display_order })
      .eq('id', amenity.id)

    await supabase
      .from('room_amenities')
      .update({ display_order: amenity.display_order })
      .eq('id', prevAmenity.id)

    loadAmenities()
  }

  const handleMoveDown = async (amenity: RoomAmenity) => {
    const categoryAmenities = amenities.filter(a => a.category === amenity.category)
    const index = categoryAmenities.findIndex(a => a.id === amenity.id)
    
    if (index === categoryAmenities.length - 1) return

    const nextAmenity = categoryAmenities[index + 1]
    
    await supabase
      .from('room_amenities')
      .update({ display_order: nextAmenity.display_order })
      .eq('id', amenity.id)

    await supabase
      .from('room_amenities')
      .update({ display_order: amenity.display_order })
      .eq('id', nextAmenity.id)

    loadAmenities()
  }

  const resetForm = () => {
    setFormData({
      category: 'basic',
      icon: '',
      name: '',
      description: ''
    })
    setIsEditing(false)
    setEditingAmenity(null)
  }

  const filteredAmenities = selectedCategory === 'all' 
    ? amenities 
    : amenities.filter(a => a.category === selectedCategory)

  const groupedAmenities = categoryOrder.reduce((acc, category) => {
    acc[category] = filteredAmenities.filter(a => a.category === category)
    return acc
  }, {} as Record<string, RoomAmenity[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 시설 관리</span>
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
            {isEditing ? '시설 수정' : '시설 등록'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="structure">방 구조</option>
                <option value="building">건물 유형 및 면적</option>
                <option value="facility">엘리베이터 및 주차</option>
                <option value="basic">기본 옵션</option>
                <option value="additional">추가 옵션</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이콘 (이모지) *
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-3xl text-center"
                placeholder="🛏️"
                maxLength={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 냉장고"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명 (선택)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 있음, 3개, 무료"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {isEditing && (
              <button
                onClick={resetForm}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                disabled={loading}
              >
                <X className="w-5 h-5" />
                <span>취소</span>
              </button>
            )}
            <button
              onClick={isEditing ? handleUpdateAmenity : handleAddAmenity}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              disabled={loading}
            >
              <Save className="w-5 h-5" />
              <span>{loading ? '처리중...' : isEditing ? '수정' : '등록'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">카테고리 필터</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categoryOrder.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoryLabels[category as keyof typeof categoryLabels]}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities List */}
        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const categoryAmenities = groupedAmenities[category]
            if (categoryAmenities.length === 0 && selectedCategory !== 'all' && selectedCategory !== category) {
              return null
            }

            return (
              <div key={category} className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                  <span className="text-gray-400 text-lg ml-2">
                    ({categoryAmenities.length}개)
                  </span>
                </h2>
                
                {categoryAmenities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    등록된 시설이 없습니다.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryAmenities.map((amenity, index) => (
                      <div
                        key={amenity.id}
                        className={`border border-gray-200 rounded-lg p-4 transition ${
                          amenity.is_active ? 'bg-white' : 'bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="text-3xl">{amenity.icon}</div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900">{amenity.name}</h3>
                              {amenity.description && (
                                <p className="text-gray-600 text-sm">{amenity.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {/* 순서 변경 */}
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => handleMoveUp(amenity)}
                                disabled={index === 0}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                                title="위로 이동"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMoveDown(amenity)}
                                disabled={index === categoryAmenities.length - 1}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                                title="아래로 이동"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                            </div>

                            {/* 활성화/비활성화 */}
                            <button
                              onClick={() => handleToggleActive(amenity)}
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                amenity.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {amenity.is_active ? '활성' : '비활성'}
                            </button>

                            {/* 수정 */}
                            <button
                              onClick={() => handleEditAmenity(amenity)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              disabled={loading}
                              title="수정"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>

                            {/* 삭제 */}
                            <button
                              onClick={() => handleDeleteAmenity(amenity.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              disabled={loading}
                              title="삭제"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 사용 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>방 구조</strong>: 방, 화장실, 주방, 거실 등</li>
            <li>• <strong>건물 유형 및 면적</strong>: 아파트, 평수 등</li>
            <li>• <strong>엘리베이터 및 주차</strong>: 엘리베이터, 주차 정보</li>
            <li>• <strong>기본 옵션</strong>: 냉장고, 세탁기, 에어컨, TV 등</li>
            <li>• <strong>추가 옵션</strong>: 도어락, CCTV, 식탁, 전자레인지 등</li>
            <li>• 위/아래 화살표로 각 카테고리 내 순서를 변경할 수 있습니다</li>
            <li>• 비활성화된 시설은 메인 페이지에 표시되지 않습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
