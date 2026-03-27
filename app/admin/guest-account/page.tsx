'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, User, Save, Eye, LogOut } from 'lucide-react'
import { supabase, GuestAccount } from '@/lib/supabase'

export default function AdminGuestAccount() {
  const router = useRouter()
  const [guestAccount, setGuestAccount] = useState<GuestAccount | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // 관리자 로그인 확인
    const loggedIn = localStorage.getItem('admin_logged_in')
    
    if (!loggedIn) {
      router.push('/admin/login')
      return
    }

    loadGuestAccount()
  }, [router])

  const loadGuestAccount = async () => {
    const { data, error } = await supabase
      .from('guest_account')
      .select('*')
      .single()

    if (error) {
      console.error('Error loading guest account:', error)
    } else if (data) {
      setGuestAccount(data as GuestAccount)
      setFormData({
        username: data.username,
        password: data.password
      })
    }
  }

  const handleSave = async () => {
    if (!formData.username || !formData.password) {
      alert('아이디와 비밀번호를 입력해주세요.')
      return
    }

    if (formData.password.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    if (guestAccount) {
      // 업데이트
      const { error } = await supabase
        .from('guest_account')
        .update({
          username: formData.username,
          password: formData.password,
          updated_at: new Date().toISOString()
        })
        .eq('id', guestAccount.id)

      setLoading(false)

      if (error) {
        console.error('Error updating guest account:', error)
        alert('게스트 계정 수정에 실패했습니다.')
      } else {
        alert('게스트 계정이 수정되었습니다!')
        loadGuestAccount()
      }
    } else {
      // 새로 추가
      const { error } = await supabase
        .from('guest_account')
        .insert([{
          username: formData.username,
          password: formData.password,
          is_active: true
        }])

      setLoading(false)

      if (error) {
        console.error('Error creating guest account:', error)
        alert('게스트 계정 생성에 실패했습니다.')
      } else {
        alert('게스트 계정이 생성되었습니다!')
        loadGuestAccount()
      }
    }
  }

  const handleToggleActive = async () => {
    if (!guestAccount) return

    const { error } = await supabase
      .from('guest_account')
      .update({ 
        is_active: !guestAccount.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', guestAccount.id)

    if (error) {
      console.error('Error toggling guest account:', error)
      alert('상태 변경에 실패했습니다.')
    } else {
      alert('게스트 계정 상태가 변경되었습니다!')
      loadGuestAccount()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_id')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 게스트 계정 관리</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                대시보드
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <User className="w-7 h-7 mr-2 text-cyan-600" />
            게스트 계정 설정
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이디 *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="게스트 아이디"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="비밀번호 (최소 4자)"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <Eye className={`w-5 h-5 ${showPassword ? 'text-cyan-600' : 'text-gray-400'}`} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                최소 4자 이상 입력해주세요
              </p>
            </div>

            {guestAccount && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">게스트 로그인</span>
                  <p className="text-xs text-gray-500 mt-1">
                    게스트가 예약 페이지에 접근할 수 있는지 제어
                  </p>
                </div>
                <button
                  onClick={handleToggleActive}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    guestAccount.is_active
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {guestAccount.is_active ? '활성화됨' : '비활성화됨'}
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:bg-gray-400"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? '저장 중...' : '저장'}</span>
            </button>
          </div>
        </div>

        {/* Current Settings Display */}
        {guestAccount && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">현재 게스트 계정 정보</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">아이디</span>
                  <p className="text-lg font-bold text-gray-900 mt-1">{guestAccount.username}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  guestAccount.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {guestAccount.is_active ? '활성' : '비활성'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">비밀번호</span>
                <p className="text-lg font-mono text-gray-900 mt-1">
                  {showPassword ? guestAccount.password : '••••••••'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">마지막 수정</span>
                <p className="text-sm text-gray-600 mt-1">
                  {guestAccount.updated_at 
                    ? new Date(guestAccount.updated_at).toLocaleString('ko-KR')
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <h3 className="font-bold text-cyan-900 mb-2">💡 게스트 로그인 안내</h3>
          <ul className="text-sm text-cyan-800 space-y-1">
            <li>• 게스트는 하나의 공용 계정을 사용합니다</li>
            <li>• 게스트 계정으로 로그인하면 예약 및 안내 페이지에 접근할 수 있습니다</li>
            <li>• 게스트 로그인 페이지: <a href="/guest/login" className="underline font-medium">/guest/login</a></li>
            <li>• 비밀번호는 정기적으로 변경하는 것을 권장합니다</li>
            <li>• 비활성화하면 게스트 로그인이 불가능합니다</li>
            <li>• 관리자는 별도로 <a href="/admin/login" className="underline font-medium">/admin/login</a>에서 로그인합니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
