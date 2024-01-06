import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {

    return (
        <Html lang="en">
            <Head>
                <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.4.2/css/all.css" />
                <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.4.2/css/sharp-light.css" />
                <link rel="icon" type="image/png" href="/favicon.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}