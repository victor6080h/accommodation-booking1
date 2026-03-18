'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react'
import { supabase, ApartmentImage } from '@/lib/supabase'

export default function AdminImages() {
  const [images, setImages] = useState<ApartmentImage[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingImage, setEditingImage] = useState<ApartmentImage | null>(null)
  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    const { data, error } = await supabase
      .from('apartment_images')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error loading images:', error)
      alert('사진 목록을 불러오는데 실패했습니다.')
    } else {
      setImages(data || [])
    }
  }

  // 이미지 파일 업로드 (Supabase Storage 사용)
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      // 파일명 생성 (타임스탬프 + 랜덤 문자열 + 확장자)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `${fileName}`

      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage
        .from('apartment-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        throw error
      }

      // 공개 URL 가져오기
      const { data: urlData } = supabase.storage
        .from('apartment-images')
        .getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (error) {
      console.error('Supabase upload error:', error)
      throw error
    }
  }

  // 파일 선택 핸들러
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    await uploadImageFile(file)
  }

  // 드래그 앤 드롭 핸들러
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))

    if (!imageFile) {
      alert('이미지 파일을 드롭해주세요.')
      return
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    await uploadImageFile(imageFile)
  }

  // 이미지 업로드 공통 함수
  const uploadImageFile = async (file: File) => {
    setUploading(true)

    try {
      const url = await uploadImageToSupabase(file)
      setFormData(prev => ({ ...prev, image_url: url }))
      alert('이미지 업로드 성공!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  const handleAddImage = async () => {
    if (!formData.image_url) {
      alert('이미지 URL을 입력해주세요.')
      return
    }

    setLoading(true)

    const maxOrder = images.length > 0 ? Math.max(...images.map(i => i.display_order)) : 0

    const { error } = await supabase
      .from('apartment_images')
      .insert([
        {
          image_url: formData.image_url,
          title: formData.title,
          description: formData.description,
          display_order: maxOrder + 1,
          is_active: true
        }
      ])

    setLoading(false)

    if (error) {
      console.error('Error adding image:', error)
      alert('사진 등록에 실패했습니다.')
    } else {
      alert('사진이 등록되었습니다!')
      loadImages()
      resetForm()
    }
  }

  const handleEditImage = (image: ApartmentImage) => {
    setEditingImage(image)
    setFormData({
      image_url: image.image_url,
      title: image.title || '',
      description: image.description || ''
    })
    setIsEditing(true)
  }

  const handleUpdateImage = async () => {
    if (!editingImage) return

    setLoading(true)

    const { error } = await supabase
      .from('apartment_images')
      .update({
        image_url: formData.image_url,
        title: formData.title,
        description: formData.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingImage.id)

    setLoading(false)

    if (error) {
      console.error('Error updating image:', error)
      alert('사진 수정에 실패했습니다.')
    } else {
      alert('사진이 수정되었습니다!')
      loadImages()
      resetForm()
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('apartment_images')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (error) {
      console.error('Error deleting image:', error)
      alert('사진 삭제에 실패했습니다.')
    } else {
      alert('사진이 삭제되었습니다!')
      loadImages()
    }
  }

  const handleToggleActive = async (image: ApartmentImage) => {
    const { error } = await supabase
      .from('apartment_images')
      .update({ is_active: !image.is_active })
      .eq('id', image.id)

    if (error) {
      console.error('Error toggling image:', error)
      alert('상태 변경에 실패했습니다.')
    } else {
      loadImages()
    }
  }

  const handleMoveUp = async (image: ApartmentImage, index: number) => {
    if (index === 0) return

    const prevImage = images[index - 1]
    
    await supabase
      .from('apartment_images')
      .update({ display_order: prevImage.display_order })
      .eq('id', image.id)

    await supabase
      .from('apartment_images')
      .update({ display_order: image.display_order })
      .eq('id', prevImage.id)

    loadImages()
  }

  const handleMoveDown = async (image: ApartmentImage, index: number) => {
    if (index === images.length - 1) return

    const nextImage = images[index + 1]
    
    await supabase
      .from('apartment_images')
      .update({ display_order: nextImage.display_order })
      .eq('id', image.id)

    await supabase
      .from('apartment_images')
      .update({ display_order: image.display_order })
      .eq('id', nextImage.id)

    loadImages()
  }

  const resetForm = () => {
    setFormData({
      image_url: '',
      title: '',
      description: ''
    })
    setIsEditing(false)
    setEditingImage(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 아파트 사진 관리</span>
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
        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {isEditing ? '사진 수정' : '사진 등록'}
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {/* 드래그 앤 드롭 업로드 영역 */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {uploading ? (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">업로드 중...</p>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    이미지를 드래그 앤 드롭하거나
                  </p>
                  <label
                    htmlFor="fileInput"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition"
                  >
                    파일 선택
                  </label>
                  <p className="text-sm text-gray-500 mt-4">
                    JPG, PNG, WebP • 최대 5MB
                  </p>
                </>
              )}
            </div>

            {/* URL 직접 입력 (선택) */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 URL 직접 입력
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                disabled={uploading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 (선택)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 거실 전경"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 (선택)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 넓고 밝은 거실"
                />
              </div>
            </div>

            {/* 미리보기 */}
            {formData.image_url && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">미리보기:</p>
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="max-h-64 rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E이미지 로드 실패%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            )}
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
              onClick={isEditing ? handleUpdateImage : handleAddImage}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              disabled={loading}
            >
              <Save className="w-5 h-5" />
              <span>{loading ? '처리중...' : isEditing ? '수정' : '등록'}</span>
            </button>
          </div>
        </div>

        {/* Images List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">등록된 사진 목록</h2>
          
          {images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>등록된 사진이 없습니다. 위에서 사진을 등록해주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`border border-gray-200 rounded-lg overflow-hidden transition ${
                    image.is_active ? 'bg-white' : 'bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={image.image_url}
                      alt={image.title || '아파트 사진'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E이미지 로드 실패%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    {!image.is_active && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">비활성</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {image.title && (
                      <h3 className="font-bold text-gray-900 mb-1">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="text-sm text-gray-600 mb-3">{image.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      {/* 순서 변경 */}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleMoveUp(image, index)}
                          disabled={index === 0}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                          title="위로"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(image, index)}
                          disabled={index === images.length - 1}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                          title="아래로"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* 활성화/비활성화 */}
                        <button
                          onClick={() => handleToggleActive(image)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            image.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {image.is_active ? '활성' : '비활성'}
                        </button>

                        {/* 수정 */}
                        <button
                          onClick={() => handleEditImage(image)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          disabled={loading}
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* 삭제 */}
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          disabled={loading}
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 사용 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 드래그 앤 드롭 또는 "파일 선택" 버튼으로 이미지를 업로드하세요</li>
            <li>• 업로드된 이미지는 Supabase Storage에 안전하게 저장됩니다</li>
            <li>• 위/아래 화살표로 표시 순서를 변경할 수 있습니다</li>
            <li>• "활성/비활성" 버튼으로 메인 페이지 표시 여부를 조절할 수 있습니다</li>
            <li>• 권장 이미지 크기: 1200x800 픽셀 (가로가 더 긴 형태)</li>
            <li>• 최대 파일 크기: 5MB (JPG, PNG, WebP)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
