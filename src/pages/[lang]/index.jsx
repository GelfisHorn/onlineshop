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

    const { lang: contextlang, darkMode } = useAppContext();
    const lang = useGetLang();

    const [ loading, setLoading ] = useState(true);
    const [ wigs, setWigs ] = useState([]);
    const [ extensions, setExtensions ] = useState([]);
    const [ collections, setCollections ] = useState([]);
    const [ announcementBar, setAnnouncementBar ] = useState("");

    function getProducts() {
        Promise.all([
            axios.post('/api/strapi/products/getByLimit', { category: 'wigs', limit: 6, locale: contextlang }),
            axios.post('/api/strapi/products/getByLimit', { category: 'extensions', limit: 6, locale: contextlang }),
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
        if(!contextlang) return;
        getProducts();
    }, [contextlang]);

    return (
        <Layout title={lang.pages.home.headTitle}>
            <Banner />
            <div className={`${darkMode ? "bg-dark-bg-secondary text-dark-text-primary" : "bg-light-bg-secondary text-light-text-primary"}`}>
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
                <Image className={"object-cover"} fill src={"/banner.jpg"} alt={"Banner image"} />
            </div>
            <div className={"absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-16 sm:w-1/2 text-white z-10 text-center"}>
                <div className={"flex flex-col gap-4 items-center"}>
                    <motion.div variants={item} className={"relative text-5xl leading-[3.5rem] font-semibold"}>{lang.pages.home.banner.title}</motion.div>
                    <motion.div variants={item}>{lang.pages.home.banner.subtitle}</motion.div>
                    <motion.div
                        variants={item}
                        className={"relative w-fit"}
                    >
                        <span className={"relative z-10 font-bold uppercase text-xl"}>
                            <Typewriter className={"block h-[24px]"} text={lang.pages.home.banner.slogan} delay={100} />
                        </span>
                        <div className={"absolute -bottom-1 md:bg-[rgba(255,255,255,.3)] h-3 w-full"}></div>
                    </motion.div>
                </div>
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
                className={"grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-16 gap-y-16"}
            >
                {products && products.map((p, index) => (
                    <Product key={index} product={p} />
                ))}
            </motion.div>
        </div>
    )
}

function AboutUs() {

    const { darkMode } = useAppContext();

    const lang = useGetLang();

    return (
        <section className={`flex flex-col items-center gap-6 text-center ${darkMode ? "bg-dark-bg-secondary text-dark-text-primary" : "bg-light-bg-secondary text-light-text-primary"}`}>
            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="visible"
                className={"flex flex-col items-center gap-10 md:w-2/3 2xl:w-1/2"}
            >
                <motion.div 
                    variants={item}
                    className={"relative text-4xl w-fit"}
                >
                    <span className={"relative z-10 font-semibold md:font-medium"}>{lang.pages.home.aboutUs.title}</span>
                    <div className={"absolute bottom-0 md:bg-[rgba(202,164,46,.5)] h-4 w-full"}></div>
                </motion.div>
                <motion.div variants={item} className={`flex flex-col gap-8 md:text-lg ${darkMode ? "text-dark-text-secondary" : "text-light-text-secondary"}`}>
                    <p className={"text-xl"}>{lang.pages.home.aboutUs.p1.text1} <span className={"text-main underline font-medium"}>{lang.pages.home.aboutUs.p1.text2}</span> {lang.pages.home.aboutUs.p1.text3}</p>

                    <div className={"flex flex-col gap-2"}>
                        <p>{lang.pages.home.aboutUs.p2.text1} <span className={"text-main font-medium"}>{lang.pages.home.aboutUs.p2.text2}</span> {lang.pages.home.aboutUs.p2.text3} {lang.pages.home.aboutUs.p2?.text4 ? (<span className={"underline font-medium"}>cabello 100% humano.</span>) : null}</p>

                        <div className={"flex flex-col gap-2"}>
                            <p><span className={"font-semibold"}>{lang.pages.home.aboutUs.p3.text1}</span> {lang.pages.home.aboutUs.p3.text2}</p>

                            <p><span className={"font-semibold"}>{lang.pages.home.aboutUs.p4.text1}</span> {lang.pages.home.aboutUs.p4.text2}</p>

                            <p><span className={"font-semibold"}>{lang.pages.home.aboutUs.p5.text1}</span> {lang.pages.home.aboutUs.p5.text2}</p>

                            <p><span className={"font-semibold"}>{lang.pages.home.aboutUs.p6.text1}</span> {lang.pages.home.aboutUs.p6.text2}</p>

                            <p><span className={"font-semibold"}>{lang.pages.home.aboutUs.p7.text1}</span> {lang.pages.home.aboutUs.p7.text2}</p>
                        </div>
                    </div>

                    <p>{lang.pages.home.aboutUs.p8.text1} <span className={"text-main font-medium"}>{lang.pages.home.aboutUs.p8.text2}</span>{lang.pages.home.aboutUs.p8.text3}</p>

                    <p>{lang.pages.home.aboutUs.p9.text1}<span className={"text-main font-medium"}>{lang.pages.home.aboutUs.p9.text2}</span>{lang.pages.home.aboutUs.p9.text3}</p>
                </motion.div>
            </motion.div>
        </section>
    )
}

const Typewriter = ({ className, text, delay }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const typeText = () => {
            if (!isDeleting && currentIndex < text.length) {
                const timeout = setTimeout(() => {
                    setCurrentText(prevText => prevText + text[currentIndex]);
                    setCurrentIndex(prevIndex => prevIndex + 1);
                }, delay);

                return () => clearTimeout(timeout);
            } else if (isDeleting && currentIndex >= 0) {
                const timeout = setTimeout(() => {
                    setCurrentText(prevText => prevText.slice(0, -1));
                    setCurrentIndex(prevIndex => prevIndex ? prevIndex - 1 : prevIndex);
                }, delay);

                if (currentIndex === 0) {
                    // Esperar 1 segundo antes de cambiar de borrar a escribir
                    setTimeout(() => setIsDeleting(false), 2000);
                }

                return () => clearTimeout(timeout);
            }

            if (currentIndex === text.length && !isDeleting) {
                // Esperar 1 segundo antes de cambiar de escribir a borrar
                setTimeout(() => setIsDeleting(true), 1000);
            }
        };

        typeText();
    }, [currentIndex, delay, isDeleting, text]);

    return <span className={className}>{currentText}</span>;
};