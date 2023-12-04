import { Providers } from '@/app/providers'

export default function MyApp({ Component, pageProps }) {
    return (
        <Providers>
            <Component {...pageProps} />
        </Providers>
    )
}