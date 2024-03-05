import axios from 'axios';
// React
import { useEffect, useRef, useState } from 'react';
// Nextjs
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
// Styles
import styles from './Index.module.css';
// Hooks
import useGetLang from '@/hooks/useGetLang';
import useAppContext from '@/hooks/useAppContext';
import useClickOutside from '@/hooks/useClickOutside';
// Animations
import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';

const FLAGS_SRC = {
    baseUrl: "/flags",
    de: "/de.png",
    en: "/en.png",
    es: "/es.png",
    EUR: "/eur.png",
    USD: "/usd.png"
}

export default function Header() {

    const { lang: contextLang, cart, auth, darkMode, setDarkMode } = useAppContext();
    const lang = useGetLang();

    const [ announcementBar, setAnnouncementBar ] = useState("");
    async function getAnnounceBar(body) {
        try {
            const { data } = await axios.post('/api/strapi/announcement-bar', body);
            setAnnouncementBar(data?.data?.data?.attributes?.text);
        } catch (error) {
            return;
        }
    }

    useEffect(() => {
        if(!contextLang) return;
        getAnnounceBar({ locale: contextLang });
    }, [contextLang])

    const [ showMobileModal, setShowMobileModal ] = useState(false);

    const handleShowModal = () => {
        setShowMobileModal(!showMobileModal);

        if(showMobileModal) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    };

    const [ productsCount, setProductsCount ] = useState(0);

    useEffect(() => {
        setProductsCount(cart?.products?.length);

        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [cart]);

    const [ showAuthModal, setShowAuthModal ] = useState(false);

    const handleChangeTheme = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('theme', JSON.stringify(!darkMode));
    }

    return (
        <header className={darkMode ? "bg-dark-bg-primary" : "bg-light-bg-primary"}>
            {/* Store message */}
            {announcementBar && (
                <div className={"grid place-content-center py-2 px-5 bg-main text-white"}>
                    <span className={"font-medium text-sm md:text-base text-center"}>{announcementBar}</span>
                </div>
            )}
            <div className={`flex justify-between md:justify-normal h-20 border-b ${darkMode ? "border-dark-border" : "border-light-border"}`}>
                <Link href={`/${contextLang}`} className={"grid place-content-center w-40"}>
                    <Image src={"/logo.webp"} width={100} height={100} alt={"Logo"} />
                    {/* <span className={"font-semibold"}>ONLINESHOP.</span> */}
                </Link>
                <div className={`hidden md:grid place-content-center border-l border-r grow ${darkMode ? "border-dark-border" : "border-light-border"}`}>
                    <div className={"hidden md:flex items-center gap-16"}>
                        <Link href={`/${contextLang}/collections/wigs`} className={"hover:underline text-main transition-colors"}>{lang.header.wigs}</Link>
                        <Link href={`/${contextLang}/collections/extensions`} className={"hover:underline text-main transition-colors"}>{lang.header.extensions}</Link>
                    </div>
                </div>
                <div className={"flex items-center h-20"}>
                    <button onClick={handleChangeTheme} className={`${styles.cartButton} hidden md:grid place-content-center w-20 h-full text-2xl border-r ${darkMode ? "border-dark-border" : "border-light-border"}`}>
                        <i className={`fa-light ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
                    </button>
                    <Link href={`/${contextLang}/cart`} className={`${styles.cartButton} hidden md:grid place-content-center w-20 h-full border-r ${darkMode ? "border-dark-border" : "border-light-border"} transition-colors`}>
                        <div className={"text-2xl"}>
                            <i className="fa-light fa-bag-shopping relative">
                                {productsCount ? (
                                    <div className={`${styles.cartCount} grid place-content-center transition-colors rounded-full w-[1.15rem] h-[1.15rem]`}>{productsCount}</div>
                                ) : null}
                            </i>
                        </div>
                    </Link>
                    <div className={`relative ${styles.cartButton} hidden md:grid place-content-center w-20 h-full transition-colors`}>
                        <button onClick={() => setShowAuthModal(true)} className={"w-20 h-20"}>
                            <div className={"text-2xl"}>
                                <i className="fa-light fa-user relative"></i>
                            </div>
                        </button>
                        <AuthModal auth={auth} show={showAuthModal} setShow={setShowAuthModal} />
                    </div>
                    <button onClick={handleShowModal} className={`relative ${styles.cartButton} grid md:hidden place-content-center w-20 h-full transition-colors`}>
                        <div className={"text-2xl"}>
                            <i className="fa-light fa-bars relative"></i>
                        </div>
                    </button>
                </div>
            </div>
            <LangCurrencyCard />
            <AnimatePresence>
                {showMobileModal && (
                    <MobileMenu handleClose={handleShowModal} />
                )}
            </AnimatePresence>
        </header>
    )
}

function MobileMenu({ handleClose }) {

    const { lang: contextLang, auth, setAuth, darkMode, setDarkMode, cart } = useAppContext();
    const lang = useGetLang();

    function Button({ children, hover, href, handleClick }) {
        return href ? (
            <Link href={href} className={`underline hover:text-main transition-colors ${hover ? hover : "hover:bg-main hover:text-white"}`}>{children}</Link>
        ) : (
            <button onClick={handleClick} className={`underline hover:text-main transition-colors ${hover ? hover : "hover:bg-main hover:text-white"}`}>{children}</button>
        )
    }

    function handleLogOut() {
        setAuth({
            _id: "",
            name: "",
            surname: "",
            email: "",
            authenticated: false
        });
        Cookies.remove('token');
    }
    
    const [productsCount, setProductsCount] = useState(0);

    useEffect(() => {
        setProductsCount(cart?.products?.length);
    }, [cart]);

    const handleChangeTheme = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('theme', JSON.stringify(!darkMode));
    }

    return (
        <motion.div 
            className={`fixed top-0 right-0 w-screen h-screen ${darkMode ? "bg-dark-bg-primary text-dark-text-primary" : "bg-light-bg-primary text-light-text-primary"} no-scroll`}
            initial={{ opacity: 0, right: "-20vw" }}
            whileInView={{ opacity: 1, right: 0 }}
            exit={{ opacity: 0, right: "-20vw" }}
            style={{ zIndex: 101 }}
        >
            <div className={"flex flex-col justify-between h-full py-10"}>
                <button onClick={handleClose} className={"absolute top-2 right-3"}>
                    <i className="fa-sharp fa-solid fa-xmark text-3xl"></i>
                </button>
                <div className={"flex flex-col gap-10"}>
                    <div className={"grid place-content-center w-full"}>
                        <Image src={"/logo.webp"} width={150} height={100} alt={"Logo"} />
                        {/* <span className={"font-semibold text-2xl"}>ONLINESHOP.</span> */}
                    </div>
                    <div className={"flex flex-col items-center text-xl"}>
                        <div className={"flex flex-col gap-3 items-center py-6"}>
                            <Link href={`/${contextLang}/collections/wigs`} className={"underline hover:text-main transition-colors"}>{lang.header.wigs}</Link>
                            <Link href={`/${contextLang}/collections/extensions`} className={"underline hover:text-main transition-colors"}>{lang.header.extensions}</Link>
                        </div>
                        <div className={"flex flex-col gap-3 items-center border-y py-6"}>
                            {auth.authenticated ? (
                                <>
                                    <Button href={`/${contextLang}/account/profile`}>{lang.header.myProfile}</Button>
                                    <Button href={`/${contextLang}/account/orders`}>{lang.header.myPurchases}</Button>
                                </>
                            ) : (
                                <>
                                    <Button href={`/${contextLang}/login`}>{lang.header.login}</Button>
                                    <Button href={`/${contextLang}/register`}>{lang.header.register}</Button>
                                </>
                            )}
                        </div>
                        <div className={"flex flex-col justify-center items-center gap-8 py-6"}>
                            <div className={"flex items-center justify-center gap-8"}>
                                <button onClick={handleChangeTheme} className={`text-3xl`}>
                                    <i className={`fa-light ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
                                </button>
                                <Link href={`/${contextLang}/cart`} className={`grid place-content-center transition-colors hover:text-main`}>
                                    <div className={"text-3xl"}>
                                        <i className="fa-light fa-bag-shopping relative">
                                            {productsCount ? (
                                                <div className={`${styles.cartCount} grid place-content-center transition-colors rounded-full w-[1.15rem] h-[1.15rem]`}>{productsCount}</div>
                                            ) : null}
                                        </i>
                                    </div>
                                </Link>
                            </div>
                            {auth.authenticated ? (
                                <button onClick={handleLogOut} className={`flex items-center gap-2 transition-colors text-red-700`}>
                                    <span className={"font-semibold"}>Cerrar sesión</span>
                                    <i className="fa-solid fa-arrow-right-from-bracket text-xl"></i>
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function LangCurrencyCard() {

    const { lang: contextLang, setLang, currency, setCurrency, darkMode } = useAppContext();
    const lang = useGetLang();
    
    const modalRef = useRef(null);
    const [ showModal, setShowModal ] = useState(false);
    const handleShowModal = () => setShowModal(!showModal);

    const [ showLangModal, setShowLangModal ] = useState(false);
    const handleShowLangModal = () => setShowLangModal(!showLangModal);

    const [ showCurrencyModal, setShowCurrencyModal ] = useState(false);
    const handleShowCurrencyModal = () => setShowCurrencyModal(!showCurrencyModal);

    const handleSetLang = (lang) => {
        setLang(lang);
    }

    const handleSetCurrency = (currency) => {
        setCurrency(currency);
    }

    useClickOutside(modalRef, () => setShowModal(false));

    return (
        <div className={"fixed bottom-5 right-5"} style={{ zIndex: 101 }}>
            <div className={"relative"} ref={modalRef}>
                <button onClick={handleShowModal} className={`py-2 px-4 border rounded-md ${darkMode ? "border-dark-border bg-dark-bg-primary" : "border-light-border bg-light-bg-primary"}`}>
                    <div>
                        <div className={"flex items-center gap-2"}>
                            <Image className={"rounded-md"} width={25} height={16.699} src={`${FLAGS_SRC.baseUrl}${FLAGS_SRC[contextLang]}`} alt={"Flag image"} />
                            <span>{lang.header.langs[contextLang]} - {lang.header.currencies[currency]}</span>
                        </div>
                    </div>
                </button>
                {showModal && (
                    <div className={"absolute bottom-12 w-full"}>
                        <div className={`flex flex-col gap-4 py-4 px-4 border rounded-md ${darkMode ? "border-dark-border bg-dark-bg-primary" : "border-light-border bg-light-bg-primary"}`}>
                            <div className={"flex flex-col gap-2"}>
                                <span className={"font-medium"}>{lang.header.langs.language}</span>
                                <button onClick={handleShowLangModal} className={`flex items-center gap-2 py-2 px-3 border ${darkMode ? "border-dark-border" : "border-light-border"} rounded-md w-full`}>
                                    <Image className={"rounded-md"} width={25} height={16.699} src={`${FLAGS_SRC.baseUrl}${FLAGS_SRC[contextLang]}`} alt={"Flag image"} />
                                    <div className={"flex items-center justify-between w-full"}>
                                        <span>{lang.header.langs[contextLang]}</span>
                                        <i className="fa-light fa-angle-down"></i>
                                    </div>
                                </button>
                                {showLangModal && (
                                    <ModalLang
                                        selected={contextLang}
                                        options={[
                                            { text: lang.header.langs.de, img: `${FLAGS_SRC.baseUrl}${FLAGS_SRC.de}`, value: "de", },
                                            { text: lang.header.langs.en, img: `${FLAGS_SRC.baseUrl}${FLAGS_SRC.en}`, value: "en", },
                                            { text: lang.header.langs.es, img: `${FLAGS_SRC.baseUrl}${FLAGS_SRC.es}`, value: "es", }
                                        ]}
                                        setValue={handleSetLang}
                                        handleClose={handleShowLangModal}
                                        darkMode={darkMode}
                                    />
                                )}
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <span className={"font-medium"}>{lang.header.currencies.currency}</span>
                                <button onClick={handleShowCurrencyModal} className={`flex items-center gap-2 py-2 px-3 border ${darkMode ? "border-dark-border" : "border-light-border"} rounded-md w-full`}>
                                    <Image className={"rounded-md"} width={25} height={16.699} src={`${FLAGS_SRC.baseUrl}${FLAGS_SRC[currency]}`} alt={"Flag image"} />
                                    <div className={"flex items-center justify-between w-full"}>
                                        <span>{lang.header.currencies[currency]}</span>
                                        <i className="fa-light fa-angle-down"></i>
                                    </div>
                                </button>
                                {showCurrencyModal && (
                                    <ModalCurrency
                                        selected={currency}
                                        options={[
                                            { text: lang.header.currencies.EUR, img: `${FLAGS_SRC.baseUrl}${FLAGS_SRC.EUR}`, value: "EUR", },
                                            // { text: lang.header.currencies.USD, img: `${FLAGS_SRC.baseUrl}${FLAGS_SRC.USD}`, value: "USD", }
                                        ]}
                                        setValue={handleSetCurrency}
                                        handleClose={handleShowCurrencyModal}
                                        darkMode={darkMode}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function ModalLang({ options, selected, setValue, handleClose, darkMode }) {

    const router = useRouter();
    const modalRef = useRef(null);

    const handleSelectOption = (value) => {
        handleClose();
        setValue(value);
        localStorage.setItem('lang', value);
        router.push({ query: { ...router.query, lang: value } });
        return;
    }

    useClickOutside(modalRef, handleClose);

    return (
        <div ref={modalRef} className={`flex flex-col border ${darkMode ? "border-dark-border" : "border-light-border"} rounded-md overflow-hidden`}>
            {options.map((option, index) => (
                <button
                    onClick={() => handleSelectOption(option.value)} 
                    className={`flex items-center gap-2 ${darkMode ? "hover:bg-dark-bg-secondary" : "hover:bg-light-bg-secondary"} ${option.value == selected ? `${darkMode ? "bg-dark-bg-secondary" : "bg-light-bg-secondary"}` : ""} py-2 px-3`} 
                    key={index}
                >
                    <Image className={"rounded-md"} width={25} height={16.699} src={option.img} alt={"Flag image"} />
                    <span>{option.text}</span>
                </button>
            ))}
        </div>
    )
}

function ModalCurrency({ options, selected, setValue, handleClose, darkMode }) {

    const modalRef = useRef(null);

    const handleSelectOption = (value) => {
        handleClose();
        setValue(value);
        localStorage.setItem('currency', value);
    }

    useClickOutside(modalRef, handleClose);

    return (
        <div ref={modalRef} className={`flex flex-col border ${darkMode ? "border-dark-border" : "border-light-border"} rounded-md overflow-hidden`}>
            {options.map((option, index) => (
                <button
                    onClick={() => handleSelectOption(option.value)}
                    className={`flex items-center gap-2 ${darkMode ? "hover:bg-dark-bg-secondary" : "hover:bg-light-bg-secondary"} ${option.value == selected ? `${darkMode ? "bg-dark-bg-secondary" : "bg-light-bg-secondary"}` : ""} py-2 px-3`}
                    key={index}
                >
                    <Image className={"rounded-md"} width={25} height={16.699} src={option.img} alt={"Flag image"} />
                    <span>{option.text}</span>
                </button>
            ))}
        </div>
    )
}

function AuthModal({ show, setShow }) {
    
    const { lang: contextLang, auth, setAuth } = useAppContext();
    const { authenticated } = auth;
    const modalRef = useRef(null);
    
    function Button({ children, hover, href, handleClick }) {
        return href ? (
            <Link href={href} className={`py-3 px-5 text-center text-black ${hover ? hover : "hover:bg-main hover:text-white"} transition-colors whitespace-nowrap w-full`}>{children}</Link>
        ) : (
            <button onClick={handleClick} className={`py-3 px-5 text-center text-black ${hover ? hover : "hover:bg-main hover:text-white"} transition-colors whitespace-nowrap w-full`}>{children}</button>
        )
    }

    useClickOutside(modalRef, setShow)

    function handleLogOut() {
        setAuth({
            _id: "",
            name: "",
            surname: "",
            email: "",
            authenticated: false
        });
        Cookies.remove('token');
        setShow(false);
    }

    return show ? (
        <div ref={modalRef} className={"absolute top-20 right-0 border border-t-0 rounded-b-md bg-white z-20 overflow-hidden flex flex-col"}>
            {authenticated ? (
                <>
                    <Button href={`/${contextLang}/account/profile`}>Mi perfil</Button>
                    <Button href={`/${contextLang}/account/orders`}>Mis compras</Button>
                    <Button handleClick={handleLogOut} hover={"hover:bg-red-700 hover:text-white"}>Cerrar sesión</Button>
                </>
            ) : (
                <>
                    <Button href={`/${contextLang}/login`}>Iniciar sesión</Button>
                    <Button href={`/${contextLang}/register`}>Registrar cuenta</Button>
                </>
            )}
        </div>
    ) : null
}