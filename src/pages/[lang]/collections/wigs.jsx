import axios from "axios";
// React
import { useEffect, useState } from "react";
// Components
import Layout from "@/components/Layout";
import ProductsView from "@/components/ProductsView";
// Hooks
import useGetLang from "@/hooks/useGetLang";

const ITEMS_PER_PAGE = 6;

export default function Wigs() {

    const lang = useGetLang();

    const [ products, setProducts ] = useState([]);
    const [ actualPage, setActualPage ] = useState(null);
    const [ totalProducts, setTotalProducts ] = useState(0);
    const [ loading, setLoading ] = useState(true);

    async function getProducts() {
        if(!actualPage) return;
        setLoading(true);
        try {
            const { data } = await axios.post('/api/strapi/products/getWigsByPage', { page: actualPage, pageSize: ITEMS_PER_PAGE });
            setProducts(data.data.data);
            setTotalProducts(data.data.meta.pagination.total);
        } catch (error) {
            // console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProducts();
    }, [actualPage])

    return (
        <Layout title={lang.pages.collections.wigs.headTitle}>
            <ProductsView 
                title={lang.pages.collections.wigs.title} 
                products={products} 
                itemsPerPage={ITEMS_PER_PAGE} 
                actualPage={actualPage}
                setActualPage={setActualPage}
                totalProducts={totalProducts}
                loading={loading}
            />
        </Layout>
    )
}