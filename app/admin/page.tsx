'use client'

import Link from 'next/link'
import { Calendar, BookOpen, Home, Building2, Sparkles, Image as ImageIcon, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">속초 아파트 - 관리자</span>
            </Link>
            
            <Link
              href="/"
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              홈으로
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">객실 관리 및 예약 현황을 확인하세요</p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 객실 관리 */}
          <Link href="/admin/rooms">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">객실 관리</h2>
              <p className="text-gray-600 text-center">
                객실 등록, 수정, 삭제 및 가격 관리
              </p>
            </div>
          </Link>

          {/* 예약 캘린더 */}
          <Link href="/admin/calendar">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">예약 캘린더</h2>
              <p className="text-gray-600 text-center">
                예약 현황 확인 및 관리
              </p>
            </div>
          </Link>

          {/* 이용안내 관리 */}
          <Link href="/admin/guide">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">이용안내 관리</h2>
              <p className="text-gray-600 text-center">
                객실 이용안내 작성 및 수정
              </p>
            </div>
          </Link>

          {/* 아파트 특징 관리 */}
          <Link href="/admin/features">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-yellow-500">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4 mx-auto">
                <Sparkles className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">아파트 특징</h2>
              <p className="text-gray-600 text-center">
                메인 페이지 특징 내용 관리
              </p>
            </div>
          </Link>

          {/* 아파트 사진 관리 */}
          <Link href="/admin/images">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-pink-500">
              <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4 mx-auto">
                <ImageIcon className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">아파트 사진</h2>
              <p className="text-gray-600 text-center">
                메인 페이지 사진 업로드 및 관리
              </p>
            </div>
          </Link>

          {/* 일자별 가격 설정 */}
          <Link href="/admin/pricing">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-orange-500">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 mx-auto">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">일자별 가격</h2>
              <p className="text-gray-600 text-center">
                날짜별 특별 가격 설정 및 관리
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
