import { useEffect, useState } from "react";
// Nextjs
import Link from "next/link";
// Components
import CollectionsView from "@/components/CollectionsView";
import Layout from "@/components/Layout";
import Product from "@/components/Product/Index";
// Hooks
import useAppContext from "@/hooks/useAppContext";
import useGetLang from "@/hooks/useGetLang";
import axios from "axios";

export default function Home() {

    const lang = useGetLang();

    const [ loading, setLoading ] = useState(true);
    const [ wigs, setWigs ] = useState([]);
    const [ extensions, setExtensions ] = useState([]);

    function getProducts() {
        Promise.all([
            axios.post('/api/strapi/products/getByLimit', { category: 'wig', limit: 6 }),
            axios.post('/api/strapi/products/getByLimit', { category: 'extension', limit: 6 }),
        ]).then(res => {
            const wigs = res[0].data.data.data;
            const extensions = res[1].data.data.data;
            setWigs(wigs);
            setExtensions(extensions);
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
            <div className={"bg-[#FFFCF4] border-b"}>
                <Section title={lang.pages.home.sections.categories.title}>
                    <CollectionsView collections={[
                        { image: "/peluca.webp", name: lang.pages.home.sections.categories.wigs, href: "/wigs" },
                        { image: "/peluca.webp", name: lang.pages.home.sections.categories.extensions, href: "/extensions" }
                    ]} />
                </Section>
            </div>
            {wigs.length != 0 && (
                <Section title={lang.pages.home.sections.products.wigs.title}>
                    <ProductsView products={wigs} href={"wigs"} />
                </Section>
            )}
            {extensions.length != 0 && (
                <Section title={lang.pages.home.sections.products.extensions.title}>
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
        <div className={"relative"}>
            <div className={"h-[35rem] w-full bg-[rgba(0,0,0,.4)]"}></div>
            <div className={"absolute top-0 w-full h-full flex items-center justify-center text-white text-center"}>
                <div className={"flex flex-col items-center justify-center gap-7 w-1/2"}>
                    <div className={"text-5xl leading-[3.5rem]"}>{lang.pages.home.banner.title}</div>
                    <div className={""}>{lang.pages.home.banner.subtitle}</div>
                    <Link href={`/${contextLang}/collections/all`} className={"border w-fit px-6 py-2"}>{lang.pages.home.banner.button}</Link>
                </div>
            </div>
        </div>
    )
}

function Section({ title, subtitle, children }) {
    return (
        <section className={"flex flex-col gap-6"}>
            <div className={"flex flex-col gap-4"}>
                {title && <div className={"text-3xl"}>{title}</div>}
                {subtitle && <div className={"text-lg"}>{subtitle}</div>}
            </div>
            {children}
        </section>
    )
}

function ProductsView({ products, href }) {

    const { lang: contextlang } = useAppContext();
    const lang = useGetLang();

    return (
        <div className={"flex flex-col gap-16"}>
            <div className={"grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-6 gap-y-10"}>
                {products && products.map((p, index) => (
                    <Product key={index} product={p} />
                ))}
            </div>
            <div className={"flex justify-center"}>
                <Link className={"bg-main hover:bg-main-hover transition-colors text-white py-3 w-fit px-12 rounded-sm font-medium"} href={`/${contextlang}/collections/${href}`}>{lang.pages.home.sections.products.viewAll}</Link>
            </div>
        </div>
    )
}

function AboutUs() {

    const lang = useGetLang();

return (
        <section className={"flex flex-col items-center gap-6 text-center bg-[#FFFCF4] border-t"}>
            <div className={"flex flex-col items-center gap-6 md:w-2/3 2xl:w-1/2"}>
                <div className={"relative text-4xl w-fit"}>
                    <span className={"relative z-10 font-semibold md:font-medium"}>{lang.pages.home.aboutUs.title}</span>
                    <div className={"absolute bottom-0 md:bg-[rgba(202,164,46,.5)] h-4 w-full"}></div>
                </div>
                <div className={"md:text-lg text-neutral-700"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
            </div>
        </section>
    )
}