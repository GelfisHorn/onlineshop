import axios from "axios";
import { useEffect, useMemo, useState } from "react";
// Nextjs
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
// Components
import Layout from "@/components/Layout";
import PayPalButton from "@/components/PayPalButton";
// Hooks
import useAppContext from "@/hooks/useAppContext";
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter";
import useGetLang from "@/hooks/useGetLang";
// Notifications
import toast, { Toaster } from 'react-hot-toast';
// Animations
import { AnimatePresence, motion } from "framer-motion";

export default function CheckOut() {

    const router = useRouter();
    const { lang: contextLang, cart, setCart, currency, auth, darkMode } = useAppContext();
    const lang = useGetLang();

    const [ shipping, setShipping ] = useState({
        name: "",
        surname: "",
        email: "",
        country: "de",
        address: "",
        postalCode: "",
        city: "",
        phoneNumber: ""
    })
    const [ paymentDetails, setPaymentDetails ] = useState({});
    const [ discountCode, setDiscountCode ] = useState({ discount: 0 })
    const [ total, setTotal ] = useState(0);
    const [ discountPrice, setDiscountPrice ] = useState(0);
    const [ finalPrice, setFinalPrice ] = useState(0);

    const handleSubmit = async () => {
        if(cart?.products?.length == 0) return;

        const products = cart.products.map(p => {
            return {
                id: p.id,
                name: p.name,
                img: p.img,
                description: p.description,
                price: p.selectedVariant.precio,
                count: p.count,
                wigInch: p.selectedVariant.pulgadas,
                wigLace: p.selectedEncaje,
                wigColor: p.selectedColor,
            }
        });

        const order = {
            products,
            shipping,
            payments: paymentDetails.purchase_units[0].payments,
            total: finalPrice,
            currency,
            discountCode: cart.discountCode,
            status: paymentDetails.status
        }

        try {
            await axios.post('/api/order/create', order);
            resetForm();
            toast.success(lang.notifications.success.orderPlaced, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            })
            setCart({
                products: [],
                discountCode: ""
            });
            localStorage.setItem('cart', JSON.stringify({
                products: [],
                discountCode: ""
            }));
            router.push(`/${contextLang}/confirmation?type=success`);
            
        } catch (error) {
            router.push(`/${contextLang}/confirmation?type=error`);
        }
    }

    const resetForm = () => {
        setShipping({
            name: "",
            surname: "",
            email: "",
            country: "de",
            address: "",
            postalCode: "",
            city: "",
            phoneNumber: ""
        });
        // setPaymentMethod("");
    }

    async function handleCheckCode(code) {
        const total = cart?.products?.reduce((total, product) => total + ((product.selectedVariant.precio + (product.selectedColor?.precio || 0) + (product.selectedEncaje?.precio || 0)) * product.count), 0)
        if (!code) {
            return setFinalPrice(total.toFixed(2))
        };

        try {
            const { data } = await axios.post('/api/strapi/discount-codes/getOne', { code });
            setCart(current => { return { ...current, discountCode: code } });
            localStorage.setItem('cart', JSON.stringify({ ...cart, discountCode: code }));
            const discount = data.data.data[0].attributes.descuento;
            setDiscountCode(current => { return { ...current, discount } });
            setDiscountPrice(total - ((total * discount) / 100));
            setFinalPrice((total - ((total * discount) / 100)).toFixed(2));
            return true;
        } catch (error) {
            setCart(current => { return { ...current, discountCode: "" } });
            localStorage.setItem('cart', JSON.stringify({ ...cart, discountCode: "" }));
            setFinalPrice(total.toFixed(2));
            return false;
        }
    }

    useMemo(() => handleCheckCode(cart.discountCode), [cart.discountCode]);

    useEffect(() => {
        if (!discountCode.discount || !total) return;
        setDiscountPrice(total - ((total * discountCode.discount) / 100))
    }, [discountCode, total])

    useEffect(() => {
        const total = cart?.products?.reduce((total, product) => total + ((product.selectedVariant.precio + (product.selectedColor?.precio || 0) + (product.selectedEncaje?.precio || 0)) * product.count), 0);
        setTotal(total);
        handleCheckCode();
    }, [cart]);

    useEffect(() => {
        if(paymentDetails && paymentDetails?.status) {
            handleSubmit();
        }
    }, [paymentDetails])

    const CurrencyFormatter = (price) => useCurrencyFormatter(currency).format(price);

    const [ showResume, setShowResume ] = useState(false);
    const handleShowResume = () => setShowResume(!showResume);

    useEffect(() => {
        setShipping(current => {
            return {
                ...current, 
                name: auth.name, 
                surname: auth.surname, 
                email: auth.email,
                city: auth.city,
                address: auth.address,
                postalCode: auth.postalCode,
                phoneNumber: auth.phoneNumber,
            }
        })
    }, [auth])

    return (
        <Layout title={lang.pages.checkout.headTitle}>
            <Toaster />
            <section className={"flex items-start my-0"}>
                <div className={`flex flex-col gap-10 w-full lg:w-1/2 md:p-10 py-20 lg:border-r ${darkMode ? "border-dark-border" : "border-light-border"} h-full`}>
                    <div className={"block lg:hidden border-b"}>
                        <div className={"flex items-center justify-between"}>
                            <button onClick={handleShowResume} className={"flex items-center gap-2 h-14"}>
                                <span>{lang.pages.checkout.orderResume}</span>
                                <i className="fa-regular fa-angle-down"></i>
                            </button>
                            {discountPrice ? (
                                <div className={"font-semibold text-lg"}>{CurrencyFormatter(discountPrice)}</div>
                            ) : (
                                <div className={"font-semibold text-lg"}>{CurrencyFormatter(total)}</div>
                            )}
                        </div>
                        <AnimatePresence>
                            {showResume && (
                                <motion.div
                                    className={"flex flex-col gap-4 pb-5"}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className={"flex flex-col gap-1 items-end border-b pb-3"}>
                                        {discountCode.discount ? (
                                            <>
                                                <div className={"flex items-center gap-2"}>
                                                    <span className={"text-sm text-neutral-600"}>{currency}</span>
                                                    <div className={"line-through text-red-400 font-medium"}>{CurrencyFormatter(total || 0)}</div>
                                                </div>
                                                <div className={"flex items-center gap-2"}>
                                                    <span className={"text-sm text-neutral-600"}>{currency}</span>
                                                    <div className={"flex items-center gap-1"}>
                                                        <span className={"font-medium"}>{CurrencyFormatter(discountPrice || 0)}</span>
                                                        <span className={"text-sm"}>{`(-${discountCode.discount}%)`}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className={"flex items-center gap-2"}>
                                                <span className={"text-sm text-neutral-600"}>{currency}</span>
                                                <div className={"font-medium"}>{CurrencyFormatter(total || 0)}</div>
                                            </div>
                                        )}
                                    </div>
                                    {cart && cart?.products?.map((product, index) => (
                                        <Product product={product} key={index} />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* <div className={"flex items-center gap-2 select-none"}>
                        <span className={"h-[1px] bg-neutral-200 w-full"}></span>
                        <span className={"text-neutral-500"}>O</span>
                        <span className={"h-[1px] bg-neutral-200 w-full"}></span>
                    </div> */}
                    <form className={"flex flex-col gap-10"}>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex flex-col text-sm"}>
                                <span className={"text-2xl font-semibold"}>{lang.pages.checkout.forms.contact.title}</span>
                                {!auth.authenticated && (
                                    <div className={"flex items-center gap-1"}>
                                        <span>{lang.pages.checkout.signIn.text}</span>
                                        <Link href={`/${contextLang}/login`} className={"underline"}>{lang.pages.checkout.signIn.link}</Link>
                                    </div>
                                )}
                            </div>
                            <Input placeholder={lang.pages.checkout.forms.contact.placeholders.email} type={"email"} value={shipping.email} setValue={(e) => setShipping({ ...shipping, email: e.target.value })} autocomplete={"email"} />
                        </div>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex items-center justify-between text-sm"}>
                                <span className={"text-2xl font-semibold"}>{lang.pages.checkout.forms.shipping.title}</span>
                            </div>
                            <select 
                                value={shipping.country} 
                                onChange={e => setShipping({...shipping, country: e.target.value})}
                                className={`p-3 w-full border ${darkMode ? "border-dark-border bg-dark-bg-primary" : "border-light-border bg-light-bg-primary"} rounded-md outline-none focus:border-main transition-colors`}
                            >
                                <option value="de">{lang.pages.checkout.forms.shipping.countries.de}</option>
                            </select>
                            <div className={"grid grid-cols-2 gap-3"}>
                                <Input placeholder={lang.pages.checkout.forms.shipping.placeholders.name} type={"text"} value={shipping.name} setValue={(e) => setShipping({ ...shipping, name: e.target.value })} autocomplete={"given-name"} />
                                <Input placeholder={lang.pages.checkout.forms.shipping.placeholders.surname} type={"text"} value={shipping.surname} setValue={(e) => setShipping({ ...shipping, surname: e.target.value })} autocomplete={"family-name"} />
                            </div>
                            <Input placeholder={lang.pages.checkout.forms.shipping.placeholders.address} type={"text"} value={shipping.address} setValue={(e) => setShipping({ ...shipping, address: e.target.value })} autocomplete={"street-address"} />
                            <div className={"grid grid-cols-2 gap-3"}>
                                <Input placeholder={lang.pages.checkout.forms.shipping.placeholders.postalCode} type={"number"} value={shipping.postalCode} setValue={(e) => setShipping({ ...shipping, postalCode: e.target.value })} autocomplete={"postal-code"} />
                                <Input placeholder={lang.pages.checkout.forms.shipping.placeholders.city} type={"text"} value={shipping.city} setValue={(e) => setShipping({ ...shipping, city: e.target.value })} autocomplete={"address-level2"} />
                            </div>
                            <Input placeholder={lang.pages.checkout.forms.shipping.placeholders.phoneNumber} type={"tel"} value={shipping.phoneNumber} setValue={(e) => setShipping({ ...shipping, phoneNumber: e.target.value })} autocomplete={"tel"} />
                        </div>
                        {/* <div className={"flex flex-col gap-3"}>
                            <div className={"flex items-center justify-between text-sm"}>
                                <span className={"text-2xl font-semibold"}>{lang.pages.checkout.forms.payment.title}</span>
                            </div>
                            <div className={"flex flex-col"}>
                                <PaymentOption 
                                    method={"creditcard"} 
                                    name={lang.pages.checkout.forms.payment.creditcard} 
                                    value={{ get: paymentMethod, set: setPaymentMethod }} 
                                    showCard={paymentMethod == 'creditcard' ? true : false} 
                                    rounded={"rounded-t-md"}
                                />
                                <PaymentOption 
                                    method={"paypal"} 
                                    name={lang.pages.checkout.forms.payment.paypal} 
                                    value={{ get: paymentMethod, set: setPaymentMethod }} 
                                    showCard={paymentMethod == 'paypal' ? true : false} 
                                    rounded={`rounded-b-md ${paymentMethod == "paypal" ? "rounded-b-none" : null}`}
                                />
                            </div>
                        </div> */}
                        {finalPrice != 0 && !Object.values(shipping).includes(undefined) && (
                            <PayPalButton value={finalPrice} currency={currency} setPaymentDetails={setPaymentDetails} />
                        )}
                        {/* <button type={"submit"} className={"py-3 bg-main text-white hover:bg-main-hover transition-colors rounded-md disabled:bg-neutral-400"} disabled={(paymentMethod == '' || cart.length == 0) ? true : false}>{lang.pages.checkout.forms.submit}</button> */}
                    </form>
                </div>
                <div className={"hidden lg:flex flex-col gap-10 w-1/2 p-10 py-20 h-full"}>
                    {cart?.products?.length != 0 && (
                        <>
                            <div className={"flex flex-col gap-3"}>
                                {cart && cart?.products?.map((product, index) => (
                                    <Product product={product} key={index} />
                                ))}
                            </div>
                            <div className={"flex flex-col divide-y"}>
                                <div className={`flex items-center justify-between py-3`}>
                                    <div>Subtotal</div>
                                    <div className={"font-semibold"}>{CurrencyFormatter(total)}</div>
                                </div>
                                <div className={`flex items-end justify-between py-3 ${darkMode ? "border-dark-border" : "border-light-border"}`}>
                                    <div className={"font-semibold text-lg"}>Total</div>
                                    <div className={"flex flex-col gap-1 items-end"}>
                                        {discountCode.discount ? (
                                            <>
                                                <div className={"flex items-center gap-2"}>
                                                    <span className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-light-text-secondary"}`}>{currency}</span>
                                                    <div className={"line-through text-red-400 font-medium"}>{CurrencyFormatter(total || 0)}</div>
                                                </div>
                                                <div className={"flex items-center gap-2"}>
                                                    <span className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-light-text-secondary"}`}>{currency}</span>
                                                    <div className={"flex items-center gap-1"}>
                                                        <span className={"font-medium"}>{CurrencyFormatter(discountPrice || 0)}</span>
                                                        <span className={"text-sm"}>{`(-${discountCode.discount}%)`}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className={"flex items-center gap-2"}>
                                                <span className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-light-text-secondary"}`}>{currency}</span>
                                                <div className={"font-medium"}>{CurrencyFormatter(total || 0)}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {cart?.products?.length == 0 && (
                        <div className={"flex flex-col items-center"}>
                            <span className={"font-semibold text-xl"}>{lang.pages.checkout.noProductsInCart}</span>
                            <span>{lang.pages.checkout.addProductsToCart}</span>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}

function Product({ product }) {

    const lang = useGetLang();
    
    const { img, name, count, selectedVariant, selectedColor, selectedEncaje } = product;

    function calculatePrice() {
        const colorPrice = selectedColor?.precio || 0;
        const encajePrice = selectedEncaje?.precio || 0;
        const variantPrice = selectedVariant.precio;

        return (variantPrice + colorPrice + encajePrice) * count;
    }

    const { currency } = useAppContext();

    return (
        <div className={"flex items-center justify-between"}>
            <div className={"flex items-center gap-2"}>
                <div className={"relative"}>
                    <div className={"image-container aspect-square overflow-hidden rounded-md border border-neutral-300"} style={{ width: "70px" }}>
                        <Image src={`${process.env.NEXT_PUBLIC_STRAPI_URI}${img}`} className={"image"} fill alt={"Product image"} />
                    </div>
                    <div className={"absolute -top-2 -right-2 text-sm text-white font-medium bg-[rgba(0,0,0,.6)] w-5 h-5 rounded-full grid place-content-center"}>{count}</div>
                </div>
                <div className={"flex flex-col"}>
                    <div>{name}</div>
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
                </div>
            </div>
            <div>{useCurrencyFormatter(currency).format(calculatePrice())}</div>
        </div>
    )
}

function Input({ placeholder, type, value, setValue, autocomplete }) {

    const { darkMode } = useAppContext();

    return (
        <input 
            className={`p-3 w-full border ${darkMode ? "border-dark-border" : "border-light-border"} rounded-md outline-none focus:border-main transition-colors bg-transparent`}
            type={type} 
            placeholder={placeholder} 
            value={value} 
            onChange={setValue} 
            required={true}
            autoComplete={autocomplete}
        />
    )
}

function PaymentOption({ method, name, value, showCard, rounded }) {

    const lang = useGetLang();

    const methods = {
        creditcard: "Stripe",
        paypal: "PayPal"
    }

    return (
        <div className={"flex flex-col"}>
            <button onClick={() => value.set(method)} type={"button"} className={`flex items-center justify-between p-4 border ${rounded} transition-colors ${value.get == method ? "border-main" : null}`}>
                <div className={"flex items-center gap-2"}>
                    <div className={`border ${value.get == method ? "border-[6px] border-main" : ""} w-5 h-5 rounded-full transition-colors`}></div>
                    <div>{name}</div>
                </div>
                <div className={"w-10 h-6 bg-neutral-300 rounded-md"}></div>
            </button>
            {showCard && (
                <div className={"flex justify-center py-7 border-l border-r border-b rounded-b-md"}>
                    <div className={"flex flex-col justify-center items-center gap-5 w-1/2"}>
                        <div className={"relative w-fit text-neutral-500"}>
                            <i className="fa-thin fa-window text-8xl"></i>
                            <div className={"absolute -right-3 top-1/2 -translate-y-1/2 bg-white h-8"}>
                                <i className="fa-regular fa-arrow-right-long text-2xl"></i>
                            </div>
                        </div>
                        <span className={"text-sm text-center"}>{`${lang.pages.checkout.forms.payment.card.first} “${lang.pages.checkout.forms.submit}”, ${lang.pages.checkout.forms.payment.card.second} ${methods[method]} ${lang.pages.checkout.forms.payment.card.third}`}</span>
                    </div>
                </div>
            )}
        </div>
    )
}