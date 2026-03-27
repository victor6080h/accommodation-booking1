'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.username || !formData.password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', formData.username)
        .eq('password', formData.password)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.')
        setLoading(false)
        return
      }

      // 로그인 성공 - 세션 저장
      localStorage.setItem('admin_logged_in', 'true')
      localStorage.setItem('admin_username', data.username)
      localStorage.setItem('admin_id', data.id)
      
      // 관리자 페이지로 이동
      router.push('/admin')
    } catch (err) {
      console.error('Login error:', err)
      setError('로그인 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">속초 아파트</h1>
          <p className="text-blue-100">관리자 로그인</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이디
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="아이디를 입력하세요"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호를 입력하세요"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              초기 계정: admin / admin1234
            </p>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ 로그인 후 반드시 비밀번호를 변경하세요
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-white hover:text-blue-100 text-sm underline"
          >
            ← 메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
