import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SOCIETAS - Rímske pomocné jednotky',
  description: 'Spoločnosť historickej rekonštrukcie rímskych pomocných jednotiek',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk">
      <body className={inter.className}>{children}</body>
    </html>
  )
}