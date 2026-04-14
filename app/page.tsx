'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Home } from 'lucide-react'
import { supabase, Feature, ApartmentImage, LocationInfo, RoomAmenity } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  const [features, setFeatures] = useState<Feature[]>([])
  const [images, setImages] = useState<ApartmentImage[]>([])
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [amenities, setAmenities] = useState<RoomAmenity[]>([])

  useEffect(() => {
    // 게스트 로그인 확인
    const loggedIn = localStorage.getItem('guest_logged_in')
    if (!loggedIn) {
      router.push('/guest/login')
      return
    }

    loadData()
  }, [router])

  const loadData = async () => {
    // Load features
    const { data: featuresData } = await supabase
      .from('features')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (featuresData) {
      setFeatures(featuresData)
    }

    // Load images
    const { data: imagesData } = await supabase
      .from('apartment_images')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (imagesData) {
      setImages(imagesData)
    }

    // Load location info
    const { data: locationData } = await supabase
      .from('location_info')
      .select('*')
      .eq('is_active', true)
      .single()

    if (locationData) {
      setLocationInfo(locationData)
    }

    // Load amenities
    const { data: amenitiesData } = await supabase
      .from('room_amenities')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (amenitiesData) {
      setAmenities(amenitiesData)
    }
  }

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
          
          {features.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.id} className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              특징을 불러오는 중입니다...
            </div>
          )}
        </div>
      </section>

      {/* Room Amenities */}
      {amenities.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">시설 정보</h2>
            
            {/* Structure */}
            {amenities.filter(a => a.category === 'structure').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">구조</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {amenities.filter(a => a.category === 'structure').map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                      <span className="text-3xl">{amenity.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{amenity.name}</p>
                        {amenity.description && (
                          <p className="text-sm text-gray-600">{amenity.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Building */}
            {amenities.filter(a => a.category === 'building').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">건물 유형 및 면적</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amenities.filter(a => a.category === 'building').map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                      <span className="text-3xl">{amenity.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{amenity.name}</p>
                        {amenity.description && (
                          <p className="text-sm text-gray-600">{amenity.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facility */}
            {amenities.filter(a => a.category === 'facility').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">엘리베이터 및 주차</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amenities.filter(a => a.category === 'facility').map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                      <span className="text-3xl">{amenity.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{amenity.name}</p>
                        {amenity.description && (
                          <p className="text-sm text-gray-600">{amenity.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Basic */}
            {amenities.filter(a => a.category === 'basic').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">기본 옵션</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {amenities.filter(a => a.category === 'basic').map((amenity) => (
                    <div key={amenity.id} className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg shadow">
                      <span className="text-3xl">{amenity.icon}</span>
                      <p className="font-medium text-gray-900 text-center text-sm">{amenity.name}</p>
                      {amenity.description && (
                        <p className="text-xs text-gray-600 text-center">{amenity.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional */}
            {amenities.filter(a => a.category === 'additional').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">추가 옵션</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {amenities.filter(a => a.category === 'additional').map((amenity) => (
                    <div key={amenity.id} className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg shadow">
                      <span className="text-3xl">{amenity.icon}</span>
                      <p className="font-medium text-gray-900 text-center text-sm">{amenity.name}</p>
                      {amenity.description && (
                        <p className="text-xs text-gray-600 text-center">{amenity.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Images Gallery */}
      {images.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">아파트 갤러리</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition border border-gray-200">
                  <div className="relative h-64">
                    <img
                      src={image.image_url}
                      alt={image.title || '아파트 사진'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E이미지 로드 실패%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                  {(image.title || image.description) && (
                    <div className="p-4">
                      {image.title && (
                        <h3 className="font-bold text-gray-900 mb-1">{image.title}</h3>
                      )}
                      {image.description && (
                        <p className="text-sm text-gray-600">{image.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">위치 안내</h2>
          
          {locationInfo ? (
            <div className="bg-gray-100 rounded-xl p-8">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">{locationInfo.title}</h3>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {locationInfo.content}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              위치 정보를 불러오는 중입니다...
            </div>
          )}
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
    </div>
  )
}
