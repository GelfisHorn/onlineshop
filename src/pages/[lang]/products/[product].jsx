import { useEffect, useState } from "react";
// Nextjs
import { useRouter } from "next/router"
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
// Mock data
import { products } from "@/mockData/products";

export default function ProductPage() {

    const router = useRouter();
    const { currency, setCart } = useAppContext();
    const { product: productId } = router.query;
    const [ product, setProduct ] = useState(products[0] || {});
    const lang = useGetLang();

    const handleFetchProduct = async () => {
        console.log('fetching product...')
    }

    useEffect(() => {
        handleFetchProduct();
    }, [])

    const [ productCount, setProductCount ] = useState(1);

    const handleAddToCart = () => {
        useAddToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            img: product.img,
            count: productCount 
        }, setCart);
    }

    return (
        <Layout title={lang.pages.product.headTitle}>
            <section className={"flex items-start pb-10"}>
                <div className={"flex flex-col gap-5 w-3/5"}>
                    <ProductImage />
                    <div className={"grid grid-cols-2 gap-5"}>
                        <ProductImage />
                        <ProductImage />
                    </div>
                </div>
                <div className={"w-2/5 px-10"}>
                    <div className={"flex flex-col gap-6"}>
                        <div className={"flex flex-col gap-1"}>
                            <span className={"uppercase font-medium"}>{lang.product.categories.wigs}</span>
                            <h2 className={"text-4xl"}>{product.name}</h2>
                        </div>
                        <div className={"flex flex-col"}>
                            <span className={""}>{lang.product.price}</span>
                            <span className={"text-2xl font-medium text-main"}>{useCurrencyFormatter(currency).format(product.price)}</span>
                        </div>
                        <ProductCount count={productCount} setCount={setProductCount} />
                        <div className={"flex flex-col gap-3"}>
                            <button onClick={handleAddToCart} className={"border border-main h-12 hover:bg-main hover:text-white text-main transition-colors rounded-md"}>{lang.product.addToCart}</button>
                            <button className={"h-12 bg-main text-white transition-all rounded-md"}>Comprar</button>
                            <PayPalButton />
                        </div>
                        <div className={"flex flex-col gap-1"}>
                            <span className={"text-lg uppercase font-medium"}>{lang.product.description}</span>
                            <p className={"text-neutral-600"}>{product.description}</p>
                        </div>
                        <div className={"flex flex-col"}>
                            <ProductDropdown icon={"fa-industry-windows"} title={"Material"}>
                                <div>asd</div>
                            </ProductDropdown>
                            <ProductDropdown icon={"fa-ruler"} title={"Tamaño"}>
                                <div>asd</div>
                            </ProductDropdown>
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
    return <div className={"bg-zinc-200 aspect-square rounded-md"}></div>
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