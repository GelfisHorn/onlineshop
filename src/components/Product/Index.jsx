// Nextjs
import Image from "next/image";
import Link from "next/link";
// Hooks
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter";
import useAppContext from "@/hooks/useAppContext";
import useGetLang from "@/hooks/useGetLang";
import useAddToCart from "@/hooks/useAddToCart";
// Styles
import styles from './Index.module.css';
// Notifications
import toast, { Toaster } from 'react-hot-toast';

export default function Product({ product }) {

    const { id, attributes } = product || {};
    const { nombre, url, stock, descripcion, categoria, variante, img } = attributes || {};

    const { lang: contextLang, currency, setCart } = useAppContext();
    const lang = useGetLang();

    const HandleAddToCart = () => {
        useAddToCart({
            id,
            name: nombre,
            variant: variante[0].id,
            description: descripcion,
            img: img.data[0].attributes.formats.small.url,
            count: 1
        }, setCart);
        toast.success(lang.notifications.success.productAdded, {
            position: 'top-right',
            style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
        })
    }

    return attributes && (
        <div className={`flex flex-col gap-3`}>
            <Link href={`/${contextLang}/products/${url}`} className={`${styles.card} flex flex-col gap-3`}>
                <div className={"image-container aspect-square overflow-hidden rounded-md"}>
                    <Image className={"image hover:scale-[103%] image-hover"} src={`${process.env.NEXT_PUBLIC_STRAPI_URI}${img?.data[0]?.attributes?.formats?.large?.url}`} fill alt={"Product image"} />
                </div>
                <span className={`${styles.name} font-medium text-xl transition-colors`}>{nombre}</span>
            </Link>
            <div className={"flex flex-col sm:flex-row sm:items-end justify-between"}>
                <span className={"text-main text-2xl font-semibold"}>{useCurrencyFormatter(currency).format(variante[0]?.precio)}</span>
                <button onClick={HandleAddToCart} className={"flex items-end font-medium text-main gap-2"}>
                    <i className="fa-regular fa-bag-shopping text-lg"></i>
                    <span>{lang.product.addToCart}</span>
                </button>
            </div>
            <Toaster />
        </div>
    )
}