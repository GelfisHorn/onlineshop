// Nextjs
import Link from "next/link"
// Hooks
import useAppContext from "@/hooks/useAppContext"
import useGetLang from "@/hooks/useGetLang";

export default function Footer() {

    const { lang: contextLang, darkMode } = useAppContext();
    const lang = useGetLang();

    async function handleSubmit() {
        // ...
    }
    
    return (
        <footer className={`flex flex-col items-center border-t ${darkMode ? "border-dark-border" : "border-light-border"}`}>
            <div className={"flex flex-col lg:flex-row gap-10 lg:gap-0 items-start justify-between lg:px-40 py-20 w-fit lg:w-full"}>
                <Column title={lang.footer.columns.navigation.title} items={[
                    { name: lang.footer.columns.navigation.items.home, href: `/${contextLang}/` },
                    { name: lang.footer.columns.navigation.items.wigs, href: `/${contextLang}/collections/wigs` },
                    { name: lang.footer.columns.navigation.items.extensions, href: `/${contextLang}/collections/extensions` },
                ]} />
                <Column title={lang.footer.columns.legal.title} items={[
                    { name: lang.footer.columns.legal.items.impressum, href: `/${contextLang}/impressum` },
                    { name: lang.footer.columns.legal.items.datenschutz, href: `/${contextLang}/datenschutz` }
                ]} />
                <Column title={lang.footer.columns.socials.title} items={[
                    { name: lang.footer.columns.socials.items.facebook, href: `https://www.facebook.com/Eloisa.salas1`, target: "_blank", icon: "fa-brands fa-square-facebook" },
                    { name: lang.footer.columns.socials.items.instagram, href: `https://www.instagram.com/salonlatinoeloisa`, target: "_blank", icon: "fa-brands fa-instagram" },
                    { name: lang.footer.columns.socials.items.tiktok, href: `https://www.tiktok.com/@eloisasalas1`, target: "_blank", icon: "fa-brands fa-tiktok" }
                ]} />
            </div>
            <div className={"flex flex-col gap-20 w-full"}>
                <div className={"flex flex-col items-center lg:items-start gap-2 px-6 lg:px-40"}>
                    <h3 className={"font-medium text-center lg:text-left text-lg"}>{lang.footer.emailSubscribe}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={`border ${darkMode ? "border-dark-border" : "border-light-border"} sm:w-fit`}>
                            <input type="email" className={`${darkMode ? "bg-dark-bg-primary" : "bg-light-bg-primary"} h-10 outline-none px-3 sm:w-[300px]`} placeholder={lang.footer.emailPlaceholder} />
                            <button type={"submit"} className={"w-10 h-10"}><i className="fa-sharp fa-regular fa-arrow-right"></i></button>
                        </div>
                    </form>
                </div>
                <div className={`border-t ${darkMode ? "border-dark-border" : "border-light-border"} py-2 text-center w-full`}>
                    <span className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-light-text-secondary"}`}>© 2023 Salon Wigs Eloisa made by <Link target={"_blank"} className={"text-main underline"} href={"https://helphistech.com"}>HelphisTech</Link></span>
                </div>
            </div>
        </footer>
    )
}

function Column({ title, items }) {
    return (
        <div className={"flex flex-col gap-4 w-full lg:w-fit"}>
            <span className={"uppercase font-semibold text-lg text-center lg:text-left"}>{title}</span>
            <div className={"flex flex-col gap-1 items-center lg:items-start"}>
                {items.map((item, index) => (
                    <Link key={index} href={item.href} target={item.target || "_self"} className={"flex items-center gap-2 w-fit hover:text-main transition-colors"}>
                        {item.icon && <i className={`${item.icon} text-xl`} />}
                        <div className={"hover:underline"}>{item.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}