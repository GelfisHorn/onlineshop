import axios from "axios";
import { useEffect, useState } from "react";
// Nextjs
import Image from "next/image";
// Components
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
// Hooks
import useAppContext from "@/hooks/useAppContext";
import useAuthHeaders from "@/hooks/useAuthHeaders";
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter";
import useGetLang from "@/hooks/useGetLang";
// Animations
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AccountOrders() {

    const { lang: contextLang } = useAppContext();

    const [ orders, setOrders ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    async function getOrders() {
        const config = useAuthHeaders();

        try {
            const { data } = await axios.post('/api/order/getOrders', config);
            setOrders(data.data);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrders();
    }, [])

    const CurrencyFormatter = (price, currency) => useCurrencyFormatter(currency).format(price);

    return (
        <ProtectedRoute>
            <Layout title={"Compras"}>
                <section className={"flex flex-col gap-16 py-16"}>
                    <h1 className={"text-4xl font-semibold"}>Ordenes</h1>
                    {orders && orders.length != 0 ? (
                        <div>
                            <div className={"flex items-center justify-between p-5 border-b"}>
                                <div className={"font-semibold text-lg"}>Orden</div>
                                <div className={"font-semibold text-lg"}>Estado</div>
                            </div>
                            <div className={"divide-y"}>
                                {orders.map(order => (
                                    <Order order={order} />
                                ))}
                            </div>
                        </div>
                    ) : (
                            <div className={"flex flex-col items-center gap-4 text-center"}>
                            <div className={"text-xl font-medium"}>Aún no tienes ordenes</div>
                            <Link href={`/${contextLang}/collections/all`} className={"flex items-center gap-2 text-main"}>
                                <i className="fa-light fa-arrow-left-long"></i>
                                <span className={"underline"}>Ver catálogo de productos</span>
                            </Link>
                        </div>
                    )}
                </section>
            </Layout>
        </ProtectedRoute>
    )
}

function Order({ order }) {

    const lang = useGetLang();

    const CurrencyFormatter = () => useCurrencyFormatter(order.currency).format(order.total);

    const [ showProducts, setShowProducts ] = useState(false);
    const handleShowProducts = () => setShowProducts(!showProducts);

    return (
        <div>
            <div onClick={handleShowProducts} className={`flex justify-between items-center p-5 hover:bg-neutral-100 cursor-pointer transition-colors select-none ${showProducts ? "border-b" : ""}`}>
                <div>
                    <div className={"flex items-center gap-1 text-lg"}>
                        <span>Orden:</span>
                        <span className={"font-semibold"}>#{order._id}</span>
                    </div>
                    <div className={"flex items-center gap-1 text-lg"}>
                        <span>Total:</span>
                        <span className={"font-semibold"}>{CurrencyFormatter()}</span>
                    </div>
                    <div className={"flex items-center gap-1 text-lg"}>
                        <span>Productos:</span>
                        <span className={"font-semibold"}>{order.products.length}</span>
                    </div>
                </div>
                <div className={"uppercase text-sm font-semibold"}>{lang.pages.orders.paymentStatus[order.status]}</div>
            </div>
            <AnimatePresence>
                {showProducts && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={"flex flex-col py-1 px-5 divide-y"}
                    >
                        {order.products.map(product => (
                            <Product product={product} currency={order.currency} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function Product({ product, currency }) {

    const { img, name, price, count } = product;

    const CurrencyFormatter = (price) => useCurrencyFormatter(currency).format(price);

    return (
        <div className={"flex items-center justify-between py-2"}>
            <div className={"flex items-center gap-5 w-full md:w-[60%]"}>
                <div className={"image-container overflow-hidden aspect-square rounded-md"} style={{ width: "100px" }}>
                    <Image className={"image"} src={img} fill />
                </div>
                <div className={"flex flex-col gap-2 justify-between h-full w-full"}>
                    <div className={"flex flex-col justify-between gap-2"}>
                        <div className={"flex justify-between gap-4"}>
                            <div className={"font-medium leading-5"}>{name}</div>
                        </div>
                        <div className={"flex items-start gap-1"}>
                            <span className={"font-semibold"}>{CurrencyFormatter(price)}</span>
                            <span className={"text-sm font-medium"}>{"(x1)"}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex flex-col h-full"}>
                <div className={"flex justify-end font-semibold"}>Total</div>
                <div className={"hidden md:block w-[15%] text-right"}>{CurrencyFormatter(price * count)}</div>
            </div>
        </div>
    )
}