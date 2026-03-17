'use client'

import Link from 'next/link'
import { Calendar, MapPin, Users, Star, ArrowRight, Wifi, Coffee, Tv, Wind } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">H</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HOTEL PARADISE
              </span>
            </Link>
            
            <div className="flex items-center space-x-8">
              <Link href="/rooms" className="text-gray-700 hover:text-blue-600 font-medium transition">
                객실
              </Link>
              <Link href="#facilities" className="text-gray-700 hover:text-blue-600 font-medium transition">
                시설
              </Link>
              <Link
                href="/rooms"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg transition"
              >
                예약하기
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm">
            ⭐ 2024 최우수 숙박시설 선정
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            럭셔리 휴식의<br />새로운 기준
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            도심 속 완벽한 휴식처, 최고급 시설과 프리미엄 서비스로<br />
            특별한 순간을 선사합니다
          </p>
          
          {/* Quick Booking Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  체크인
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  체크아웃
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  인원
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>1명</option>
                  <option>2명</option>
                  <option>3명</option>
                  <option>4명+</option>
                </select>
              </div>
              <div className="flex items-end">
                <Link
                  href="/rooms"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <span>검색</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              프리미엄 경험
            </h2>
            <p className="text-xl text-gray-600">
              최상의 서비스와 시설로 완벽한 휴식을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏊',
                title: '인피니티 풀',
                desc: '옥상 인피니티 풀에서 도심 전망을 감상하며 여유로운 시간을 보내세요'
              },
              {
                icon: '🍽️',
                title: '미슐랭 레스토랑',
                desc: '세계적인 셰프가 선보이는 특별한 다이닝 경험을 만나보세요'
              },
              {
                icon: '💆',
                title: '스파 & 웰니스',
                desc: '전문 테라피스트의 케어로 몸과 마음의 휴식을 취하세요'
              },
              {
                icon: '🏋️',
                title: '피트니스 센터',
                desc: '최신 운동 시설과 개인 트레이너 서비스를 이용하세요'
              },
              {
                icon: '🎯',
                title: '비즈니스 라운지',
                desc: '프라이빗 미팅룸과 최첨단 시설로 완벽한 업무 환경 제공'
              },
              {
                icon: '🚗',
                title: '발렛 파킹',
                desc: '편리한 발렛 파킹과 리무진 서비스를 이용하세요'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              객실 안내
            </h2>
            <p className="text-xl text-gray-600">
              모든 객실은 최고급 시설과 세심한 디테일로 꾸며졌습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: '디럭스 룸',
                price: '150,000원',
                size: '32㎡'
              },
              {
                name: '프리미엄 스위트',
                price: '280,000원',
                size: '58㎡'
              },
              {
                name: '로얄 스위트',
                price: '450,000원',
                size: '95㎡'
              }
            ].map((room, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4 h-64 bg-gradient-to-br from-blue-400 to-purple-400"></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {room.size}
                  </span>
                  <span className="text-xl font-bold text-blue-600">{room.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/rooms"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:shadow-lg transition"
            >
              <span>모든 객실 보기</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              고객 후기
            </h2>
            <div className="flex items-center justify-center space-x-2 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" />
              ))}
              <span className="text-gray-600 ml-2">4.9 / 5.0 (2,847 리뷰)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: '김민수',
                comment: '정말 완벽한 호텔이었습니다. 시설, 서비스, 음식 모든 면에서 5성급 이상이에요!',
                rating: 5
              },
              {
                name: '이지은',
                comment: '특별한 날을 더욱 특별하게 만들어준 곳. 직원분들이 너무 친절하세요.',
                rating: 5
              },
              {
                name: '박준호',
                comment: '가격 대비 최고의 가치! 다음에 또 방문하고 싶습니다.',
                rating: 5
              }
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center space-x-1 mb-4 text-yellow-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{review.comment}"</p>
                <p className="font-bold text-gray-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            특별한 순간을 만들어보세요
          </h2>
          <p className="text-xl text-white/90 mb-8">
            지금 예약하시면 특별 할인 혜택을 받으실 수 있습니다
          </p>
          <Link
            href="/rooms"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:shadow-2xl transition"
          >
            <span>지금 예약하기</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">H</span>
                </div>
                <span className="text-xl font-bold">HOTEL PARADISE</span>
              </div>
              <p className="text-gray-400">
                최상의 서비스로 고객님의<br />특별한 순간을 함께합니다
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">호텔 정보</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/rooms" className="hover:text-white transition">객실 안내</Link></li>
                <li><Link href="#facilities" className="hover:text-white transition">시설 안내</Link></li>
                <li><Link href="#" className="hover:text-white transition">오시는 길</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">고객 지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">자주 묻는 질문</Link></li>
                <li><Link href="#" className="hover:text-white transition">예약 안내</Link></li>
                <li><Link href="#" className="hover:text-white transition">환불 정책</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">연락처</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 02-1234-5678</li>
                <li>✉️ info@hotelparadise.com</li>
                <li>📍 서울시 강남구 테헤란로 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HOTEL PARADISE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
