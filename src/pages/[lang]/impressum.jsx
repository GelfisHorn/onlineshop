// Axios
import axios from "axios";
// React
import { useEffect, useState } from "react";
// Components
import Layout from "@/components/Layout";
// Markdown
import ReactMarkdown from 'react-markdown'

export default function Impressum() {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getImpressumData();
    }, [])

    async function getImpressumData() {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/legal/impressum`);
            setData(data.data);
        } catch (error) {
            console.error("Error getting impressum data");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <Layout title={"Impressum"}>
            {!loading && data?.contenido && (
                <section className={`flex flex-col gap-5 text-neutral-700`}>
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