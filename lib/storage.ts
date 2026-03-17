// 로컬 스토리지 관리 유틸리티

export interface Room {
  id: string
  number: string // 호수
  name: string
  price: number
  maxGuests: number
  description: string
  createdAt: string
}

export interface Booking {
  id: string
  roomId: string
  roomNumber: string
  guestName: string
  guestPhone: string
  guestEmail: string
  checkIn: string // YYYY-MM-DD
  checkOut: string // YYYY-MM-DD
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface Guide {
  content: string
  updatedAt: string
}

// 객실 관리
export const getRooms = (): Room[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('rooms')
  return data ? JSON.parse(data) : []
}

export const saveRoom = (room: Omit<Room, 'id' | 'createdAt'>): Room => {
  const rooms = getRooms()
  const newRoom: Room = {
    ...room,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  rooms.push(newRoom)
  localStorage.setItem('rooms', JSON.stringify(rooms))
  return newRoom
}

export const updateRoom = (id: string, room: Partial<Room>): Room | null => {
  const rooms = getRooms()
  const index = rooms.findIndex(r => r.id === id)
  if (index === -1) return null
  
  rooms[index] = { ...rooms[index], ...room }
  localStorage.setItem('rooms', JSON.stringify(rooms))
  return rooms[index]
}

export const deleteRoom = (id: string): boolean => {
  const rooms = getRooms()
  const filtered = rooms.filter(r => r.id !== id)
  if (filtered.length === rooms.length) return false
  
  localStorage.setItem('rooms', JSON.stringify(filtered))
  return true
}

// 예약 관리
export const getBookings = (): Booking[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('bookings')
  return data ? JSON.parse(data) : []
}

export const saveBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
  const bookings = getBookings()
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  bookings.push(newBooking)
  localStorage.setItem('bookings', JSON.stringify(bookings))
  return newBooking
}

export const updateBookingStatus = (id: string, status: Booking['status']): Booking | null => {
  const bookings = getBookings()
  const index = bookings.findIndex(b => b.id === id)
  if (index === -1) return null
  
  bookings[index].status = status
  localStorage.setItem('bookings', JSON.stringify(bookings))
  return bookings[index]
}

export const deleteBooking = (id: string): boolean => {
  const bookings = getBookings()
  const filtered = bookings.filter(b => b.id !== id)
  if (filtered.length === bookings.length) return false
  
  localStorage.setItem('bookings', JSON.stringify(filtered))
  return true
}

// 날짜별 예약 확인
export const isDateBooked = (roomId: string, date: string): boolean => {
  const bookings = getBookings()
  return bookings.some(booking => {
    if (booking.roomId !== roomId) return false
    if (booking.status === 'cancelled') return false
    
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    const targetDate = new Date(date)
    
    return targetDate >= checkIn && targetDate < checkOut
  })
}

// 기간별 예약 확인
export const getBookingsInRange = (roomId: string, startDate: string, endDate: string): Booking[] => {
  const bookings = getBookings()
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return bookings.filter(booking => {
    if (booking.roomId !== roomId) return false
    if (booking.status === 'cancelled') return false
    
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    
    return (checkIn < end && checkOut > start)
  })
}

// 이용안내 관리
export const getGuide = (): Guide => {
  if (typeof window === 'undefined') return { content: '', updatedAt: '' }
  const data = localStorage.getItem('guide')
  return data ? JSON.parse(data) : { content: '', updatedAt: '' }
}

export const saveGuide = (content: string): Guide => {
  const guide: Guide = {
    content,
    updatedAt: new Date().toISOString()
  }
  localStorage.setItem('guide', JSON.stringify(guide))
  return guide
}
