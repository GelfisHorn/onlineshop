import Layout from "@/components/Layout";

export default function Custom404() {
    return (
        <Layout title={"Page not found"}>
            <div className={"grid place-content-center h-full"}>
                <h2>Page not found</h2>
            </div>
        </Layout>
    )
}