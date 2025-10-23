import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import Navigation from '@/components/Navigation'
import QueryProvider from '@/components/QueryProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Clinic Concierge Leads',
  description: 'Premium lead management dashboard for beauty clinics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>
          <QueryProvider>
            <Navigation />
            {children}
            <Toaster 
              position="top-right"
              theme="dark"
              richColors
              closeButton
            />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
