// Nextjs
import Head from "next/head";
// Components
import Header from "./Header/Index";
import Footer from "./Footer";
// Styles
import '../app/globals.css'
// Hooks
import useAppContext from "@/hooks/useAppContext";

export default function Layout({ children, title }) {

    const { darkMode } = useAppContext();

    return (
        <>
            <Head>
                <title>{title} | Salon Wigs Eloisa</title>
            </Head>
            <div className={`${darkMode ? "bg-dark-bg-primary text-dark-text-primary" : "bg-light-bg-primary text-light-text-primary"}`}>
                <Header />
                {children}
                <Footer />
            </div>
        </>
    )
}