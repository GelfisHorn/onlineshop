import { useEffect, useState } from "react";
// Nextjs
import { useRouter } from "next/router";
// Components
import { ProductFilters } from "./ProductFilters";
import Product from "@/components/Product/Index";
import Loading from "@/components/Loading/Index";
// Hooks
import useGetLang from "@/hooks/useGetLang";
// Animations
import { motion } from "framer-motion";
const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.1,
            staggerChildren: 0.1
        }
    }
};

export default function ProductsView({ title, loading, products = [], totalProducts, itemsPerPage = 12, actualPage, setActualPage }) {

    const router = useRouter();
    const lang = useGetLang();

    // Filters
    const [ filteredProducts, setFilteredProducts ] = useState(products);
    const [ availability, setAvailability ] = useState(null);
    const [ price, setPrice ] = useState({ from: null, to: null });
    const [ sortBy, setSortBy ] = useState(null);
    
    // Highest product price
    const [ highestPrice, setHighestPrice ] = useState(0);
    useEffect(() => {
        if(products.length == 0) return
        let variantes = [];
        products.map(p => {
            variantes = variantes.concat(p.attributes.variante)
        });
        const highestPrice = Math.max(...variantes.map(v => v.precio));
        setHighestPrice(highestPrice);
    }, [products]);

    // Pagination
    const [ pagesCount, setPagesCount ] = useState(null);
    const productsCount = totalProducts;

    function calculatePages() {
        setPagesCount(Math.ceil((productsCount / itemsPerPage)) || 0);
    }

    function handleSetPage(page) {
        if(page < 1) return;
        if(page > pagesCount) return;
        router.push({ query: {...router.query, page} });
    }

    function handleClearFilters() {
        setAvailability(null);
        setPrice({ from: null, to: null });
        setSortBy(null);

        const params = ['page', 'availability', 'priceFrom', 'priceTo', 'sortBy'];
        removeQueryParams(params);
    }

    const removeQueryParams = (array) => {
        const { pathname, query } = router;
        const params = new URLSearchParams(query);
        array.map(param => params.delete(param));
        router.replace({ pathname, query: params.toString() });
    };

    function loadParams() {
        const { availability, priceFrom, priceTo, sortBy } = router.query;
        if (availability) setAvailability(availability);
        if (priceFrom && (Number(priceFrom || 0) <= Number(priceTo || 0))) setPrice(current => ({ from: priceFrom, to: current.to }));
        if (priceTo && (Number(priceTo || 0) >= Number(priceFrom || 0))) setPrice(current => ({ from: current.from, to: priceTo }));
        if (sortBy) setSortBy(sortBy);
    }
    
    useEffect(() => {
        if(!setActualPage) return;
        
        calculatePages();
        loadParams();

        // Get page param and set it to actualPage
        const { page } = router.query;
        setActualPage(Number(page) || 1);
    }, [router, filteredProducts, setActualPage]);

    const handleFilterProducts = () => {
        const { availability, priceFrom, priceTo, sortBy } = router.query || {};
        
        const resetProducts = handleResetProducts();
        let products = resetProducts;
        if (availability) products = handleFilterByAvailability(products, availability);
        if (priceFrom) products = handleFilterByPriceFrom(products, priceFrom);
        if (priceTo) products = handleFilterByPriceTo(products, priceTo);
        if (sortBy) products = handleFilterBySortBy(products, sortBy);

        setFilteredProducts(products);
    }

    const handleFilterByAvailability = (products, availability) => {
        const filter = availability > 0 ? p => p.attributes.stock > 0 : p => p.attributes.stock == 0;
        const filtered = products.filter(filter);
        return filtered;
    }

    const handleFilterByPriceFrom = (products, priceFrom) => {
        const filtered = products.filter(p => p.attributes.variante[p.attributes.variante.length - 1].precio >= priceFrom);
        return filtered;
    }

    const handleFilterByPriceTo = (products, priceTo) => {
        const filtered = products.filter(p => p.attributes.variante[0].precio <= priceTo);
        return filtered;
    }

    const handleFilterBySortBy = (products, sortBy) => {
        let filtered;
        switch (sortBy) {
            case "highPrice":
                filtered = [...products].sort((a, b) => b.attributes.variante[b.attributes.variante.length - 1].precio - a.attributes.variante[a.attributes.variante.length - 1].precio);
                break;
            case "lowPrice":
                filtered = [...products].sort((a, b) => a.attributes.variante[0].precio - b.attributes.variante[0].precio);
                break;
        }
        return filtered;
    }

    const handleResetProducts = () => {
        return products;
    };

    useEffect(() => {
        handleFilterProducts();
    }, [router, products])

    return (
        <>
            <ProductFilters 
                availability={{ get: availability, set: setAvailability }}
                price={{ get: price, set: setPrice }}
                sortBy={{ get: sortBy, set: setSortBy }}
                highestPrice={highestPrice}
                products={filteredProducts}
                totalProducts={totalProducts}
            />
            <section>
                <div className={"flex flex-col gap-16 pb-10"}>
                    <h2 className={"font-bold text-3xl md:text-4xl text-center lg:text-left"}>{title}</h2>
                    {!loading && (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className={"grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-6 gap-y-10"}
                        >
                            {(filteredProducts.length != 0 && productsCount != 0 && actualPage <= pagesCount) && filteredProducts.map((p, index) => (
                                <Product key={index} product={p} />
                            ))}
                        </motion.div>
                    )}
                    {loading && (
                        <div className={"grid place-content-center min-h-[40vh]"}>
                            <Loading />
                        </div>
                    )}
                    {(pagesCount == 0 || (actualPage > pagesCount) || productsCount == 0 || filteredProducts.length == 0) && !loading && (
                        <div className={"flex flex-col items-center gap-2 text-center"}>
                            <div className={"text-2xl"}>{lang.product.notFound}</div>
                            <div>{lang.product.removeFilters.text} <button onClick={handleClearFilters} className={"underline"}>{lang.product.removeFilters.button}</button></div>
                        </div>
                    )}
                    <div className={"flex justify-center gap-2"}>
                        <button onClick={() => handleSetPage(actualPage - 1)} className={"w-9 h-9 border rounded-md"}><i className="fa-regular fa-angle-left"></i></button>
                        {filteredProducts.length != 0 && Array.from(Array(pagesCount), (e, i) => {
                            return <button onClick={() => handleSetPage(i + 1)} className={`grid place-content-center w-9 h-9 border rounded-md ${actualPage == (i + 1) ? "bg-main text-white" : ""}`} key={i}>{i + 1}</button>
                        })}
                        <button onClick={() => handleSetPage(actualPage + 1)} className={"w-9 h-9 border rounded-md"}><i className="fa-regular fa-angle-right"></i></button>
                    </div>
                </div>
            </section>
        </>
    )
}