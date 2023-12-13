import axios from "axios";
// React
import { useEffect, useState } from "react";
// Nextjs
import { useRouter } from "next/router";
// Components
import Layout from "@/components/Layout";
import ProductsView from "@/components/ProductsView";
// Hooks
import useGetLang from "@/hooks/useGetLang";

const ITEMS_PER_PAGE = 6;

export default function Extensions() {

    const router = useRouter();
    const { collection: collectionUrl } = router.query;
    const lang = useGetLang();

    const [collection, setCollection] = useState({});
    const [products, setProducts] = useState([]);
    const [actualPage, setActualPage] = useState(null);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);

    async function getProducts() {
        if (!actualPage) return;
        setLoading(true);

        Promise.all([
            axios.post('/api/strapi/products/getByCollection', { page: actualPage, pageSize: ITEMS_PER_PAGE, collection: collectionUrl }),
            axios.post('/api/strapi/collections/getOneByUrl', { url: collectionUrl })
        ]).then(res => {
            const products = res[0].data;
            const collection = res[1].data;
            setProducts(products.data.data);
            setCollection(collection.data.data[0]);
            setTotalProducts(products.data.meta.pagination.total);
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        if (!collectionUrl) return;
        getProducts();
    }, [actualPage, collectionUrl])

    return (
        <Layout title={`${lang.pages.collections.extensions.title} ${collection?.attributes?.nombre || ""}`}>
            <ProductsView
                title={`${lang.pages.collections.extensions.title} ${collection?.attributes?.nombre || ""}`}
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