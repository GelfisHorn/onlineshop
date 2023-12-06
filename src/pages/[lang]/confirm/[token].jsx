import axios from "axios";
// React
import { useEffect, useState } from "react";
// Nextjs
import { useRouter } from "next/router";
import Link from "next/link";
// Components
import Layout from "@/components/Layout";
import Loading from "@/components/Loading/Index";
// Hooks
import useAppContext from "@/hooks/useAppContext";
import useGetLang from "@/hooks/useGetLang";
// Notifications
import toast, { Toaster } from "react-hot-toast";

export default function ConfirmAccount() {

    const router = useRouter();
    const { token } = router.query || {};

    const { lang: contextLang } = useAppContext();
    const lang = useGetLang();

    const [ confirmed, setConfirmed ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    const confirmUser = async () => {
        try {
            await axios.post(`/api/user/confirm`, { token });
            setConfirmed(true);
            toast.success(lang.notifications.success.confirmAccount, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        } catch (error) {
            toast.error(lang.notifications.error.confirmAccount, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!token) return;
        confirmUser();
    }, [token])

    return (
        <Layout title={lang.pages.confirm.headTitle}>
            <Toaster />
            <section className={"flex items-center justify-center h-[70vh] min-h-[400px]"}>
                <div className={"flex flex-col gap-16 w-full sm:w-[25rem]"}>
                    <h2 className={"text-4xl font-semibold text-center text-main"}>{lang.pages.confirm.title}</h2>
                    {!loading && confirmed ? (
                        <div className={"flex flex-col gap-4"}>
                            <div className={"text-center text-lg font-medium"}>{lang.pages.confirm.confirmed}</div>
                            <div className={"flex flex-col items-center"}>
                                <Link href={`/${contextLang}/login`} className={"flex items-center gap-2 text-main text-lg"}>
                                    <span className={"underline"}>{lang.pages.confirm.login}</span>
                                    <i className="fa-regular fa-arrow-right-long"></i>
                                </Link>
                            </div>
                        </div>
                    ) : !loading && !confirmed && (
                        <div className={"flex flex-col gap-4 items-center"}>
                            <div className={"text-center font-semibold uppercase text-red-700"}>{lang.pages.confirm.invalidToken}</div>
                            <Link href={`/${contextLang}/login`} className={"flex items-center gap-2 text-main text-lg"}>
                                <span className={"underline"}>{lang.pages.confirm.login}</span>
                                <i className="fa-regular fa-arrow-right-long"></i>
                            </Link>
                        </div>
                    )}
                    {loading && (
                        <div className={"grid place-content-center"}>
                            <Loading />
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}