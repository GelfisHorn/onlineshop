import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {

    return (
        <Html lang="en">
            <Head>
                <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.4.2/css/all.css" />
                <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.4.2/css/sharp-light.css" />
                <Script src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}`}></Script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}