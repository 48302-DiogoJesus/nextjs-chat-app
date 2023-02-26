import { AppProps, AppType } from 'next/app'
import '@/globals.css'
import NavBar from '@/components/Layout/NavBar';
import { SessionProvider } from "next-auth/react"
import { trpc } from '../utils/trpc'
import { SimpleModal } from '@/components/modals/Modal';
import { NotificationsProvider } from '@/components/notifications/NotificationsComponent';

import { Inter } from '@next/font/google'

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-inter'
})

function App({ Component, pageProps }: AppProps) {
    return (
        <main className={`${inter.variable} font-sans`}>
            <SessionProvider session={pageProps.session}>
                <NotificationsProvider>
                    <NavBar />
                    <Component  {...pageProps} />
                </NotificationsProvider>
            </SessionProvider>

            <SimpleModal />
        </main>
    )
}

export default trpc.withTRPC(App)