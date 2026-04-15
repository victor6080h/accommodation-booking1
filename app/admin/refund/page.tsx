'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Save, RefreshCcw } from 'lucide-react'
import { supabase, RefundPolicy } from '@/lib/supabase'

export default function AdminRefund() {
  const [refundPolicy, setRefundPolicy] = useState<RefundPolicy | null>(null)
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRefundPolicy()
  }, [])

  const loadRefundPolicy = async () => {
    const { data, error } = await supabase
      .from('refund_policy')
      .select('*')
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Error loading refund policy:', error)
    } else if (data) {
      setRefundPolicy(data as RefundPolicy)
      setContent(data.content)
    }
  }

  const handleSave = async () => {
    if (!content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    setLoading(true)

    if (refundPolicy) {
      // 기존 데이터 업데이트
      const { error } = await supabase
        .from('refund_policy')
        .update({ 
          content: content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', refundPolicy.id)

      setLoading(false)

      if (error) {
        console.error('Error updating refund policy:', error)
        alert('저장에 실패했습니다.')
      } else {
        alert('환불 규정이 수정되었습니다!')
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        loadRefundPolicy()
      }
    } else {
      // 새로운 데이터 삽입
      const { data, error } = await supabase
        .from('refund_policy')
        .insert([{ content: content, is_active: true }])
        .select()
        .single()

      setLoading(false)

      if (error) {
        console.error('Error inserting refund policy:', error)
        alert('저장에 실패했습니다.')
      } else {
        alert('환불 규정이 등록되었습니다!')
        setRefundPolicy(data as RefundPolicy)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
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
              <span className="text-xl font-bold">관리자 - 환불 규정 관리</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <RefreshCcw className="w-7 h-7 mr-2 text-blue-600" />
              환불 규정 작성
            </h2>
            <button
              onClick={handleSave}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition ${
                saved 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              <Save className="w-5 h-5" />
              <span>{loading ? '저장중...' : saved ? '저장완료!' : '저장하기'}</span>
            </button>
          </div>

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>이 내용은 게스트가 예약 완료 시 자동으로 표시됩니다.</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• 취소 시점별 환불율을 명확히 안내해주세요</li>
              <li>• 환불 처리 기간과 수수료를 명시해주세요</li>
              <li>• 특별 사유(천재지변 등)에 대한 예외 사항을 추가할 수 있습니다</li>
            </ul>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[500px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="환불 규정 내용을 입력하세요...

예시:
📅 취소 환불 기준 (체크인 기준)

• 체크인 7일 전: 100% 전액 환불
• 체크인 5~6일 전: 80% 환불 (20% 위약금)
• 체크인 3~4일 전: 50% 환불 (50% 위약금)
• 체크인 1~2일 전: 30% 환불 (70% 위약금)
• 체크인 당일 & 노쇼: 환불 불가

⚠️ 환불 유의사항
• 환불은 영업일 기준 3~5일 소요
• 계좌이체 수수료 500원 차감
• 예약자 명의 계좌로만 환불 가능"
          />

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2 text-gray-700">미리보기</h3>
            <div className="prose max-w-none whitespace-pre-wrap text-sm border border-gray-200 p-4 rounded bg-white">
              {content || '내용을 입력하면 여기에 미리보기가 표시됩니다.'}
            </div>
          </div>
        </div>

        {/* 사용 안내 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-900 mb-2">📋 작성 가이드</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>✅ <strong>명확한 환불율</strong>: 체크인 7일 전 100%, 5~6일 전 80% 등</li>
            <li>✅ <strong>처리 기간</strong>: 영업일 기준 3~5일 등</li>
            <li>✅ <strong>추가 비용</strong>: 수수료 500원 등</li>
            <li>✅ <strong>예외 사항</strong>: 천재지변, 감염병 등</li>
            <li>✅ <strong>날짜 변경</strong>: 취소 대신 날짜 변경 안내</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
