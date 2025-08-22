import type React from "react"
import ClientLayout from "./ClientLayout"
import './globals.css'

export const metadata = {
  title: "S.C.E.A.R. - Rímska armáda a pomocné zbory",
  description: "Historical reenactment group focused on Roman auxiliary forces",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}