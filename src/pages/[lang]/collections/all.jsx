// Components
import Layout from "@/components/Layout";
import ProductsView from "@/components/ProductsView";
// Hooks
import useGetLang from "@/hooks/useGetLang";
// Mock data
import { products } from "@/mockData/products";

export default function AllCollections() {

    const lang = useGetLang();

    return (
        <Layout title={lang.pages.collections.all.headTitle}>
            <ProductsView title={lang.pages.home.featuredProducts} products={products} />
        </Layout>
    )
}