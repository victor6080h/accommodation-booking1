'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface Room {
  id: string
  name: string
  roomNumber: string
  price: number
  capacity: number
  description: string
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    price: '',
    capacity: '',
    description: ''
  })

  // Load rooms from localStorage
  useEffect(() => {
    const savedRooms = localStorage.getItem('rooms')
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms))
    }
  }, [])

  // Save rooms to localStorage
  const saveRooms = (updatedRooms: Room[]) => {
    localStorage.setItem('rooms', JSON.stringify(updatedRooms))
    setRooms(updatedRooms)
  }

  const handleAddRoom = () => {
    if (!formData.name || !formData.roomNumber || !formData.price || !formData.capacity) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      name: formData.name,
      roomNumber: formData.roomNumber,
      price: parseInt(formData.price),
      capacity: parseInt(formData.capacity),
      description: formData.description
    }

    saveRooms([...rooms, newRoom])
    resetForm()
  }

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setFormData({
      name: room.name,
      roomNumber: room.roomNumber,
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      description: room.description
    })
    setIsEditing(true)
  }

  const handleUpdateRoom = () => {
    if (!editingRoom) return

    const updatedRooms = rooms.map(room =>
      room.id === editingRoom.id
        ? {
            ...room,
            name: formData.name,
            roomNumber: formData.roomNumber,
            price: parseInt(formData.price),
            capacity: parseInt(formData.capacity),
            description: formData.description
          }
        : room
    )

    saveRooms(updatedRooms)
    resetForm()
  }

  const handleDeleteRoom = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      saveRooms(rooms.filter(room => room.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      roomNumber: '',
      price: '',
      capacity: '',
      description: ''
    })
    setIsEditing(false)
    setEditingRoom(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">관리자 - 객실 관리</span>
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
            {isEditing ? '객실 수정' : '객실 등록'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                객실명 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 디럭스룸"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                호수 *
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 101호"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1박 가격 (원) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 150000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수용 인원 *
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 4"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                객실 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="객실에 대한 상세 설명을 입력하세요"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {isEditing && (
              <button
                onClick={resetForm}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <X className="w-5 h-5" />
                <span>취소</span>
              </button>
            )}
            <button
              onClick={isEditing ? handleUpdateRoom : handleAddRoom}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Save className="w-5 h-5" />
              <span>{isEditing ? '수정' : '등록'}</span>
            </button>
          </div>
        </div>

        {/* Rooms List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">등록된 객실 목록</h2>
          
          {rooms.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 객실이 없습니다. 위에서 객실을 등록해주세요.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-600">{room.roomNumber}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-blue-600">
                      {room.price.toLocaleString()}원<span className="text-sm text-gray-600">/박</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      최대 인원: {room.capacity}명
                    </p>
                    {room.description && (
                      <p className="text-sm text-gray-600 mt-2">{room.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
