import axios from "axios";
// React
import { useEffect, useState } from "react";
// Nextjs
import { useRouter } from "next/router"
import Image from "next/image";
// Components
import Layout from "@/components/Layout"
// Hooks
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter";
import useAppContext from "@/hooks/useAppContext";
import useGetLang from "@/hooks/useGetLang";
import useAddToCart from "@/hooks/useAddToCart";
// Paypal
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
// Animations
import { AnimatePresence, motion } from "framer-motion";
// Carousel
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Markdown
import ReactMarkdown from 'react-markdown'
// Styles
import styles from './Product.module.css'
import TranslateText from "@/components/TranslateText";

const getWidth = () => (typeof window !== 'undefined') ? window.innerWidth : null;

export default function ProductPage() {

    const router = useRouter();
    const { lang: contextLang, currency, setCart, darkMode } = useAppContext();
    const { product: productId } = router.query;
    const [ product, setProduct ] = useState({});
    const [ variant, setVariant ] = useState({});
    const [ imgs, setImgs ] = useState([]);
    const [ selectedColor, setSelectedColor ] = useState({});
    const [ selectedEncaje, setSelectedEncaje ] = useState({});
    const [ price, setPrice ] = useState(0);
    // const [windowSize, setWindowSize] = useState(getWidth);
    const lang = useGetLang();

    const handleFetchProduct = async () => {
        try {
            const { data } = await axios.post('/api/strapi/products/getOneByUrl', { url: productId });
            setProduct(data.data?.data[0]);
            setVariant(data.data?.data[0]?.attributes.variante[0]);
            setSelectedColor(data.data?.data[0]?.attributes.colores[0] || data.data?.data[0]?.attributes.colores);
            setSelectedEncaje(data.data?.data[0]?.attributes.encaje[0] || data.data?.data[0]?.attributes.encaje);
            setImgs(data.data?.data[0]?.attributes?.img?.data);
        } catch (error) {
            return;
        }
    }

    useEffect(() => {
        if(!productId) return;
        handleFetchProduct();
    }, [productId])

    const [ productCount, setProductCount ] = useState(1);

    const HandleAddToCart = () => {
        const productData = {
            id: product.id,
            name: product.attributes.nombre,
            variants: product.attributes.variante,
            selectedVariant: variant,
            colores: product.attributes.colores,
            selectedColor,
            encaje: product.attributes.encaje,
            selectedEncaje,
            description: product.attributes.descripcion,
            img: imgs[0].attributes.formats.large.url,
            count: productCount
        }
        useAddToCart(productData, setCart);
    }
    
    /* useEffect(() => {
        const handleResize = () => {
            setWindowSize(getWidth());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); */

    function calculatePrice() {
        const colorPrice = selectedColor?.precio || 0;
        const encajePrice = selectedEncaje?.precio || 0;
        const variantPrice = variant.precio;

        setPrice((variantPrice + colorPrice + encajePrice) * productCount);
    }

    useEffect(() => {
        calculatePrice();
    }, [selectedColor, selectedEncaje, variant, productCount])

    return (
        <Layout title={lang.pages.product.headTitle}>
            <section className={"flex items-start flex-col xl:flex-row xl:gap-0 gap-10"}>
                <div className={"hidden xl:flex flex-col gap-36 w-3/5"}>
                    <div className={"flex flex-col gap-5"}>
                        <ProductImage img={imgs[0]?.attributes?.formats?.large?.url} />
                        {imgs[1] && (
                            <div className={"grid grid-cols-2 gap-5"}>
                                {imgs.map((img, index) => {
                                    if (index != 0) {
                                        return <ProductImage key={index} img={img.attributes.formats.large.url} />
                                    }
                                })}
                            </div>
                        )}
                    </div>
                    {product?.attributes?.collections?.data[0]?.attributes?.url == 'extensions' && (
                        <div className={`w-2/3 mx-auto ${styles.roulette}`} id={"colors"}>
                            <div className={"image-container"}>
                                <Image src={"/colors-roulette.jpg?v=1"} fill className={"image"} alt={"Colors roulette"} />
                            </div>
                        </div>
                    )}
                </div>
                <div className={"flex xl:hidden flex-col gap-5 w-full"}>
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar]}
                        slidesPerView={1}
                        spaceBetween={20}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        className={"w-full"}
                    >
                        <SwiperSlide>
                            <ProductImage img={imgs[0]?.attributes?.formats?.large?.url} />
                        </SwiperSlide>
                        {imgs[1] && (
                            imgs.map((img, index) => {
                                if (index != 0) {
                                    return (
                                        <SwiperSlide key={index}>
                                            <ProductImage img={img.attributes.formats.large.url} />
                                        </SwiperSlide>
                                    )
                                }
                            })
                        )}
                    </Swiper>
                </div>
                <div className={"w-full xl:w-2/5 xl:px-10"}>
                    <div className={"flex flex-col gap-6"}>
                        <div className={"flex flex-col gap-1"}>
                            <span className={"uppercase font-medium"}>{product?.attributes?.collections?.data[0]?.attributes?.nombre}</span>
                            <h2 className={"text-4xl"}>{product?.attributes?.nombre}</h2>
                        </div>
                        <div className={"flex flex-col"}>
                            <span className={""}>{lang.product.price}</span>
                            <span className={"text-2xl font-medium text-main"}>{useCurrencyFormatter(currency).format(price)}</span>
                        </div>
                        <ProductCount count={productCount} setCount={setProductCount} darkMode={darkMode} />
                        <ProductSize product={product} setVariant={setVariant} darkMode={darkMode} />
                        {product?.attributes?.collections?.data[0]?.attributes?.url == 'extensions' && (
                            <ProductColor product={product} setColor={setSelectedColor} darkMode={darkMode} />
                        )}
                        {product?.attributes?.collections?.data[0]?.attributes?.url == 'wigs' && (
                            <ProductEncaje product={product} selected={selectedEncaje} setEncaje={setSelectedEncaje} />
                        )}
                        <div className={"flex flex-col gap-3"}>
                            <button onClick={HandleAddToCart} className={"border border-main h-12 hover:bg-main hover:text-white text-main transition-colors rounded-md"}>{lang.product.addToCart}</button>
                            {/* <button className={"h-12 bg-main text-white transition-all rounded-md"}>Comprar</button> */}
                            {/* <PayPalButton /> */}
                        </div>
                        <div className={"flex flex-col gap-1"}>
                            <span className={"text-lg uppercase font-medium"}>{lang.product.description}</span>
                            <p className={`${darkMode ? "text-dark-text-secondary" : "text-light-text-secondary"}`}>{product?.attributes?.descripcion}</p>
                        </div>
                        <div className={"flex flex-col"}>
                            <ProductDropdown icon={"fa-industry-windows"} title={"Material"}>
                                {product?.attributes?.materiales && product?.attributes?.materiales.split('\n\n').map((section, index) => (
                                    <ReactMarkdown key={index} className={"strapi-markdown"}>{section}</ReactMarkdown>
                                ))}
                            </ProductDropdown>
                            <ProductDropdown icon={"fa-heart"} title={"Instrucciones de cuidado"}>
                                {product?.attributes?.cuidado && product?.attributes?.cuidado.split('\n\n').map((section, index) => (
                                    <ReactMarkdown key={index} className={"strapi-markdown"}>{section}</ReactMarkdown>
                                ))}
                            </ProductDropdown>
                            <ProductDropdown icon={"fa-truck"} title={"Envío y devolución"}>
                                {product?.attributes?.envioDevolucion && product?.attributes?.envioDevolucion.split('\n\n').map((section, index) => (
                                    <ReactMarkdown key={index} className={"strapi-markdown"}>{section}</ReactMarkdown>
                                ))}
                            </ProductDropdown>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

function ProductImage({ img }) {
    return img ? (
        <div className={"w-full h-full aspect-square overflow-hidden rounded-md border-[2px] border-main"}>
            <div className={"image-container h-full"}>
                <Image className={"image object-cover"} src={`${process.env.NEXT_PUBLIC_STRAPI_URI}${img}`} fill alt={"Product image"} />
            </div>
        </div>
    ) : (
        <div className={"grid place-content-center bg-zinc-100 aspect-square rounded-md border-[2px] border-main"}>
            <i className="fa-thin fa-image text-7xl text-neutral-300"></i>
        </div>
    )
}

function ProductCount({ count, setCount, darkMode }) {

    const lang = useGetLang();

    const handleSum = () => {
        setCount(count + 1);
    };
    const handleSubtract = () => {
        if(count == 1) return;
        setCount(count - 1);
    };

    return (
        <div className={"flex flex-col gap-1"}>
            <span>{lang.product.amount}</span>
            <div className={`flex border ${darkMode ? "border-dark-border" : "border-light-border"} rounded-md h-12 w-fit overflow-hidden select-none`}>
                <button onClick={handleSubtract} className={`grid place-content-center w-12 hover:bg-main hover:text-white ${darkMode ? "text-dark-text-secondary" : "text-light-text-secondary"} transition-colors`}><i className="fa-solid fa-minus text-sm"></i></button>
                <div className={"grid place-content-center w-12 font-medium"}>{count}</div>
                <button onClick={handleSum} className={`grid place-content-center w-12 hover:bg-main hover:text-white ${darkMode ? "text-dark-text-secondary" : "text-light-text-secondary"} transition-colors`}><i className="fa-solid fa-plus text-sm"></i></button>
            </div>
        </div>
    )
}

function ProductSize({ product, setVariant, darkMode }) {

    const lang = useGetLang();

    const variants = product?.attributes?.variante || [];

    const handleClickVariant = (variant) => {
        const newVariant = variants.find(e => e.id == variant);
        setVariant(newVariant);
    }

    return (
        <div className={"flex flex-col gap-1"}>
            <label htmlFor="product-size">{lang.product.size}</label>
            <select onChange={e => handleClickVariant(e.target.value)} id={"product-size"} className={`border ${darkMode ? "border-dark-border bg-dark-bg-primary" : "border-light-border bg-light-bg-primary"} rounded-md h-12 px-3 overflow-hidden select-none`}>
                {variants.map((variant, index) => (
                    <option key={index} value={variant.id}>{`${variant.pulgadas}"`}</option>
                ))}
            </select>
        </div>
    )
}

function ProductColor({ product, setColor, darkMode }) {

    const lang = useGetLang();

    const variants = product?.attributes?.colores || [];

    const handleClickVariant = (variant) => {
        const newVariant = variants.find(e => e.id == variant);
        setColor(newVariant);
    }

    return (
        <div className={"flex items-start gap-10"}>
            <div className={"flex flex-col gap-1 flex-1"} >
                <div className={"flex justify-between"}>
                    <label htmlFor="product-colors">{lang.product.color}</label>
                    <a href="#colors" className={"flex items-center gap-1 text-main"}>
                        <span className={"hover:underline"}>Ver colores</span>
                        <i className="fa-regular fa-angle-down"></i>
                    </a>
                </div>
                <select onChange={e => handleClickVariant(e.target.value)} id={"product-colors"} className={`border ${darkMode ? "border-dark-border bg-dark-bg-primary" : "border-light-border bg-light-bg-primary"} rounded-md h-12 px-3 overflow-hidden select-none`}>
                    {variants.map((variant, index) => (
                        <option key={index} value={variant.id}>{variant.nombre}</option>
                    ))}
                </select>
            </div>
        </div>
        
    )
}

function ProductEncaje({ product, selected, setEncaje }) {

    const lang = useGetLang();

    const variants = product?.attributes?.encaje || [];

    const handleClickVariant = (variant) => {
        const newVariant = variants.find(e => e.id == variant);
        setEncaje({});
        setEncaje(newVariant);
    }

    return (
        <div className={"flex flex-col gap-1"}>
            <div>{lang.product.encaje}</div>
            <div className={"flex items-start gap-2"}>
                {variants.map((variant, index) => (
                    <button 
                        key={index}
                        onClick={() => handleClickVariant(variant.id)} 
                        className={`border rounded-lg py-1 px-3 ${selected.id === variant.id ? "bg-main text-white" : "hover:bg-main hover:text-white"} transition-colors font-medium`}
                    >
                        <span>{variant.nombre}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function ProductDropdown({ icon, title, children }) {

    const [ showContent, setShowContent ] = useState(false);

    const handleShowContent = () => setShowContent(!showContent);

    return (
        <div className={"border-t"}>
            <button onClick={handleShowContent} className={"flex items-center justify-between w-full py-3 px-3 hover:bg-main hover:text-white transition-colors"}>
                <div className={"flex items-center gap-3"}>
                    <i className={`fa-light ${icon} text-xl`}></i>
                    <span>{title}</span>
                </div>
                <i className="fa-light fa-angle-down"></i>
            </button>
            <AnimatePresence>
                {showContent && (
                    <motion.div
                        className={"p-3"}
                        initial={{ opacity: 0, top: "-5px" }}
                        whileInView={{ opacity: 1, top: "0" }}
                        exit={{ opacity: 0, top: "-5px" }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function PayPalButton() {
    return (
        <PayPalScriptProvider
            options={{
                'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: 'USD',
                intent: 'capture'
            }}
        >
            <PayPalButtons
                style={{
                    color: 'gold',
                    shape: 'rect',
                    label: 'pay',
                    height: 50
                }}
                createOrder={async (data, actions) => {
                    let order_id = await paypalCreateOrder()
                    return order_id + ''
                }}
                onApprove={async (data, actions) => {
                    let response = await paypalCaptureOrder(data.orderID)
                    if (response) return true
                }}
            />
        </PayPalScriptProvider>
    )
}