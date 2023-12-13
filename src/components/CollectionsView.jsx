// Nextjs
import Image from "next/image";
import Link from "next/link";
// Hooks
import useAppContext from "@/hooks/useAppContext";
// Animations
import { motion } from "framer-motion";
const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.1,
            staggerChildren: 0.1
        }
    }
};
const item = {
    hidden: { x: 20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1
    }
};

export default function CollectionsView({ collections }) {

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible" 
            className={"grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10"}
        >
            {collections.length != 0 && collections.map((coll, index) => (
                <Collection key={index} collection={coll?.attributes} />
            ))}
        </motion.div>
    )
}

function Collection({ collection }) {

    const { lang } = useAppContext();
    const { img, nombre, url } = collection || {};

    return (
        <motion.div variants={item}>
            <Link href={`/${lang}/collections/${url}`} className={"flex flex-col gap-2"}>
                <div className={"image-container overflow-hidden aspect-square rounded-md"}>
                    <Image src={`${process.env.NEXT_PUBLIC_STRAPI_URI}${img?.data?.attributes?.formats?.large?.url}`} className={"image image-hover"} fill alt={"Product image"} />
                </div>
                <div className={"flex items-center gap-2"}>
                    <span className={"text-lg"}>{nombre}</span>
                    <i className="fa-regular fa-arrow-right"></i>
                </div>
            </Link>
        </motion.div>
    )
}