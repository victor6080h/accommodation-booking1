'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function GuestGuide() {
  const [guideContent, setGuideContent] = useState('')

  useEffect(() => {
    loadGuideContent()
  }, [])

  const loadGuideContent = async () => {
    const { data, error } = await supabase
      .from('guide_content')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error('Error loading guide:', error)
    } else if (data) {
      setGuideContent(data.content)
    }
  }

  const renderContent = () => {
    return guideContent.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-gray-800">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-700">
            {line.substring(2)}
          </li>
        )
      } else if (line.trim() === '') {
        return <div key={index} className="h-2" />
      } else {
        return (
          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
            {line}
          </p>
        )
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">속초 아파트 - 이용안내</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/guest/calendar"
                className="text-white hover:text-blue-100"
              >
                예약하기
              </Link>
              <Link
                href="/"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Guide Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            {renderContent()}
          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-3">지금 바로 예약하세요</h3>
              <p className="text-gray-600 mb-4">
                예약 가능한 날짜를 확인하고 편안한 휴식을 계획하세요
              </p>
              <Link
                href="/guest/calendar"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Calendar className="w-5 h-5" />
                <span>예약 가능 날짜 확인</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
