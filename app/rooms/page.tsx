'use client'

import Link from 'next/link'
import { Users, Maximize, Star, ArrowRight, Wifi, Coffee, Tv, Wind } from 'lucide-react'

const rooms = [
  {
    id: 1,
    name: '디럭스 룸',
    type: 'Deluxe',
    capacity: 2,
    maxCapacity: 3,
    price: 150000,
    size: '32㎡',
    description: '모던하고 세련된 인테리어의 디럭스 룸으로 도심의 아름다운 전망을 감상하실 수 있습니다.',
    rating: 4.8
  },
  {
    id: 2,
    name: '프리미엄 스위트',
    type: 'Suite',
    capacity: 2,
    maxCapacity: 4,
    price: 280000,
    size: '58㎡',
    description: '넓은 거실과 침실이 분리된 프리미엄 스위트로 프라이빗한 휴식을 즐기실 수 있습니다.',
    rating: 4.9
  },
  {
    id: 3,
    name: '로얄 스위트',
    type: 'Royal Suite',
    capacity: 3,
    maxCapacity: 5,
    price: 450000,
    size: '95㎡',
    description: '최상층에 위치한 로얄 스위트는 탁 트인 전망과 럭셔리한 인테리어가 돋보입니다.',
    rating: 5.0
  },
  {
    id: 4,
    name: '패밀리 스위트',
    type: 'Family Suite',
    capacity: 4,
    maxCapacity: 6,
    price: 320000,
    size: '72㎡',
    description: '가족 단위 투숙객을 위한 넓고 편안한 공간으로 완벽한 가족 여행을 선사합니다.',
    rating: 4.7
  },
  {
    id: 5,
    name: '비즈니스 스위트',
    type: 'Business Suite',
    capacity: 2,
    maxCapacity: 3,
    price: 350000,
    size: '65㎡',
    description: '비즈니스 투숙객을 위한 완벽한 업무 환경과 편안한 휴식 공간이 마련되어 있습니다.',
    rating: 4.8
  },
  {
    id: 6,
    name: '프레지던셜 스위트',
    type: 'Presidential Suite',
    capacity: 4,
    maxCapacity: 6,
    price: 850000,
    size: '150㎡',
    description: '최고급 시설과 서비스를 갖춘 프레지던셜 스위트로 최상의 경험을 선사합니다.',
    rating: 5.0
  }
]

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
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
            
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
                홈
              </Link>
              <Link
                href="/"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg transition"
              >
                메인으로
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            완벽한 객실을 찾아보세요
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            모든 객실은 프리미엄 침구, 최신 시설, 그리고 세심한 디테일로 꾸며져 있습니다
          </p>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group">
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-400">
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-gray-900">{room.rating}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{room.name}</h3>
                      <p className="text-sm text-gray-500">{room.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {room.price.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-500">1박 기준</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">{room.description}</p>

                  {/* Room Info */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-xs text-gray-600">최대</div>
                      <div className="font-bold text-gray-900">{room.maxCapacity}명</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Maximize className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-xs text-gray-600">면적</div>
                      <div className="font-bold text-gray-900">{room.size}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Star className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-xs text-gray-600">등급</div>
                      <div className="font-bold text-gray-900">5성</div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      <Wifi className="w-4 h-4" />
                      <span>WiFi</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                      <Tv className="w-4 h-4" />
                      <span>TV</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                      <Wind className="w-4 h-4" />
                      <span>냉난방</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                      <Coffee className="w-4 h-4" />
                      <span>미니바</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-medium hover:shadow-lg transition">
                    <span className="flex items-center justify-center space-x-2">
                      <span>예약하기</span>
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            아직 고민 중이신가요?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            컨시어지 팀이 완벽한 객실 선택을 도와드립니다
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:02-1234-5678"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:shadow-2xl transition"
            >
              📞 02-1234-5678
            </a>
            <a
              href="mailto:info@hotelparadise.com"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition"
            >
              ✉️ 이메일 문의
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">H</span>
            </div>
            <span className="text-xl font-bold">HOTEL PARADISE</span>
          </div>
          <p className="text-gray-400 mb-4">
            최상의 서비스로 고객님의 특별한 순간을 함께합니다
          </p>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400">&copy; 2024 HOTEL PARADISE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
