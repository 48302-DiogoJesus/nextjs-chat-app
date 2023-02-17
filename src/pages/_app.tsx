import { AppProps, AppType } from 'next/app'
import '@/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import NavBar from '@/components/NavBar';
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <NavBar />
            <Component {...pageProps} />
        </SessionProvider>
    )
}
