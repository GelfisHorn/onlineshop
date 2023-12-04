import axios from "axios";
import { useState } from "react";
// Nextjs
import Link from "next/link";
// Components
import Layout from "@/components/Layout";
// Hooks
import useAppContext from "@/hooks/useAppContext";
// Notifications
import { toast, Toaster } from "react-hot-toast";
import useGetLang from "@/hooks/useGetLang";

export default function Login() {

    const { lang: contextLang, setAuth } = useAppContext();
    const lang = useGetLang();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes('')) {
            toast.error("Debes llenar todos los campos", {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
            return;
        }

        try {
            const { data } = await axios.post('/api/user/login', { email, password });
            setAuth({ 
                _id: data._id || "",
                name: data.name || "",
                surname: data.surname || "",
                email: data.email || "",
                authenticated: true
            });
            toast.success("Iniciaste sesión correctamente!", {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        } catch (error) {
            console.log(error);
            toast.error("Hubo un error al iniciar sesión", {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        } finally {
            resetForm();
        }
    }

    function resetForm() {
        setEmail("");
        setPassword("");
    }

    return (
        <Layout title={lang.pages.login.headTitle}>
            <Toaster />
            <section className={"flex items-center justify-center h-[70vh] min-h-[400px]"}>
                <div className={"flex flex-col gap-16 w-full sm:w-[25rem]"}>
                    <h2 className={"text-4xl font-semibold text-center text-main"}>{lang.pages.login.title}</h2>
                    <form className={"flex flex-col gap-10"} onSubmit={handleSubmit}>
                        <div className={"flex flex-col gap-4"}>
                            <Input type={"email"} placeholder={lang.pages.login.inputs.placeholders.email} value={email} setValue={setEmail} />
                            <Input type={"password"} placeholder={lang.pages.login.inputs.placeholders.password} value={password} setValue={setPassword} />
                        </div>
                        <div className={"flex flex-col gap-4"}>
                            <button type="submit" className={"py-3 bg-main text-white"}>{lang.pages.login.submitBtn}</button>
                            <div className={"flex flex-col gap-4 sm:gap-1"}>
                                <div className={"flex flex-col sm:flex-row sm:gap-1 text-sm"}>
                                    <span>{lang.pages.login.createAccount.text}</span>
                                    <Link href={`/${contextLang}/register`} className={"underline text-main"}>{lang.pages.login.createAccount.link}</Link>
                                </div>
                                <div className={"flex flex-col sm:flex-row sm:gap-1 text-sm"}>
                                    <span>{lang.pages.login.forgotPassword.text}</span>
                                    <Link href={`#`} className={"underline text-main"}>{lang.pages.login.forgotPassword.link}</Link>
                                </div>
                            </div>
                        </div>
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