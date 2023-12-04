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

    const { id, name, price, description, img } = product;

    const { currency, setCart } = useAppContext();
    const lang = useGetLang();

    const handleAddToCart = () => {
        useAddToCart({
            id,
            name,
            price,
            description,
            img,
            count: 1
        }, setCart);
        toast.success(lang.notifications.success.productAdded, {
            position: 'top-right',
            style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
        })
    }

    return (
        <div className={`flex flex-col gap-3`}>
            <Link href={"#"} className={`${styles.card} flex flex-col gap-3`}>
                <div className={"image-container aspect-square overflow-hidden rounded-md"}>
                    <Image className={"image hover:scale-[103%] image-hover"} src={img} fill alt={"Product image"} />
                </div>
                <span className={`${styles.name} font-medium text-xl transition-colors`}>{name}</span>
            </Link>
            <div className={"flex items-end justify-between"}>
                <span className={"text-main text-2xl font-semibold"}>{useCurrencyFormatter(currency).format(price)}</span>
                <button onClick={handleAddToCart} className={"flex items-end font-medium text-main gap-2"}>
                    <i className="fa-regular fa-bag-shopping text-lg"></i>
                    <span>{lang.product.addToCart}</span>
                </button>
            </div>
            <Toaster />
        </div>
    )
}