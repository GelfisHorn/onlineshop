import axios from "axios";
import { useState } from "react";
// Nextjs
import Link from "next/link";
// Components
import Layout from "@/components/Layout";
// Hooks
import useAppContext from "@/hooks/useAppContext";
// Notifications
import { toast, Toaster } from 'react-hot-toast'
import useGetLang from "@/hooks/useGetLang";

export default function Register() {

    const { lang: contextLang } = useAppContext();
    const lang = useGetLang();

    const [ name, setName ] = useState("");
    const [ surname, setSurname ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ repeatPassword, setRepeatPassword ] = useState("");
    const [ emailMarketing, setEmailMarketing ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if([name, surname, email, password, repeatPassword].includes('')) {
            toast.error("Debes llenar todos los campos", {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
            return;
        }

        if(!emailMarketing) {
            toast.error("Debes aceptar los términos de protección de datos", {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
            return;
        }

        try {
            await axios.post('/api/user/register', { name, surname, email, password, emailMarketing });
            toast.success("Se ha creado tu cuenta correctamente", {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        } catch (error) {
            toast.error("Hubo un error al crear la cuenta", {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            });
        } finally {
            resetForm();
        }
    }

    function resetForm() {
        setName("");
        setSurname("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
        setEmailMarketing(false)
    }

    return (
        <Layout title={lang.pages.register.headTitle}>
            <Toaster />
            <section className={"flex items-center justify-center h-[70vh] min-h-[550px]"}>
                <div className={"flex flex-col gap-16 w-full sm:w-[25rem]"}>
                    <h2 className={"text-4xl font-semibold text-center text-main"}>{lang.pages.register.title}</h2>
                    <form className={"flex flex-col gap-10"} onSubmit={handleSubmit}>
                        <div className={"flex flex-col gap-4"}>
                            <Input type={"text"} placeholder={lang.pages.register.inputs.placeholders.name} value={name} setValue={setName} />
                            <Input type={"text"} placeholder={lang.pages.register.inputs.placeholders.surname} value={surname} setValue={setSurname} />
                            <Input type={"email"} placeholder={lang.pages.register.inputs.placeholders.email} value={email} setValue={setEmail} />
                            <Input type={"password"} placeholder={lang.pages.register.inputs.placeholders.password} value={password} setValue={setPassword} />
                            <Input type={"password"} placeholder={lang.pages.register.inputs.placeholders.repeatPassword} value={repeatPassword} setValue={setRepeatPassword} />
                        </div>
                        <div className={"flex flex-col gap-4"}>
                            <div className={"flex items-center gap-2"}>
                                <input id={"email-marketing"} type="checkbox" checked={emailMarketing} onClick={() => setEmailMarketing(!emailMarketing)} />
                                <label htmlFor="email-marketing" className={"text-sm select-none"}>
                                    <span>{lang.pages.register.checkBox.text}</span>
                                    <Link href={`/${contextLang}/datenschutz`} className={"underline"}>{lang.pages.register.checkBox.link}</Link>
                                </label>
                            </div>
                            <button type="submit" className={"py-2 bg-main text-white"}>{lang.pages.register.submitBtn}</button>
                            <div className={"flex flex-col gap-1"}>
                                <div className={"flex flex-col sm:flex-row sm:gap-1 text-sm"}>
                                    <span>{lang.pages.register.signIn.text}</span>
                                    <Link href={`/${contextLang}/login`} className={"underline text-main"}>{lang.pages.register.signIn.link}</Link>
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