// Components
import Layout from "@/components/Layout";
// Hooks
import useGetLang from "@/hooks/useGetLang";
// Styles
import styles from './index.module.css'
import Link from "next/link";
import useAppContext from "@/hooks/useAppContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Resume() {

    const router = useRouter();
    const type = router.query?.type;

    const { lang: contextLang } = useAppContext();
    const lang = useGetLang();


    return (
        <Layout title={""}>
            {type == 'success' ? (
                <div className={"flex items-center justify-center flex-col gap-10 py-40 px-10"}>
                    <Success />
                    <div className={"flex flex-col gap-14 text-center"}>
                        <div className={"flex flex-col gap-4"}>
                            <h2 className={"font-semibold text-3xl"}>{lang.pages.confirmation.success.title}</h2>
                            <p className={""}>{lang.pages.confirmation.success.description}</p>
                        </div>
                        <Link href={`/${contextLang}`} className={"py-2 px-6 bg-main text-white rounded"}>{lang.pages.confirmation.success.button}</Link>
                    </div>
                </div>
            ) : (
                <div className={"flex items-center justify-center flex-col gap-10 py-40 px-10"}>
                    <Error />
                    <div className={"flex flex-col gap-14 text-center"}>
                        <div className={"flex flex-col gap-4"}>
                            <h2 className={"font-semibold text-3xl"}>{lang.pages.confirmation.error.title}</h2>
                            <p className={""}>{lang.pages.confirmation.error.description}</p>
                        </div>
                        <Link href={`/${contextLang}`} className={"py-2 px-6 bg-main text-white rounded"}>{lang.pages.confirmation.error.button}</Link>
                    </div>
                </div>
            )}
        </Layout>
    )
}

function Success() {
    return (
        <div className={styles.successAnimation}>
            <svg
                className={styles.checkmark}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
            >
                <circle
                    className={styles.checkmarkCircle}
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                />
                <path
                    className={styles.checkmarkCheck}
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
            </svg>
        </div>
    )
}

function Error() {
    return (
        <div className={styles.container}>
            <div className={styles.circleBorder}></div>
            <div className={styles.circle}>
                <div className={styles.error}></div>
            </div>
        </div>
    )
}