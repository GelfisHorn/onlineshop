import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const lang = localStorage.getItem('lang') || 'es';
        router.push(`/${lang}`);
    }, []);

    return <div></div>;
}