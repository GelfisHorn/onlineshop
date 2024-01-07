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

const getWidth = () => (typeof window !== 'undefined') ? window.innerWidth : null;

export default function ProductPage() {

    const router = useRouter();
    const { currency, setCart } = useAppContext();
    const { product: productId } = router.query;
    const [ product, setProduct ] = useState({});
    const [ variant, setVariant ] = useState({});
    const [ imgs, setImgs ] = useState([]);
    const [windowSize, setWindowSize] = useState(getWidth);
    const lang = useGetLang();

    const handleFetchProduct = async () => {
        try {
            const { data } = await axios.post('/api/strapi/products/getOneByUrl', { url: productId });
            setProduct(data.data?.data[0]);
            setVariant(data.data?.data[0]?.attributes.variante[0]);
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
            description: product.attributes.descripcion,
            img: imgs[0].attributes.formats.large.url,
            count: productCount
        }
        useAddToCart(productData, setCart);
    }
    
    useEffect(() => {
        const handleResize = () => {
            setWindowSize(getWidth());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Layout title={lang.pages.product.headTitle}>
            <section className={"flex items-start flex-col xl:flex-row xl:gap-0 gap-10"}>
                <div className={"hidden xl:flex flex-col gap-5 w-3/5"}>
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
                                        <SwiperSlide>
                                            <ProductImage key={index} img={img.attributes.formats.large.url} />
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
                            <span className={"text-2xl font-medium text-main"}>{useCurrencyFormatter(currency).format(variant.precio)}</span>
                        </div>
                        <ProductCount count={productCount} setCount={setProductCount} />
                        <ProductSize product={product} setVariant={setVariant} />
                        <div className={"flex flex-col gap-3"}>
                            <button onClick={HandleAddToCart} className={"border border-main h-12 hover:bg-main hover:text-white text-main transition-colors rounded-md"}>{lang.product.addToCart}</button>
                            {/* <button className={"h-12 bg-main text-white transition-all rounded-md"}>Comprar</button> */}
                            {/* <PayPalButton /> */}
                        </div>
                        <div className={"flex flex-col gap-1"}>
                            <span className={"text-lg uppercase font-medium"}>{lang.product.description}</span>
                            <p className={"text-neutral-600"}>{product?.attributes?.descripcion}</p>
                        </div>
                        <div className={"flex flex-col"}>
                            <ProductDropdown icon={"fa-industry-windows"} title={"Material"}>
                                <div>asd</div>
                            </ProductDropdown>
                            {/* <ProductDropdown icon={"fa-ruler"} title={"Tamaño"}>
                                <div>asd</div>
                            </ProductDropdown> */}
                            <ProductDropdown icon={"fa-heart"} title={"Instrucciones de cuidado"}>
                                <div>asd</div>
                            </ProductDropdown>
                            <ProductDropdown icon={"fa-truck"} title={"Envío y devolución"}>
                                <div>asd</div>
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
        <div className={"w-full h-full aspect-square overflow-hidden rounded-md"}>
            <div className={"image-container h-full"}>
                <Image className={"image object-cover"} src={`${process.env.NEXT_PUBLIC_STRAPI_URI}${img}`} fill alt={"Product image"} />
            </div>
        </div>
    ) : <div className = { "bg-zinc-200 aspect-square rounded-md" }></div >
}

function ProductCount({ count, setCount }) {

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
            <div className={"flex border border-neutral-300 rounded-md h-12 w-fit overflow-hidden select-none"}>
                <button onClick={handleSubtract} className={"grid place-content-center w-12 hover:bg-main hover:text-white text-neutral-700 transition-colors"}><i className="fa-solid fa-minus text-sm"></i></button>
                <div className={"grid place-content-center w-12 font-medium"}>{count}</div>
                <button onClick={handleSum} className={"grid place-content-center w-12 hover:bg-main hover:text-white text-neutral-700 transition-colors"}><i className="fa-solid fa-plus text-sm"></i></button>
            </div>
        </div>
    )
}

function ProductSize({ product, setVariant }) {

    const lang = useGetLang();

    const variants = product?.attributes?.variante || [];

    const handleClickVariant = (variant) => {
        const newVariant = variants.find(e => e.id == variant);
        setVariant(newVariant);
    }

    return (
        <div className={"flex flex-col gap-1"}>
            <label htmlFor="product-size">{lang.product.size}</label>
            <select onChange={e => handleClickVariant(e.target.value)} id={"product-size"} className={"border border-neutral-300 rounded-md h-12 px-3 overflow-hidden select-none"}>
                {variants.map((variant, index) => (
                    <option key={index} value={variant.id}>{`${variant.desdePulgadas}" - ${variant.hastaPulgadas}"`}</option>
                ))}
            </select>
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