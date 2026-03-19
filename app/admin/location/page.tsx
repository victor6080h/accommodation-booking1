'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, MapPin, Save, Eye } from 'lucide-react'
import { supabase, LocationInfo } from '@/lib/supabase'

export default function AdminLocation() {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    loadLocationInfo()
  }, [])

  const loadLocationInfo = async () => {
    const { data, error } = await supabase
      .from('location_info')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error loading location info:', error)
    } else if (data) {
      setLocationInfo(data as LocationInfo)
      setFormData({
        title: data.title,
        content: data.content
      })
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    setLoading(true)

    if (locationInfo) {
      // 업데이트
      const { error } = await supabase
        .from('location_info')
        .update({
          title: formData.title,
          content: formData.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', locationInfo.id)

      setLoading(false)

      if (error) {
        console.error('Error updating location info:', error)
        alert('위치 정보 수정에 실패했습니다.')
      } else {
        alert('위치 정보가 수정되었습니다!')
        loadLocationInfo()
      }
    } else {
      // 새로 추가
      const { error } = await supabase
        .from('location_info')
        .insert([{
          title: formData.title,
          content: formData.content,
          is_active: true
        }])

      setLoading(false)

      if (error) {
        console.error('Error adding location info:', error)
        alert('위치 정보 등록에 실패했습니다.')
      } else {
        alert('위치 정보가 등록되었습니다!')
        loadLocationInfo()
      }
    }
  }

  const renderPreviewContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} className="text-gray-600">
        {line}
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 위치 안내 관리</span>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MapPin className="w-7 h-7 mr-2 text-blue-600" />
            위치 정보 수정
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 강원도 속초시"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 * (줄바꿈으로 구분)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="예:
• 속초 해수욕장: 도보 10분
• 속초 관광수산시장: 차량 5분
• 설악산: 차량 15분"
              />
              <p className="text-sm text-gray-500 mt-2">
                • 각 항목을 줄바꿈으로 구분하세요
              </p>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <Eye className="w-5 h-5" />
              <span>{preview ? '편집 모드' : '미리보기'}</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? '저장 중...' : '저장'}</span>
            </button>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">미리보기</h2>
            
            <div className="bg-gray-100 rounded-xl p-8">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">{formData.title || '제목 없음'}</h3>
                  <div className="text-gray-600 leading-relaxed">
                    {formData.content ? (
                      renderPreviewContent(formData.content)
                    ) : (
                      <p className="text-gray-400">내용 없음</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 작성 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>제목</strong>: 위치의 대표 이름 (예: 강원도 속초시)</li>
            <li>• <strong>내용</strong>: 주변 관광지나 편의시설까지의 거리</li>
            <li>• 각 항목을 줄바꿈으로 구분하세요</li>
            <li>• 항목 앞에 • 또는 - 기호를 사용하면 보기 좋습니다</li>
            <li>• 미리보기로 실제 표시될 모습을 확인하세요</li>
            <li>• 저장하면 메인 페이지에 바로 반영됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
