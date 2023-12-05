import { useState } from "react";
// Components
import Layout from "@/components/Layout";
// Hooks
import useAppContext from "@/hooks/useAppContext";
import useGetLang from "@/hooks/useGetLang";
// Notifications
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

export default function Recover() {

    const { lang: contextLang } = useAppContext();
    const lang = useGetLang();

    const [ email, setEmail ] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if([email].includes('')) {
            toast.error(lang.notifications.error.missingFields, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
            return;
        }

        try {
            await axios.post('/api/user/reset-password', { email });
            toast.success(lang.notifications.success.recoverAccount, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
            setEmail("");
        } catch (error) {
            toast.error(lang.notifications.error.recoverAccount, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        }
    }

    return (
        <Layout title={lang.pages.recover.headTitle}>
            <Toaster />
            <section className={"flex items-center justify-center h-[70vh] min-h-[400px]"}>
                <div className={"flex flex-col gap-16 w-full sm:w-[25rem]"}>
                    <h2 className={"text-4xl font-semibold text-center text-main"}>{lang.pages.recover.title}</h2>
                    <form className={"flex flex-col gap-10"} onSubmit={handleSubmit}>
                        <div className={"flex flex-col gap-4"}>
                            <Input type={"email"} placeholder={lang.pages.recover.inputs.placeholders.email} value={email} setValue={setEmail} />
                        </div>
                        <button type="submit" className={`py-3 bg-main text-white`}>{lang.pages.recover.submitBtn}</button>
                    </form>
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