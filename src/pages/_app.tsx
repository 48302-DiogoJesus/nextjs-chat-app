import { AppProps, AppType } from 'next/app'
import '@/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import NavBar from '@/components/NavBar';
import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from '@chakra-ui/react'
import tailwindConfig from '../../tailwind.config.js'

import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import chakraTheme from '@chakra-ui/theme'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <NavBar />
            <Component {...pageProps} />
        </SessionProvider>
    )
}
