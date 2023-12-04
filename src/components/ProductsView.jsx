import { useEffect, useState } from "react";
// Nextjs
import { useRouter } from "next/router";
// Components
import { ProductFilters } from "./ProductFilters";
import Product from "@/components/Product/Index";
// Hooks
import useGetLang from "@/hooks/useGetLang";

export default function ProductsView({ title, products = [], itemsPerPage = 12 }) {

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
        const highestPrice = Math.max(...products.map(producto => producto.price));
        setHighestPrice(highestPrice);
    }, []);

    // Pagination
    const [ actualPage, setActualPage ] = useState(1);
    const [ pagesCount, setPagesCount ] = useState(0);
    const productsCount = filteredProducts?.length;

    function calculatePages() {
        setPagesCount(Math.ceil((filteredProducts?.length / itemsPerPage)) || 0);
    }

    function handleSetPage(page) {
        setActualPage(page);
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
        if (priceFrom) setPrice(current => ({ from: priceFrom, to: current.to }));
        if (priceTo) setPrice(current => ({ from: current.from, to: priceTo }));
        if (sortBy) setSortBy(sortBy);
    }
    
    useEffect(() => {
        calculatePages();
        loadParams();

        // Get page param and set it to actualPage
        const { page } = router.query;
        setActualPage(page || 1);
    }, [router, filteredProducts]);

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
        const filter = availability > 0 ? p => p.stock > 0 : p => p.stock == 0;
        const filtered = products.filter(filter);
        return filtered;
    }

    const handleFilterByPriceFrom = (products, priceFrom) => {
        const filtered = products.filter(p => p.price >= priceFrom);
        return filtered;
    }

    const handleFilterByPriceTo = (products, priceTo) => {
        const filtered = products.filter(p => p.price <= priceTo);
        return filtered;
    }

    const handleFilterBySortBy = (products, sortBy) => {
        let filtered;
        switch (sortBy) {
            case "highPrice":
                filtered = [...products].sort((a, b) => b.price - a.price);
                break;
            case "lowPrice":
                filtered = [...products].sort((a, b) => a.price - b.price);
                break;
        }
        return filtered;
    }

    const handleResetProducts = () => {
        return products;
    };

    useEffect(() => {
        handleFilterProducts();
    }, [router])

    return (
        <>
            <ProductFilters 
                availability={{ get: availability, set: setAvailability }}
                price={{ get: price, set: setPrice }}
                sortBy={{ get: sortBy, set: setSortBy }}
                highestPrice={highestPrice}
                products={filteredProducts}
            />
            <section>
                <div className={"flex flex-col gap-16 pb-10"}>
                    <h2 className={"font-bold text-3xl md:text-4xl text-center lg:text-left"}>{title}</h2>
                    <div className={"grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-6 gap-y-10"}>
                        {(filteredProducts && productsCount != 0 && actualPage <= pagesCount) && filteredProducts.map((p, index) => (
                            <Product key={index} product={p} />
                        ))}
                    </div>
                    {(pagesCount == 0 || (actualPage > pagesCount) || productsCount == 0) && (
                        <div className={"flex flex-col items-center gap-2"}>
                            <div className={"text-2xl"}>{lang.product.notFound}</div>
                            <div>{lang.product.removeFilters.text} <button onClick={handleClearFilters} className={"underline"}>{lang.product.removeFilters.button}</button></div>
                        </div>
                    )}
                    <div className={"flex justify-center gap-2"}>
                        <button className={"w-9 h-9 border rounded-md"}><i className="fa-regular fa-angle-left"></i></button>
                        {Array.from(Array(pagesCount), (e, i) => {
                            return <button onClick={() => handleSetPage(i + 1)} className={`grid place-content-center w-9 h-9 border rounded-md ${actualPage == (i + 1) ? "bg-main text-white" : ""}`} key={i}>{i + 1}</button>
                        })}
                        <button className={"w-9 h-9 border rounded-md"}><i className="fa-regular fa-angle-right"></i></button>
                    </div>
                </div>
            </section>
        </>
    )
}