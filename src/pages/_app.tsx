import '@/globals.css'

import { AppProps } from 'next/app';
import { SimpleModal } from '@/components/modals/Modal';

import { Inter } from '@next/font/google'
import { useRef, useState } from 'react';
import { trpc } from '@/utils/trpc';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-inter'
})

function App({ Component, pageProps }: AppProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [data, setData] = useState<string[]>([])

    trpc.ws.onAdd.useSubscription(undefined, {
        onData: (msg) => {
            setData((data) => [...data, msg])
        }
    })
    const add = trpc.ws.add.useMutation()

    return (
        <main className={`${inter.variable} font-sans`}>
            <div>
                {data.map((message) => <div>{message}</div>)}
            </div>
            <input ref={inputRef} type="text" />
            <button onClick={() => {

                add.mutate(inputRef.current?.value ?? "No message")

            }}>ADD</button>
            {/* <SessionProvider session={pageProps.session}>
                <NotificationsProvider>
                    <NavBar />
                    <Component  {...pageProps} />
                </NotificationsProvider>
            </SessionProvider> */}

            <SimpleModal />
        </main>
    )
}

export default trpc.withTRPC(App)
