import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Earnings Tracker',
  description: 'Track competitor earnings and get automated analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}