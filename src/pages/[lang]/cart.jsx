import axios from "axios";
// React
import { useEffect, useMemo, useState } from "react";
// Nextjs
import Image from "next/image";
import Link from "next/link";
// Components
import Layout from "@/components/Layout";
// Hooks
import useGetLang from "@/hooks/useGetLang";
import useAppContext from "@/hooks/useAppContext";
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter";
import { toast, Toaster } from "react-hot-toast";

export default function Cart() {

    const { lang: contextLang, currency, cart, setCart } = useAppContext();
    const lang = useGetLang();

    const [ discountCode, setDiscountCode ] = useState({ code: "", discount: 0 });
    const [ productsTotal, setProductsTotal ] = useState(0);
    const [ discountPrice, setDiscountPrice ] = useState(0);

    const handleRemoveProduct = (id) => {
        const newCart = cart.products.filter(p => p.id != id);
        localStorage.setItem('cart', JSON.stringify({ ...cart, products: newCart }));
        setCart(current => { return { ...current, products: newCart } });
    }

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart')) || {
            products: [],
            discountCode: ""
        });
    }, [])

    useEffect(() => {
        if(!cart) return;
        const total = cart?.products?.reduce((total, product) => total + ((product.selectedVariant.precio + (product.selectedColor?.precio || 0) + (product.selectedEncaje?.precio || 0)) * product.count), 0);
        setProductsTotal(total);
    }, [cart])

    const CurrencyFormatter = (price) => useCurrencyFormatter(currency).format(price);

    async function handleSubmit(e) {
        e.preventDefault();
        if (cart.discountCode) {
            toast.error(lang.notifications.error.alreadyHasDiscountCode, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            })
            return;
        }

        const res = await handleCheckCode(discountCode.code);
        if(res) {
            toast.success(lang.notifications.success.discountCode, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        } else {
            toast.error(lang.notifications.error.discountCode, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        }
    }

    async function handleCheckCode(code) {
        if(!code) return;

        try {
            const { data } = await axios.post('/api/strapi/discount-codes/getOne', { code });
            setCart(current => { return { ...current, discountCode: code }});
            localStorage.setItem('cart', JSON.stringify({ ...cart, discountCode: code }));
            setDiscountCode(current => { return { ...current, discount: data.data.data[0].attributes.descuento }});
            setDiscountPrice(productsTotal - ((productsTotal * discountCode.discount) / 100))
            return true;
        } catch (error) {
            setCart(current => { return { ...current, discountCode: "" }});
            localStorage.setItem('cart', JSON.stringify({ ...cart, discountCode: "" }));
            return false;
        }
    }

    useMemo(() => handleCheckCode(cart.discountCode), [cart.discountCode]);

    useEffect(() => {
        if(!discountCode.discount || !productsTotal) return;
        setDiscountPrice(productsTotal - ((productsTotal * discountCode.discount) / 100))
    }, [discountCode, productsTotal])

    return (
        <Layout title={lang.pages.cart.headTitle}>
            <Toaster />
            <section className={"flex flex-col"}>
                <div className={"flex flex-col"}>
                    <div className={"flex flex-col md:flex-row gap-4 md:gap-0 md:items-center justify-between py-14 border-b"}>
                        <div className={"text-3xl font-semibold"}>{lang.pages.cart.headTitle}</div>
                        {cart && cart?.products?.length != 0 && (
                            <div className={"text-xl md:text-2xl font-semibold"}>{cart?.products?.length || 0} {lang.pages.cart.items}</div>
                        )}
                    </div>
                    {!cart || cart?.products?.length == 0 && (
                        <div className={"flex flex-col gap-3 items-center py-16"}>
                            <div className={"text-2xl sm:text-3xl text-center"}>{lang.pages.cart.emptyCart}</div>
                            <Link href={`/${contextLang}/collections/all`} className={"flex items-center gap-2 text-main transition-colors"}>
                                <i className="fa-regular fa-arrow-left-long"></i>
                                <span className={"underline text-lg"}>{lang.pages.cart.goShop}</span>
                            </Link>
                        </div>
                    )}
                    {cart && cart?.products?.length != 0 && (
                        <div className={"flex flex-col gap-8 py-8 border-b"}>
                            <div className={"flex items-center justify-between md:justify-start"}>
                                <div className={"md:w-[45%] uppercase text-sm font-medium"}>{lang.pages.cart.productDetails}</div>
                                <div className={"hidden md:block w-[20%] uppercase text-sm font-medium"}>{lang.pages.cart.size}</div>
                                <div className={"hidden md:block w-[20%] uppercase text-sm font-medium"}>{lang.pages.cart.amount}</div>
                                <div className={"md:w-[15%] uppercase text-sm font-medium text-right"}>{lang.pages.cart.total}</div>
                            </div>
                            {cart && cart?.products?.map(p => (
                                <Product key={p.id} p={p} updateProducts={setCart} handleRemove={handleRemoveProduct} />
                            ))}
                        </div>
                    )}
                </div>
                {cart && cart?.products?.length != 0 && (
                    <div className={"flex flex-col items-start md:items-end gap-8 py-10"}>
                        <form onSubmit={handleSubmit} className={"flex flex-col items-end gap-1"}>
                            <label htmlFor="discount-code" className={"font-medium"}>Código de descuento</label>
                            <div className={"flex gap-1"}>
                                <input value={discountCode.code} onChange={e => setDiscountCode(current => { return { ...current, code: e.target.value } })} required={true} type="text" id="discount-code" className={"h-12 px-3 border rounded-sm outline-none"} placeholder={"Código de descuento"} />
                                <button type="submit" className={"bg-main h-12 px-3 text-white hover:bg-main-hover transition-colors rounded-sm"}>Aplicar</button>
                            </div>
                        </form>
                        <div className={"flex flex-col items-start md:items-end gap-4"}>
                            <div className={"flex items-end gap-3"}>
                                <div className={"uppercase font-medium"}>{lang.pages.cart.total}</div>
                                <div className={"flex flex-col items-end"}>
                                    {discountCode.discount ? (
                                        <>
                                            <div className={"line-through text-red-400 font-medium"}>{CurrencyFormatter(productsTotal || 0)}</div>
                                            <div className={"flex items-center gap-1"}>
                                                <span className={"font-medium"}>{CurrencyFormatter(discountPrice || 0)}</span>
                                                <span className={"text-sm"}>{`(-${discountCode.discount}%)`}</span>
                                            </div>
                                        </>
                                    ) : <div className={"font-medium"}>{CurrencyFormatter(productsTotal || 0)}</div>}
                                </div>
                            </div>
                            <Link href={`/${contextLang}/checkout`} className={"w-fit px-16 py-3 bg-main hover:bg-main-hover transition-colors text-white rounded-sm"}>{lang.pages.cart.payButton}</Link>
                        </div>
                    </div>
                )}
            </section>
        </Layout>
    )
}

function Product({ p, updateProducts, handleRemove }) {

    const { currency } = useAppContext();
    const lang = useGetLang();

    const { id, name, img, count: productCount, selectedColor, selectedEncaje } = p;

    const [ variants, setVariants ] = useState(p.variants);
    const [ selectedVariant, setSelectedVariant ] = useState(p.selectedVariant);
    const [ price, setPrice ] = useState(0);
    const [ count, setCount ] = useState(productCount);

    const handleSetCount = (count) => {
        const lsCart = localStorage.getItem('cart');
        const cart = JSON.parse(lsCart);

        const newCart = [...cart.products].map(product => {
            if(product.id == id) {
                return { ...product, count }
            }
            return product;
        })

        localStorage.setItem('cart', JSON.stringify({ ...cart, products: newCart }));
        updateProducts(current => { return { ...current, products: newCart } });
        setCount(count);
    }

    function calculatePrice() {
        const colorPrice = selectedColor?.precio || 0;
        const encajePrice = selectedEncaje?.precio || 0;
        const variantPrice = selectedVariant.precio;

        setPrice((variantPrice + colorPrice + encajePrice) * productCount);
    }

    const handleSetSize = (variant) => {
        const lsCart = localStorage.getItem('cart');
        const cart = JSON.parse(lsCart);

        const newCart = [...cart.products].map(product => {
            if (product.id == id) {
                return { ...product, selectedVariant: variant }
            }
            return product;
        })

        localStorage.setItem('cart', JSON.stringify({ ...cart, products: newCart }));
        updateProducts(current => { return { ...current, products: newCart } });
        setSelectedVariant(variant);
    }

    const CurrencyFormatter = (price) => useCurrencyFormatter(currency).format(price);

    useEffect(() => {
        calculatePrice();
    }, [])

    return (
        <div className={"flex items-start justify-between"}>
            <div className={"flex flex-col gap-5 w-full md:w-[45%]"}>
                <div className={"flex items-start gap-5"}>
                    <div className={"image-container overflow-hidden aspect-square rounded-md"} style={{ width: "144px" }}>
                        <Image className={"image"} src={`${process.env.NEXT_PUBLIC_STRAPI_URI}${img}`} fill alt={"Product image"} />
                    </div>
                    <div className={"flex flex-col gap-2 justify-between h-full w-full"}>
                        <div className={"flex flex-col gap-2"}>
                            <div className={"flex justify-between gap-4"}>
                                <div className={"font-medium text-lg leading-5"}>{name}</div>
                                <div className={"block md:hidden"}>{CurrencyFormatter(price)}</div>
                            </div>
                            {selectedColor?.id && (
                                <div>
                                    <span>{lang.pages.cart.color}: <span className={"font-semibold"}>{selectedColor.nombre}</span></span>
                                </div>
                            )}
                            {selectedEncaje?.id && (
                                <div>
                                    <span>{lang.pages.cart.encaje}: <span className={"font-semibold"}>{selectedEncaje.nombre}</span></span>
                                </div>
                            )}
                            <div className={"font-semibold text-lg"}>{CurrencyFormatter(price)}</div>
                        </div>
                        <button onClick={() => handleRemove(id)} className={"font-medium w-fit text-red-700 hover:text-red-800 transition-colors"}>{lang.pages.cart.removeProduct}</button>
                    </div>
                </div>
                <div className={"flex items-center justify-between"}>
                    <div className={"block md:hidden"}><ProductSize variants={variants} setVariant={handleSetSize} /></div>
                    <div className={"block md:hidden"}><ProductCount count={count} setCount={handleSetCount} /></div>
                </div>
            </div>
            <div className={"hidden md:block w-[20%]"}>
                <ProductSize variants={variants} setVariant={handleSetSize} />
            </div>
            <div className={"hidden md:block w-[20%]"}>
                <ProductCount count={count} setCount={handleSetCount} />
            </div>
            <div className={"hidden md:block w-[15%] text-right font-semibold"}>{CurrencyFormatter(price)}</div>
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

function ProductSize({ variants, setVariant }) {

    const lang = useGetLang();

    const handleClickVariant = (variant) => {
        const newVariant = variants.find(e => e.id == variant);
        setVariant(newVariant);
    }

    return (
        <select onChange={e => handleClickVariant(e.target.value)} id={"product-size"} className={"border border-neutral-300 rounded-md h-12 px-3 overflow-hidden select-none"}>
            {variants.map((variant, index) => (
                <option key={index} value={variant.id}>{`${variant.pulgadas}"`}</option>
            ))}
        </select>
    )
}