"use client"

import '@/globals.css'

import NavBar from '@/(layout)/NavBar'
import { Inter } from '@next/font/google'
import { SessionProvider } from 'next-auth/react'
import { NotificationsProvider } from '@/(notifications)/NotificationsComponent'
import { LoaderProvider } from '@/(global-components)/ShowLoader'
import { SimpleModal } from '@/(modals)/Modal'
import { trpc } from 'utils/trpc'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  // for tailwind
  variable: '--font-inter'
})

function RootLayout({
  session,
  children
}: any) {
  return (
    <html>
      <head />

      <body className={`${inter.variable} font-sans`}>

        <SessionProvider session={session}>

          <NotificationsProvider>
            <NavBar />
            <LoaderProvider>
              {children}
            </LoaderProvider>
          </NotificationsProvider>

          <SimpleModal />
        </SessionProvider>

      </body>
    </html>
  )
}


export default trpc.withTRPC(RootLayout)