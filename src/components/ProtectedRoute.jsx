import { useEffect } from "react"
// Nextjs
import { useRouter } from "next/router"
// Hooks
import useAppContext from "@/hooks/useAppContext";

export default function ProtectedRoute({ children }) {

    const router = useRouter();
    const { lang: contextLang, auth } = useAppContext();

    useEffect(() => {
        if (!auth.loading && !auth.authenticated) {
            router.push(`/${contextLang}/login`);
        }
    }, [auth])

    return auth.authenticated ? (<>{children}</>) : <></>;
}