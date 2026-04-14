'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, CreditCard, Save, Edit2 } from 'lucide-react'
import { supabase, PaymentInfo } from '@/lib/supabase'

export default function AdminPayment() {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_holder: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPaymentInfo()
  }, [])

  const loadPaymentInfo = async () => {
    const { data, error } = await supabase
      .from('payment_info')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error loading payment info:', error)
    } else if (data) {
      setPaymentInfo(data as PaymentInfo)
      setFormData({
        bank_name: data.bank_name,
        account_number: data.account_number,
        account_holder: data.account_holder
      })
    }
  }

  const handleSave = async () => {
    if (!formData.bank_name || !formData.account_number || !formData.account_holder) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    setLoading(true)

    if (paymentInfo) {
      // 업데이트
      const { error } = await supabase
        .from('payment_info')
        .update({
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_holder: formData.account_holder,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentInfo.id)

      setLoading(false)

      if (error) {
        console.error('Error updating payment info:', error)
        alert('입금 계좌 수정에 실패했습니다.')
      } else {
        alert('입금 계좌가 수정되었습니다!')
        setIsEditing(false)
        loadPaymentInfo()
      }
    } else {
      // 새로 추가
      const { error } = await supabase
        .from('payment_info')
        .insert([{
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_holder: formData.account_holder,
          is_active: true
        }])

      setLoading(false)

      if (error) {
        console.error('Error adding payment info:', error)
        alert('입금 계좌 등록에 실패했습니다.')
      } else {
        alert('입금 계좌가 등록되었습니다!')
        setIsEditing(false)
        loadPaymentInfo()
      }
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (paymentInfo) {
      setFormData({
        bank_name: paymentInfo.bank_name,
        account_number: paymentInfo.account_number,
        account_holder: paymentInfo.account_holder
      })
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
              <span className="text-xl font-bold">관리자 - 입금 계좌 관리</span>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Info Display */}
        {!isEditing && paymentInfo && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <CreditCard className="w-7 h-7 mr-2 text-blue-600" />
                현재 입금 계좌 정보
              </h2>
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit2 className="w-5 h-5" />
                <span>수정</span>
              </button>
            </div>
            
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-24 font-medium text-gray-700">은행명</div>
                <div className="flex-1 text-lg font-bold text-gray-900">{paymentInfo.bank_name}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-24 font-medium text-gray-700">계좌번호</div>
                <div className="flex-1 text-lg font-bold text-gray-900">{paymentInfo.account_number}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-24 font-medium text-gray-700">예금주</div>
                <div className="flex-1 text-lg font-bold text-gray-900">{paymentInfo.account_holder}</div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 이 계좌 정보는 예약 완료 후 게스트에게 자동으로 표시됩니다.
              </p>
            </div>
          </div>
        )}

        {/* No Payment Info Yet */}
        {!isEditing && !paymentInfo && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CreditCard className="w-7 h-7 mr-2 text-blue-600" />
              입금 계좌 등록
            </h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                ⚠️ 등록된 입금 계좌 정보가 없습니다. 아래 버튼을 눌러 입금 계좌를 등록해주세요.
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <CreditCard className="w-5 h-5" />
              <span>입금 계좌 등록하기</span>
            </button>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CreditCard className="w-7 h-7 mr-2 text-blue-600" />
              입금 계좌 수정
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  은행명 *
                </label>
                <input
                  type="text"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 국민은행"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  계좌번호 *
                </label>
                <input
                  type="text"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 123456-78-901234"
                />
                <p className="text-xs text-gray-500 mt-1">
                  하이픈(-)을 포함하여 입력해주세요
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예금주 *
                </label>
                <input
                  type="text"
                  value={formData.account_holder}
                  onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 속초아파트"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                disabled={loading}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                disabled={loading}
              >
                <Save className="w-5 h-5" />
                <span>{loading ? '저장 중...' : '저장'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 사용 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 입금 계좌 정보는 게스트가 예약 완료 후 자동으로 표시됩니다</li>
            <li>• 계좌번호는 하이픈(-)을 포함하여 정확히 입력해주세요</li>
            <li>• 예금주명은 입금 확인을 위해 정확히 입력해주세요</li>
            <li>• 계좌 변경 시 기존 예약에는 영향을 주지 않습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
