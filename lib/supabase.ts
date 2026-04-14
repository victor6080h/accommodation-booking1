import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oghdzrpzluzxoyvsexon.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9naGR6cnB6bHV6eG95dnNleG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjgzNTYsImV4cCI6MjA4OTMwNDM1Nn0.fdAExA3an9K-NbFLV0Ffx4S50B4DAYSwoLYQl9h9pHY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Room {
  id: string
  name: string
  room_number: string
  price: number
  weekday_price?: number  // 주중 가격 (일, 월, 화, 수, 목)
  weekend_price?: number  // 주말 가격 (금, 토)
  capacity: number
  description: string
  created_at?: string
}

export interface Booking {
  id: string
  room_id: string
  room_name: string
  guest_name: string
  guest_phone: string
  check_in: string
  check_out: string
  status: 'confirmed' | 'completed' | 'cancelled'
  created_at?: string
}

export interface GuideContent {
  id: string
  content: string
  updated_at?: string
}

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
  display_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface ApartmentImage {
  id: string
  image_url: string
  title?: string
  description?: string
  display_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface DatePricing {
  id: string
  room_id: string
  date: string
  price: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface LocationInfo {
  id: string
  title: string
  content: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface AdminUser {
  id: string
  username: string
  password: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface GuestAccount {
  id: string
  username: string
  password: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface BookingNotification {
  id: string
  booking_id: string
  guest_name: string
  room_name: string
  check_in: string
  check_out: string
  total_price: number
  is_read: boolean
  created_at?: string
  updated_at?: string
}

export interface PricePreset {
  id: string
  name: string
  price: number
  color: string
  display_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface RoomAmenity {
  id: string
  category: 'structure' | 'building' | 'facility' | 'basic' | 'additional'
  icon: string
  name: string
  description?: string
  display_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface PaymentInfo {
  id: string
  bank_name: string
  account_number: string
  account_holder: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}
