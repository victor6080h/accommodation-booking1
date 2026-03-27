'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, User, Plus, Edit2, Trash2, Save, X, LogOut } from 'lucide-react'
import { supabase, AdminUser } from '@/lib/supabase'

export default function AdminAccounts() {
  const router = useRouter()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [currentAdminId, setCurrentAdminId] = useState<string>('')

  useEffect(() => {
    // 로그인 확인
    const loggedIn = localStorage.getItem('admin_logged_in')
    const adminId = localStorage.getItem('admin_id')
    
    if (!loggedIn) {
      router.push('/admin/login')
      return
    }

    if (adminId) {
      setCurrentAdminId(adminId)
    }

    loadAdminUsers()
  }, [router])

  const loadAdminUsers = async () => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading admin users:', error)
      alert('관리자 계정 목록을 불러오는데 실패했습니다.')
    } else {
      setAdminUsers(data || [])
    }
  }

  const handleAddUser = async () => {
    if (!formData.username || !formData.password) {
      alert('아이디와 비밀번호를 입력해주세요.')
      return
    }

    if (formData.password.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('admin_users')
      .insert([{
        username: formData.username,
        password: formData.password,
        is_active: true
      }])

    setLoading(false)

    if (error) {
      console.error('Error adding admin user:', error)
      if (error.message.includes('duplicate')) {
        alert('이미 존재하는 아이디입니다.')
      } else {
        alert('계정 생성에 실패했습니다.')
      }
    } else {
      alert('관리자 계정이 생성되었습니다!')
      loadAdminUsers()
      resetForm()
    }
  }

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: ''
    })
    setIsEditing(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    if (!formData.password) {
      alert('새 비밀번호를 입력해주세요.')
      return
    }

    if (formData.password.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('admin_users')
      .update({
        password: formData.password,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingUser.id)

    setLoading(false)

    if (error) {
      console.error('Error updating admin user:', error)
      alert('계정 수정에 실패했습니다.')
    } else {
      alert('비밀번호가 변경되었습니다!')
      loadAdminUsers()
      resetForm()
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (id === currentAdminId) {
      alert('현재 로그인된 계정은 삭제할 수 없습니다.')
      return
    }

    if (!confirm('정말 이 계정을 삭제하시겠습니까?')) {
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (error) {
      console.error('Error deleting admin user:', error)
      alert('계정 삭제에 실패했습니다.')
    } else {
      alert('계정이 삭제되었습니다!')
      loadAdminUsers()
    }
  }

  const handleToggleActive = async (user: AdminUser) => {
    if (user.id === currentAdminId) {
      alert('현재 로그인된 계정은 비활성화할 수 없습니다.')
      return
    }

    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: !user.is_active })
      .eq('id', user.id)

    if (error) {
      console.error('Error toggling user status:', error)
      alert('상태 변경에 실패했습니다.')
    } else {
      loadAdminUsers()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_id')
    router.push('/admin/login')
  }

  const resetForm = () => {
    setFormData({
      username: '',
      password: ''
    })
    setIsEditing(false)
    setEditingUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 계정 관리</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {isEditing ? '비밀번호 변경' : '새 관리자 계정 추가'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이디 *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="아이디"
                disabled={isEditing || loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isEditing ? '새 비밀번호 *' : '비밀번호 *'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="비밀번호 (최소 4자)"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {isEditing && (
              <button
                onClick={resetForm}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                disabled={loading}
              >
                <X className="w-5 h-5" />
                <span>취소</span>
              </button>
            )}
            <button
              onClick={isEditing ? handleUpdateUser : handleAddUser}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              disabled={loading}
            >
              {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{loading ? '처리중...' : isEditing ? '비밀번호 변경' : '계정 추가'}</span>
            </button>
          </div>
        </div>

        {/* Admin Users List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">관리자 계정 목록</h2>
          
          {adminUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>등록된 관리자 계정이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      아이디
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      생성일
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminUsers.map((user) => (
                    <tr key={user.id} className={!user.is_active ? 'bg-gray-50 opacity-60' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {user.username}
                            {user.id === currentAdminId && (
                              <span className="ml-2 text-xs text-blue-600">(현재 로그인)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(user)}
                          disabled={loading || user.id === currentAdminId}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          } ${user.id === currentAdminId ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                        >
                          {user.is_active ? '활성' : '비활성'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-900"
                            title="비밀번호 변경"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={loading || user.id === currentAdminId}
                            className={`text-red-600 hover:text-red-900 ${
                              user.id === currentAdminId ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ 보안 주의사항</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 초기 비밀번호(admin1234)는 반드시 변경하세요</li>
            <li>• 비밀번호는 정기적으로 변경하는 것을 권장합니다</li>
            <li>• 사용하지 않는 계정은 비활성화하거나 삭제하세요</li>
            <li>• 현재 로그인된 계정은 삭제/비활성화할 수 없습니다</li>
            <li>• 비밀번호는 최소 4자 이상 입력해주세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
