import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oghdzrpzluzxoyvsexon.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9naGR6cnB6bHV6eG95dnNleG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxOTY0NjYsImV4cCI6MjA1Nzc3MjQ2Nn0.SeA0O94eJSztyzTaHXe1xg_6b3tKmK_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Room {
  id: string
  name: string
  room_number: string
  price: number
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
