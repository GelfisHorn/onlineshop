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
import { toast, Toaster } from "react-hot-toast";

export default function Recover() {

    const router = useRouter();
    const { token } = router.query || {};

    const { lang: contextLang } = useAppContext();
    const lang = useGetLang();

    const [ loading, setLoading ] = useState(true);
    const [ isValidToken, setIsValidToken ] = useState(false);
    const [ password, setPassword ] = useState("");
    const [ repeatPassword, setRepeatPassword ] = useState("");
    const [ passwordChanged, setPasswordChanged ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([password, repeatPassword].includes('')) {
            toast.error(lang.notifications.error.missingFields, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
            return;
        }

        if(password != repeatPassword) {
            toast.error(lang.notifications.error.passwordsDontMatch, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
            return;
        }

        try {
            await axios.post(`/api/user/new-password`, { token, password });
            toast.success(lang.notifications.success.newPassword, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
            setPassword("");
            setRepeatPassword("");
            setPasswordChanged(true);
        } catch (error) {
            toast.error(lang.notifications.error.newPassword, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        }
    }

    const verifyToken = async () => {
        if(!token) return;

        try {
            await axios.post('/api/user/verify-token', { token });
            setIsValidToken(true);
        } catch (error) {
            setIsValidToken(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        verifyToken();
    }, [token]);

    return (
        <Layout title={lang.pages.newPassword.headTitle}>
            <Toaster />
            <section className={"flex items-center justify-center h-[70vh] min-h-[400px]"}>
                <div className={"flex flex-col gap-16 w-full sm:w-[25rem]"}>
                    <h2 className={"text-4xl font-semibold text-center text-main"}>{lang.pages.newPassword.title}</h2>
                    {!loading && isValidToken && !passwordChanged ? (
                        <form className={"flex flex-col gap-10"} onSubmit={handleSubmit}>
                            <div className={"flex flex-col gap-4"}>
                                <Input type={"password"} placeholder={lang.pages.newPassword.inputs.placeholders.password} value={password} setValue={setPassword} />
                                <Input type={"password"} placeholder={lang.pages.newPassword.inputs.placeholders.repeatPassword} value={repeatPassword} setValue={setRepeatPassword} />
                            </div>
                            <button type="submit" className={`py-3 bg-main text-white`}>{lang.pages.newPassword.submitBtn}</button>
                        </form>
                    ) : !loading && !isValidToken && (
                        <div className={"flex flex-col gap-8 items-center"}>
                            <div className={"text-center font-semibold uppercase text-red-700"}>{lang.pages.newPassword.invalidToken}</div>
                            <Link href={`/${contextLang}/recover`} className={"flex items-center gap-2 text-main text-lg"}>
                                <span className={"underline"}>{lang.pages.newPassword.recoverPassword}</span>
                                <i className="fa-regular fa-arrow-right-long"></i>
                            </Link>
                        </div>
                    )}
                    {loading && (
                        <div className={"grid place-content-center"}>
                            <Loading />
                        </div>
                    )}
                    {passwordChanged && (
                        <div className={"flex flex-col items-center"}>
                            <Link href={`/${contextLang}/login`} className={"flex items-center gap-2 text-main text-lg"}>
                                <span className={"underline"}>{lang.pages.newPassword.login}</span>
                                <i className="fa-regular fa-arrow-right-long"></i>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}

function Input({ type, placeholder, value, setValue }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            required={true}
            className={"py-2 border-b w-full outline-none placeholder:text-neutral-600 focus:border-neutral-600 transition-colors"}
        />
    )
}