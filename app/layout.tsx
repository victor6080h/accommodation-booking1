import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hotel Paradise - 럭셔리 숙박의 새로운 기준',
  description: '최고급 시설과 프리미엄 서비스를 제공하는 호텔 파라다이스',
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
