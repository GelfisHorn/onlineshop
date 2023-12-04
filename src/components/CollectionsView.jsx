// Nextjs
import Image from "next/image";
import Link from "next/link";
// Hooks
import useAppContext from "@/hooks/useAppContext";

export default function CollectionsView({ collections }) {
    return (
        <div className={"grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10"}>
            {collections && collections.map((cat, index) => (
                <Collection key={index} collection={cat} />
            ))}
        </div>
    )
}

function Collection({ collection }) {

    const { lang } = useAppContext();
    const { image, name, href } = collection;

    return (
        <Link href={`/${lang}/collections/${href}`} className={"flex flex-col gap-2"}>
            <div className={"image-container overflow-hidden aspect-square rounded-md"}>
                <Image src={image} className={"image image-hover"} fill alt={"Product image"} />
            </div>
            <div className={"flex items-center gap-2"}>
                <span>{name}</span>
                <i className="fa-regular fa-arrow-right"></i>
            </div>
        </Link>
    )
}