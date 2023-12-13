import axios from "axios";
// React
import { useEffect, useState } from "react";
// Nextjs
import Image from "next/image";
import Link from "next/link";
// Components
import CollectionsView from "@/components/CollectionsView";
import Layout from "@/components/Layout";
import Product from "@/components/Product/Index";
// Hooks
import useAppContext from "@/hooks/useAppContext";
import useGetLang from "@/hooks/useGetLang";
// Animations
import { motion } from "framer-motion";
const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.1,
            staggerChildren: 0.1
        }
    }
};
const item = {
    hidden: { x: 20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1
    }
};

export default function Home() {

    const { lang: contextlang } = useAppContext();
    const lang = useGetLang();

    const [ loading, setLoading ] = useState(true);
    const [ wigs, setWigs ] = useState([]);
    const [ extensions, setExtensions ] = useState([]);
    const [ collections, setCollections ] = useState([]);
    const [ announcementBar, setAnnouncementBar ] = useState("");

    function getProducts() {
        Promise.all([
            axios.post('/api/strapi/products/getByLimit', { category: 'wigs', limit: 6 }),
            axios.post('/api/strapi/products/getByLimit', { category: 'extensions', limit: 6 }),
            axios.post('/api/strapi/collections/getAll')
        ]).then(res => {
            const wigs = res[0]?.data?.data?.data;
            const extensions = res[1]?.data?.data?.data;
            const collections = res[2]?.data?.data?.data;
            setWigs(wigs);
            setExtensions(extensions);
            setCollections(collections);
        }).catch(err => {
            return;
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <Layout title={lang.pages.home.headTitle}>
            <Banner />
            <div className={"bg-[#fffbf1]"}>
                <Section title={lang.pages.home.sections.categories.title}>
                    <CollectionsView collections={collections} />
                </Section>
            </div>
            {wigs.length != 0 && (
                <Section title={lang.pages.home.sections.products.wigs.title} viewAllHref={`/${contextlang}/collections/wigs`} >
                    <ProductsView products={wigs} href={"wigs"} />
                </Section>
            )}
            {extensions.length != 0 && (
                <Section title={lang.pages.home.sections.products.extensions.title} viewAllHref={`/${contextlang}/collections/extensions`}>
                    <ProductsView products={extensions} href={"extensions"} />
                </Section>
            )}
            <AboutUs />
        </Layout>
    )
}

function Banner() {

    const { lang: contextLang } = useAppContext();
    const lang = useGetLang();

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            whileInView="visible"
            className={"relative"}
        >
            <div 
                className={"image-container h-[35rem] overflow-hidden"}
            >
                <div className={"w-full h-full bg-[rgba(0,0,0,.4)] relative z-10"}></div>
                <Image className={"object-cover"} fill src={"/banner.jpg"} />
            </div>
            <div className={"absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-7 sm:w-1/2 text-white z-10 text-center"}>
                <motion.div variants={item} className={"relative text-5xl leading-[3.5rem]"}>{lang.pages.home.banner.title}</motion.div>
                <motion.div variants={item}>{lang.pages.home.banner.subtitle}</motion.div>
                <motion.div variants={item}><Link href={`/${contextLang}/collections/all`} className={"border w-fit px-6 py-3 hover:border-main hover:text-white hover:bg-main transition-colors rounded-sm"}>{lang.pages.home.banner.button}</Link></motion.div>
            </div>
        </motion.div>
    )
}

function Section({ title, subtitle, viewAllHref, children }) {

    const lang = useGetLang();
    
    return (
        <section className={"flex flex-col gap-6"}>
            <div className={"flex items-start justify-between"}>
                <div className={"flex flex-col gap-4"}>
                    {title && <div className={"text-3xl"}>{title}</div>}
                    {subtitle && <div className={"text-lg"}>{subtitle}</div>}
                </div>
                {viewAllHref && (
                    <Link className={"flex items-center gap-2 transition-colors text-main hover:text-main-hover font-medium"} href={viewAllHref}>
                        <span className={"underline"}>{lang.pages.home.sections.products.viewAll}</span>
                        <i className="fa-light fa-arrow-right-long"></i>
                    </Link>
                )}
            </div>
            {children}
        </section>
    )
}

function ProductsView({ products, href }) {

    return (
        <div className={"flex flex-col gap-16"}>
            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="visible"
                className={"grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-6 gap-y-10"}
            >
                {products && products.map((p, index) => (
                    <Product key={index} product={p} />
                ))}
            </motion.div>
        </div>
    )
}

function AboutUs() {

    const lang = useGetLang();

    return (
        <section className={"flex flex-col items-center gap-6 text-center bg-[#fffbf1]"}>
            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="visible"
                className={"flex flex-col items-center gap-6 md:w-2/3 2xl:w-1/2"}
            >
                <motion.div 
                    variants={item}
                    className={"relative text-4xl w-fit"}
                >
                    <span className={"relative z-10 font-semibold md:font-medium"}>{lang.pages.home.aboutUs.title}</span>
                    <div className={"absolute bottom-0 md:bg-[rgba(202,164,46,.5)] h-4 w-full"}></div>
                </motion.div>
                <motion.div variants={item} className={"md:text-lg text-neutral-700"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</motion.div>
            </motion.div>
        </section>
    )
}