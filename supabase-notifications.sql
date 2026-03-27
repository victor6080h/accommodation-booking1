-- Create booking_notifications table
CREATE TABLE IF NOT EXISTS booking_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  room_name TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price INTEGER NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE booking_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (development - open access)
CREATE POLICY "Anyone can read booking_notifications" 
  ON booking_notifications FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert booking_notifications" 
  ON booking_notifications FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update booking_notifications" 
  ON booking_notifications FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete booking_notifications" 
  ON booking_notifications FOR DELETE 
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_booking_notifications_booking_id ON booking_notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_notifications_is_read ON booking_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_booking_notifications_created_at ON booking_notifications(created_at DESC);

-- Insert test notification if there are existing bookings
INSERT INTO booking_notifications (booking_id, guest_name, room_name, check_in, check_out, total_price, is_read)
SELECT 
  id as booking_id,
  guest_name,
  room_name,
  check_in::date,
  check_out::date,
  0 as total_price,
  false as is_read
FROM bookings 
WHERE status = 'confirmed'
ORDER BY created_at DESC
LIMIT 5
ON CONFLICT DO NOTHING;
