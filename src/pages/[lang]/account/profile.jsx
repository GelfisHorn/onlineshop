import axios from "axios";
import { useEffect, useState } from "react";
// Components
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
// Hooks
import useAppContext from "@/hooks/useAppContext";
import useGetLang from "@/hooks/useGetLang";
import useAuthHeaders from "@/hooks/useAuthHeaders";
// Notifications
import { toast, Toaster } from "react-hot-toast";

export default function AccountProfile() {

    const { auth } = useAppContext();
    const lang = useGetLang();

    const [ user, setUser ] = useState({
        userId: "",
        name: "",
        surname: "",
        email: "",
        address: "",
        postalCode: "",
        city: "",
        phoneNumber: "",
        password: ""
    })
    const [ repeatPassword, setRepeatPassword ] = useState("");

    const config = useAuthHeaders();
    async function HandleSubmit(e) {
        e.preventDefault();

        const { password } = user;

        if(password && password != repeatPassword) {
            toast.error(lang.notifications.error.passwordsDontMatch, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            })
            return;
        }
        if(password.length < 8) {
            toast.error(lang.notifications.error.passwordLength, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            })
            return;
        }

        try {
            await axios.post('/api/user/editProfile', { user, config });
            toast.success(lang.notifications.success.editProfile, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            })
        } catch (error) {
            toast.error(lang.notifications.error.editProfile, {
                position: 'top-right',
                style: { boxShadow: '4px 4px 8px -6px rgba(0,0,0,0.22)', border: "1px solid rgb(240, 240, 240)" }
            })
        }
    }

    useEffect(() => {
        if(!auth.name) return;

        setUser({
            userId: auth._id,
            name: auth.name,
            surname: auth.surname,
            email: auth.email,
            address: auth.address,
            postalCode: auth.postalCode,
            city: auth.city,
            phoneNumber: auth.phoneNumber,
            password: auth.password
        })
    }, [auth])

    return (
        <ProtectedRoute>
            <Layout title={lang.pages.profile.headTitle}>
                <Toaster />
                <section className={"flex flex-col gap-16 py-16 lg:w-1/2 xl:w-1/3 lg:mx-auto"}>
                    <h1 className={"text-4xl font-semibold"}>{lang.pages.profile.title}</h1>
                    <form onSubmit={HandleSubmit} className={"flex flex-col gap-6"}>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3"}>
                                <Input
                                    placeholder={lang.pages.profile.placeholders.name}
                                    type={"text"}
                                    value={user.name}
                                    setValue={(e) => setUser({ ...user, name: e.target.value })}
                                    autocomplete={"given-name"}
                                />
                                <Input
                                    placeholder={lang.pages.profile.placeholders.surname}
                                    type={"text"}
                                    value={user.surname}
                                    setValue={(e) => setUser({ ...user, surname: e.target.value })}
                                    autocomplete={"family-name"}
                                />
                            </div>
                            <Input
                                placeholder={lang.pages.profile.placeholders.email}
                                type={"email"}
                                value={user.email}
                                setValue={(e) => setUser({ ...user, email: e.target.value })}
                                autocomplete={"email"}
                            />
                            <Input
                                placeholder={lang.pages.profile.placeholders.address}
                                type={"text"}
                                value={user.address}
                                setValue={(e) => setUser({ ...user, address: e.target.value })}
                                autocomplete={"street-address"}
                            />
                            <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3"}>
                                <Input
                                    placeholder={lang.pages.profile.placeholders.postalCode}
                                    type={"text"}
                                    value={user.postalCode}
                                    setValue={(e) => setUser({ ...user, postalCode: e.target.value })}
                                    autocomplete={"postal-code"}
                                />
                                <Input
                                    placeholder={lang.pages.profile.placeholders.city}
                                    type={"text"}
                                    value={user.city}
                                    setValue={(e) => setUser({ ...user, city: e.target.value })}
                                    autocomplete={"address-level2"}
                                />
                            </div>
                            <Input
                                placeholder={lang.pages.profile.placeholders.phoneNumber}
                                type={"tel"}
                                value={user.phoneNumber}
                                setValue={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                                autocomplete={"tel"}
                            />
                            <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3"}>
                                <Input
                                    placeholder={lang.pages.profile.placeholders.password}
                                    type={"password"}
                                    value={user.password}
                                    setValue={(e) => setUser({ ...user, password: e.target.value })}
                                    autocomplete={"password"}
                                />
                                <Input
                                    placeholder={lang.pages.profile.placeholders.repeatPassword}
                                    type={"password"}
                                    value={repeatPassword}
                                    setValue={(e) => setRepeatPassword(e.target.value)}
                                    autocomplete={"repeatPassword"}
                                />
                            </div>
                        </div>
                        <button type="submit" className={"py-3 px-5 bg-main text-white hover:bg-main-hover transition-colors"}>{lang.pages.profile.btnSubmit}</button>
                    </form>
                </section>
            </Layout>
        </ProtectedRoute>
    )
}

function Input({ placeholder, type, value, setValue, autocomplete }) {
    return (
        <input
            className={"p-3 w-full border rounded-md outline-none focus:border-main transition-colors"}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={setValue}
            autoComplete={autocomplete}
        />
    )
}