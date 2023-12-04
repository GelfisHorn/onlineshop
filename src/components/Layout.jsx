// Nextjs
import Head from "next/head";
// Components
import Header from "./Header/Index";
import Footer from "./Footer";
// Styles
import '../app/globals.css'

export default function Layout({ children, title }) {


    return (
        <>
            <Head>
                <title>{title} | OnlineShop</title>
            </Head>
            <div>
                <Header />
                {children}
                <Footer />
            </div>
        </>
    )
}