import '@/globals.css'

import { AppProps } from 'next/app';
import { SimpleModal } from '@/components/modals/Modal';

import { Inter } from '@next/font/google'
import { trpc } from '@/utils/trpc';
import { SessionProvider } from 'next-auth/react';
import { NotificationsProvider } from '@/components/notifications/NotificationsComponent';
import NavBar from '@/components/Layout/NavBar';

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
