'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminGuide() {
  const [guideContent, setGuideContent] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [guideId, setGuideId] = useState<string | null>(null)

  useEffect(() => {
    loadGuideContent()
  }, [])

  const loadGuideContent = async () => {
    const { data, error } = await supabase
      .from('guide_content')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error loading guide:', error)
    } else if (data) {
      setGuideContent(data.content)
      setGuideId(data.id)
    }
  }

  const handleSave = async () => {
    if (!guideContent.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    setLoading(true)

    if (guideId) {
      // 기존 데이터 업데이트
      const { error } = await supabase
        .from('guide_content')
        .update({ content: guideContent, updated_at: new Date().toISOString() })
        .eq('id', guideId)

      setLoading(false)

      if (error) {
        console.error('Error updating guide:', error)
        alert('저장에 실패했습니다.')
      } else {
        alert('이용안내가 수정되었습니다!')
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } else {
      // 새로운 데이터 삽입
      const { data, error } = await supabase
        .from('guide_content')
        .insert([{ content: guideContent }])
        .select()
        .single()

      setLoading(false)

      if (error) {
        console.error('Error inserting guide:', error)
        alert('저장에 실패했습니다.')
      } else {
        alert('이용안내가 등록되었습니다!')
        setGuideId(data.id)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 이용안내 관리</span>
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
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">이용안내 내용 작성</h2>
            <button
              onClick={handleSave}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition ${
                saved 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              <Save className="w-5 h-5" />
              <span>{loading ? '저장중...' : saved ? '저장완료!' : '저장하기'}</span>
            </button>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p>• 마크다운 형식으로 작성하세요 (# 제목, ## 부제목, - 목록)</p>
            <p>• 게스트에게 보여질 내용을 자유롭게 작성하세요</p>
          </div>

          <textarea
            value={guideContent}
            onChange={(e) => setGuideContent(e.target.value)}
            className="w-full h-[600px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="이용안내 내용을 입력하세요..."
          />

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2 text-gray-700">미리보기</h3>
            <div className="prose max-w-none">
              {guideContent.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-bold mt-3 mb-2">{line.substring(3)}</h2>
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4">{line.substring(2)}</li>
                } else if (line.trim() === '') {
                  return <br key={index} />
                } else {
                  return <p key={index} className="mb-2">{line}</p>
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
