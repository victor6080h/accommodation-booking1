import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '속초 아파트 - 편안한 숙소 예약',
  description: '속초의 깨끗하고 편안한 아파트를 예약하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
