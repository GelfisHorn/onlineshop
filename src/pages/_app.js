import { Providers } from '@/app/providers'
import Script from 'next/script'

export default function MyApp({ Component, pageProps }) {
    return (
        <Providers>
            <Component {...pageProps} />
            <Script src={`https://www.paypal.com/sdk/js?currency=EUR&client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`}></Script>
        </Providers>
    )
}