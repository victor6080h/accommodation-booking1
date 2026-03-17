'use client'

import Link from 'next/link'
import { Calendar, MapPin, Users, Home } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">속초 아파트</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link href="/guest/calendar" className="text-gray-700 hover:text-blue-600 font-medium">
                예약하기
              </Link>
              <Link href="/guest/guide" className="text-gray-700 hover:text-blue-600 font-medium">
                이용안내
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            속초 아파트에 오신 것을 환영합니다
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            깨끗하고 편안한 공간에서 특별한 휴식을 즐기세요
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/guest/calendar"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition flex items-center space-x-2"
            >
              <Calendar className="w-6 h-6" />
              <span>예약 가능 날짜 확인</span>
            </Link>
            <Link
              href="/guest/guide"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition"
            >
              이용안내 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">아파트 특징</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🏖️</div>
              <h3 className="text-xl font-bold mb-2">바다 근처</h3>
              <p className="text-gray-600">속초 해변까지 도보 10분 거리</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🅿️</div>
              <h3 className="text-xl font-bold mb-2">주차 가능</h3>
              <p className="text-gray-600">편리한 무료 주차 공간 제공</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-2">깨끗한 시설</h3>
              <p className="text-gray-600">최근 리모델링한 깨끗한 공간</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">위치 안내</h2>
          
          <div className="bg-gray-100 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">강원도 속초시</h3>
                <p className="text-gray-600 leading-relaxed">
                  • 속초 해수욕장: 도보 10분<br />
                  • 속초 관광수산시장: 차량 5분<br />
                  • 설악산: 차량 15분
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            지금 바로 예약하세요
          </h2>
          <p className="text-xl mb-8">
            예약 가능 날짜를 확인하고 편안한 휴식을 계획하세요
          </p>
          <Link
            href="/guest/calendar"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            <Calendar className="w-6 h-6" />
            <span>예약하기</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 속초 아파트. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
