'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react'
import { supabase, Feature } from '@/lib/supabase'

export default function AdminFeatures() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFeatures()
  }, [])

  const loadFeatures = async () => {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error loading features:', error)
      alert('특징 목록을 불러오는데 실패했습니다.')
    } else {
      setFeatures(data || [])
    }
  }

  const handleAddFeature = async () => {
    if (!formData.icon || !formData.title || !formData.description) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    setLoading(true)

    const maxOrder = features.length > 0 ? Math.max(...features.map(f => f.display_order)) : 0

    const { error } = await supabase
      .from('features')
      .insert([
        {
          icon: formData.icon,
          title: formData.title,
          description: formData.description,
          display_order: maxOrder + 1,
          is_active: true
        }
      ])

    setLoading(false)

    if (error) {
      console.error('Error adding feature:', error)
      alert('특징 등록에 실패했습니다.')
    } else {
      alert('특징이 등록되었습니다!')
      loadFeatures()
      resetForm()
    }
  }

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature)
    setFormData({
      icon: feature.icon,
      title: feature.title,
      description: feature.description
    })
    setIsEditing(true)
  }

  const handleUpdateFeature = async () => {
    if (!editingFeature) return

    setLoading(true)

    const { error } = await supabase
      .from('features')
      .update({
        icon: formData.icon,
        title: formData.title,
        description: formData.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingFeature.id)

    setLoading(false)

    if (error) {
      console.error('Error updating feature:', error)
      alert('특징 수정에 실패했습니다.')
    } else {
      alert('특징이 수정되었습니다!')
      loadFeatures()
      resetForm()
    }
  }

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (error) {
      console.error('Error deleting feature:', error)
      alert('특징 삭제에 실패했습니다.')
    } else {
      alert('특징이 삭제되었습니다!')
      loadFeatures()
    }
  }

  const handleToggleActive = async (feature: Feature) => {
    const { error } = await supabase
      .from('features')
      .update({ is_active: !feature.is_active })
      .eq('id', feature.id)

    if (error) {
      console.error('Error toggling feature:', error)
      alert('상태 변경에 실패했습니다.')
    } else {
      loadFeatures()
    }
  }

  const handleMoveUp = async (feature: Feature, index: number) => {
    if (index === 0) return

    const prevFeature = features[index - 1]
    
    await supabase
      .from('features')
      .update({ display_order: prevFeature.display_order })
      .eq('id', feature.id)

    await supabase
      .from('features')
      .update({ display_order: feature.display_order })
      .eq('id', prevFeature.id)

    loadFeatures()
  }

  const handleMoveDown = async (feature: Feature, index: number) => {
    if (index === features.length - 1) return

    const nextFeature = features[index + 1]
    
    await supabase
      .from('features')
      .update({ display_order: nextFeature.display_order })
      .eq('id', feature.id)

    await supabase
      .from('features')
      .update({ display_order: feature.display_order })
      .eq('id', nextFeature.id)

    loadFeatures()
  }

  const resetForm = () => {
    setFormData({
      icon: '',
      title: '',
      description: ''
    })
    setIsEditing(false)
    setEditingFeature(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 아파트 특징 관리</span>
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
            {isEditing ? '특징 수정' : '특징 등록'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이콘 (이모지) *
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-3xl text-center"
                placeholder="🏖️"
                maxLength={2}
              />
              <p className="text-xs text-gray-500 mt-1">Windows: Win + . | Mac: Cmd + Ctrl + Space</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 바다 근처"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명 *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 속초 해변까지 도보 10분"
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
              onClick={isEditing ? handleUpdateFeature : handleAddFeature}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              disabled={loading}
            >
              <Save className="w-5 h-5" />
              <span>{loading ? '처리중...' : isEditing ? '수정' : '등록'}</span>
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">등록된 특징 목록</h2>
          
          {features.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 특징이 없습니다. 위에서 특징을 등록해주세요.
            </div>
          ) : (
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`border border-gray-200 rounded-lg p-6 transition ${
                    feature.is_active ? 'bg-white' : 'bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="text-5xl">{feature.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* 순서 변경 */}
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleMoveUp(feature, index)}
                          disabled={index === 0}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(feature, index)}
                          disabled={index === features.length - 1}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 활성화/비활성화 */}
                      <button
                        onClick={() => handleToggleActive(feature)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          feature.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {feature.is_active ? '활성' : '비활성'}
                      </button>

                      {/* 수정 */}
                      <button
                        onClick={() => handleEditFeature(feature)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        disabled={loading}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      {/* 삭제 */}
                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        disabled={loading}
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

        {/* 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 사용 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 아이콘은 이모지를 사용하세요 (Windows: Win+. | Mac: Cmd+Ctrl+Space)</li>
            <li>• 위/아래 화살표로 표시 순서를 변경할 수 있습니다</li>
            <li>• "활성/비활성" 버튼으로 메인 페이지 표시 여부를 조절할 수 있습니다</li>
            <li>• 비활성화된 특징은 메인 페이지에 표시되지 않습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
