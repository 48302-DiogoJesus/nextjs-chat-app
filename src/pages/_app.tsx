import { AppProps, AppType } from 'next/app'
import '@/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import NavBar from '@/components/Layout/NavBar';
import { SessionProvider } from "next-auth/react"
import { trpc } from '../utils/trpc'
import { SimpleModal } from '@/components/modals/Modal';
import { NotificationsProvider } from '@/components/notifications/NotificationsComponent';

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <SessionProvider session={pageProps.session}>
                <NotificationsProvider>
                    <NavBar />
                    <Component  {...pageProps} />
                </NotificationsProvider>
            </SessionProvider>

            <SimpleModal />
        </>
    )
}

export default trpc.withTRPC(App)