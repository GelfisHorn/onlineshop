import { useEffect, useState } from "react";
// Nextjs
import Image from "next/image";
import Link from "next/link";
// Components
import Layout from "@/components/Layout";
// Hooks
import useGetLang from "@/hooks/useGetLang";
import useAppContext from "@/hooks/useAppContext";
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter";

export default function Cart() {

    const { lang: contextLang, currency, cart, setCart } = useAppContext();
    const lang = useGetLang();

    const [ productsTotal, setProductsTotal ] = useState(0);

    const handleRemoveProduct = (id) => {
        const newCart = cart.filter(p => p.id != id);
        localStorage.setItem('cart', JSON.stringify(newCart));
        setCart(newCart);
    }

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart')) || []);
    }, [])

    useEffect(() => {
        if(!cart) return;
        const total = cart.reduce((total, product) => total + (product.count * product.price), 0);
        setProductsTotal(total);
    }, [cart])

    return (
        <Layout title={lang.pages.cart.headTitle}>
            <section className={"flex flex-col"}>
                <div className={"flex flex-col"}>
                    <div className={"flex items-center justify-between py-14 border-b"}>
                        <div className={"text-3xl font-semibold"}>{lang.pages.cart.headTitle}</div>
                        {cart && cart.length != 0 && (
                            <div className={"text-2xl font-semibold"}>{cart.length || 0} {lang.pages.cart.items}</div>
                        )}
                    </div>
                    {!cart || cart.length == 0 && (
                        <div className={"flex flex-col gap-3 items-center py-16"}>
                            <div className={"text-3xl"}>Aún has agregado productos</div>
                            <Link href={"#"} className={"flex items-center gap-2 text-main transition-colors"}>
                                <i className="fa-regular fa-arrow-left-long"></i>
                                <span className={"underline text-lg"}>Seguir comprando</span>
                            </Link>
                        </div>
                    )}
                    {cart && cart.length != 0 && (
                        <div className={"flex flex-col gap-8 py-8 border-b"}>
                            <div className={"flex items-center"}>
                                <div className={"w-[60%] uppercase text-sm font-medium"}>{lang.pages.cart.productDetails}</div>
                                <div className={"w-[25%] uppercase text-sm font-medium"}>{lang.pages.cart.amount}</div>
                                <div className={"w-[15%] uppercase text-sm font-medium text-right"}>{lang.pages.cart.total}</div>
                            </div>
                            {cart && cart.map(p => (
                                <Product key={p.id} p={p} updateProducts={setCart} handleRemove={handleRemoveProduct} />
                            ))}
                        </div>
                    )}
                </div>
                {cart && cart.length != 0 && (
                    <div className={"flex flex-col items-end gap-5 py-10"}>
                        <div className={"flex items-end gap-3"}>
                            <div className={"uppercase font-medium"}>{lang.pages.cart.total}</div>
                            <div>{useCurrencyFormatter(currency).format(productsTotal || 0)}</div>
                        </div>
                        <Link href={`/${contextLang}/checkout`} className={"w-fit px-16 py-3 bg-main hover:bg-main-hover transition-colors text-white rounded-sm"}>{lang.pages.cart.payButton}</Link>
                    </div>
                )}
            </section>
        </Layout>
    )
}

function Product({ p, updateProducts, handleRemove }) {

    const { currency } = useAppContext();
    const lang = useGetLang();

    const { id, name, description, img, count: productCount, price } = p;

    const [ count, setCount ] = useState(productCount);

    const handleSetCount = (count) => {
        const lsCart = localStorage.getItem('cart');
        const cart = JSON.parse(lsCart);

        const newCart = [...cart].map(product => {
            if(product.id == id) {
                return { ...product, count }
            }
            return product;
        })

        localStorage.setItem('cart', JSON.stringify(newCart));
        updateProducts(newCart);
        setCount(count);
    }

    return (
        <div className={"flex items-start justify-between"}>
            <div className={"flex items-start gap-5 w-[60%]"}>
                <div className={"image-container overflow-hidden aspect-square rounded-md"} style={{ width: "144px" }}>
                    <Image className={"image"} src={img} fill />
                </div>
                <div className={"flex flex-col justify-between h-full"}>
                    <div className={"flex flex-col"}>
                        <div className={"font-medium text-lg"}>{name}</div>
                        <div className={"font-semibold text-lg"}>{useCurrencyFormatter(currency).format(price)}</div>
                    </div>
                    <button onClick={() => handleRemove(id)} className={"font-medium w-fit text-red-700 hover:text-red-800 transition-colors"}>{lang.pages.cart.removeProduct}</button>
                </div>
            </div>
            <div className={"w-[25%]"}>
                <ProductCount count={count} setCount={handleSetCount} />
            </div>
            <div className={"w-[15%] text-right"}>{useCurrencyFormatter(currency).format(price * count)}</div>
        </div>
    )
}

function ProductCount({ count, setCount }) {

    const lang = useGetLang();

    const handleSum = () => {
        setCount(count + 1);
    };
    const handleSubtract = () => {
        if (count == 1) return;
        setCount(count - 1);
    };

    return (
        <div className={"flex border border-neutral-300 rounded-md h-12 w-fit overflow-hidden select-none"}>
            <button onClick={handleSubtract} className={"grid place-content-center w-12 hover:bg-main hover:text-white text-neutral-700 transition-colors"}><i className="fa-solid fa-minus text-sm"></i></button>
            <div className={"grid place-content-center w-12 font-medium"}>{count}</div>
            <button onClick={handleSum} className={"grid place-content-center w-12 hover:bg-main hover:text-white text-neutral-700 transition-colors"}><i className="fa-solid fa-plus text-sm"></i></button>
        </div>
    )
}