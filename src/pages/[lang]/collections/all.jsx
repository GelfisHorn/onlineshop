import axios from "axios";
// React
import { useEffect, useState } from "react";
// Components
import Layout from "@/components/Layout";
import ProductsView from "@/components/ProductsView";
// Hooks
import useGetLang from "@/hooks/useGetLang";
import useAppContext from "@/hooks/useAppContext";

const ITEMS_PER_PAGE = 6;

export default function AllProducts() {

    const lang = useGetLang();
    const { lang: contextLang } = useAppContext();

    const [ products, setProducts ] = useState([]);
    const [ actualPage, setActualPage ] = useState(null);
    const [ totalProducts, setTotalProducts ] = useState(0);
    const [ loading, setLoading ] = useState(true);

    async function getProducts() {
        if(!actualPage) return;
        setLoading(true);
        try {
            const { data } = await axios.post('/api/strapi/products/getAllByPage', { page: actualPage, pageSize: ITEMS_PER_PAGE, locale: contextLang });
            setProducts(data.data.data);
            setTotalProducts(data.data.meta.pagination.total);
        } catch (error) {
            // console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!contextLang) return;
        getProducts();
    }, [actualPage, contextLang])

    return (
        <Layout title={lang.pages.collections.all.title}>
            <ProductsView 
                title={lang.pages.collections.all.title} 
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