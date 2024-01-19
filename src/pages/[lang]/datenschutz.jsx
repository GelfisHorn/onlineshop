// Axios
import axios from "axios";
// React
import { useEffect, useState } from "react";
// Components
import Layout from "@/components/Layout";
// Hooks
import useAppContext from "@/hooks/useAppContext";
// Markdown
import ReactMarkdown from 'react-markdown'

export default function Datenschutz() {

    const { darkMode } = useAppContext();

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDatenschutzData();
    }, [])

    async function getDatenschutzData() {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/legal/datenschutz`);
            setData(data.data);
        } catch (error) {
            console.error("Error getting datenschutz data");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout title={"Datenschutz"}>
            {!loading && data?.contenido && (
                <section className={`flex flex-col gap-5 ${darkMode ? "text-dark-text-secondary" : "text-light-text-secondary"}`}>
                    {data.contenido && data.contenido.split('\n\n').map((section, index) => (
                        <ReactMarkdown key={index} className={"strapi-markdown"}>{section}</ReactMarkdown>
                    ))}
                </section>
            )}
            {loading && (
                <LoadingSkeleton />
            )}
        </Layout>
    )
}

function LoadingSkeleton() {

    return (
        <div className={"flex flex-col gap-10"}>
            <div className={`rounded-2xl h-16 w-1/2 bg-neutral-200`}></div>
            <div className={"flex flex-col gap-5"}>
                <div className={`h-48 w-full rounded-2xl bg-neutral-200 animate-pulse`}></div>
                <div className={`h-56 w-full rounded-2xl bg-neutral-200 animate-pulse`}></div>
                <div className={`h-64 w-full rounded-2xl bg-neutral-200 animate-pulse`}></div>
            </div>
        </div>
    )
}