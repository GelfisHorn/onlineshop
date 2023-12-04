import { useRef, useState } from "react"
// Nextjs
import { useRouter } from "next/router";
// Hooks
import useAppContext from "@/hooks/useAppContext";
import useClickOutside from "@/hooks/useClickOutside";
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter";
import useGetLang from "@/hooks/useGetLang";
// Animations
import { motion, AnimatePresence } from "framer-motion";

export function ProductFilters({ availability, price, sortBy, highestPrice, products }) {

    const router = useRouter();

    const { currency } = useAppContext();
    const lang = useGetLang();

    // SortBy
    const sortRef = useRef(null);
    const [ showSortModal, setShowSortModal ] = useState(false);
    const handleShowSortModal = () => setShowSortModal(!showSortModal);
    useClickOutside(sortRef, () => setShowSortModal(false));

    const handleUpdateFromPrice = (from) => {
        price.set({...price.get, from});

        if(from != "") {
            router.push({ query: { ...router.query, priceFrom: from } });
        } else {
            removeQueryParams(["priceFrom"]);
        }
    };

    const handleUpdateToPrice = (to) => {
        price.set({ ...price.get, to });

        if (to != "") {
            router.push({ query: { ...router.query, priceTo: to } });
        } else {
            removeQueryParams(["priceTo"]);
        }
    }

    const handleClearPrice = () => {
        price.set({ from: null, to: null });
        removeQueryParams(["priceFrom", "priceTo"]);
    }

    const handleUpdateAvailability = (newValue) => {
        if(availability.get == newValue) {
            availability.set(null);
            removeQueryParams(["availability"]);
            return;
        }
        availability.set(newValue);
        router.push({ query: { ...router.query, availability: newValue } });
    }

    const handleUpdateSortBy = (newValue) => {
        if(sortBy.get == newValue) {
            removeQueryParams(["sortBy"]);
            sortBy.set(null);
            handleShowSortModal();
            return;
        }
        sortBy.set(newValue);
        router.push({ query: { ...router.query, sortBy: newValue } });
        handleShowSortModal();
    };

    const removeQueryParams = (array) => {
        const { pathname, query } = router;
        const params = new URLSearchParams(query);
        array.map(param => params.delete(param));
        router.replace({ pathname, query: params.toString() });
    };

    const CurrencyFormatter = (price) => useCurrencyFormatter(currency).format(price);

    return (
        <div className={"flex flex-col gap-3"}>
            <div className={"border-b md:px-[5rem] lg:px-[10rem] py-5 md:h-20"}>
                <div className={"flex flex-col md:flex-row items-center md:justify-between h-full gap-5 md:gap-0"}>
                    <Button text={lang.product.filters.availability}>
                        <Modal>
                            <div className={"flex flex-col text-sm py-5 min-w-[300px]"}>
                                <div className={"flex items-center justify-end border-b pb-5 px-5"}>
                                    <button className={"underline"} onClick={() => { availability.set(null); removeQueryParams(["availability"]) }}>{lang.product.filters.clear}</button>
                                </div>
                                <div className={"flex flex-col gap-1 pt-5 px-5"}>
                                    <div className={"flex items-center gap-2"}>
                                        <input type="checkbox" id="inStock" onChange={e => handleUpdateAvailability(1)} checked={availability.get == 1 ? true : false} />
                                        <label htmlFor="inStock">{lang.product.filters.inStock}</label>
                                    </div>
                                    <div className={"flex items-center gap-2"}>
                                        <input type="checkbox" id="outOfStock" onChange={e => handleUpdateAvailability(0)} checked={availability.get == 0 ? true : false} />
                                        <label htmlFor="outOfStock">{lang.product.filters.outOfStock}</label>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </Button>
                    <Button text={lang.product.filters.price}>
                        <Modal>
                            <div className={"flex flex-col text-sm py-5 min-w-[300px]"}>
                                <div className={"flex items-center justify-between border-b pb-5 px-5"}>
                                    <div className={"flex items-center gap-1"}>
                                        {highestPrice > 0 && (
                                            <>
                                                <span>{lang.product.filters.highestPrice}</span>
                                                <span>{CurrencyFormatter(highestPrice)}</span>
                                            </>
                                        )}
                                    </div>
                                    <button onClick={handleClearPrice} className={"underline"}>{lang.product.filters.clear}</button>
                                </div>
                                <div className={"flex gap-2 pt-5 px-5"}>
                                    <div className={"flex items-center gap-2 w-1/2"}>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder={lang.product.filters.from}
                                            className={"border border-neutral-400 p-2 outline-none rounded-sm w-full"}
                                            value={price.get.from || ""}
                                            onChange={(e) => handleUpdateFromPrice(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className={"flex items-center gap-2 w-1/2"}>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder={lang.product.filters.to}
                                            className={"border border-neutral-400 p-2 outline-none rounded-sm w-full"}
                                            value={price.get.to || ""}
                                            onChange={(e) => handleUpdateToPrice(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </Button>
                    <div className={"relative flex items-center gap-3 h-full"}>
                        <div className={"flex items-center gap-1 h-full"}>
                            <span>{lang.product.filters.sortBy}</span>
                        </div>
                        <div className={"h-full"} ref={sortRef}>
                            <button className={"flex items-center gap-3 h-full"} onClick={handleShowSortModal}>
                                <span>{lang.product.filters[sortBy.get] || lang.product.filters.select}</span>
                                <i className="fa-light fa-angle-down"></i>
                            </button>
                            {showSortModal && (
                                <Modal>
                                    <div className={"flex flex-col text-sm min-w-[200px]"}>
                                        <button onClick={() => handleUpdateSortBy("lowPrice")} className={`${sortBy.get == "lowPrice" ? "bg-main text-white" : ""} hover:bg-main hover:text-white transition-colors px-4 py-3`}>{lang.product.filters.lowPrice}</button>
                                        <button onClick={() => handleUpdateSortBy("highPrice")} className={`${sortBy.get == "highPrice" ? "bg-main text-white" : ""} hover:bg-main hover:text-white transition-colors px-4 py-3 rounded-b-md`}>{lang.product.filters.highPrice}</button>
                                    </div>
                                </Modal>
                            )}
                        </div>
                    </div>
                    <div className={"hidden md:flex items-center gap-1 h-full text-neutral-500"}>
                        <span className={"font-semibold"}>{products.length}</span>
                        <span>{lang.product.filters.products}</span>
                    </div>
                </div>
            </div>
            <div className={"flex items-center gap-2 px-[10rem]"}>
                {availability.get != null ? <Tag>{lang.product.filters.availability}: {availability.get == 0 ? lang.product.filters.outOfStock : lang.product.filters.inStock}</Tag> : null}
                {price.get.from ? <Tag>{`${lang.product.filters.price} (MIN): ${CurrencyFormatter(price.get.from || 0)}`}</Tag> : null}
                {price.get.to ? <Tag>{`${lang.product.filters.price} (MAX): ${CurrencyFormatter(price.get.to || 0)}`}</Tag> : null}
                {sortBy.get ? <Tag>{`${lang.product.filters.sortBy} ${lang.product.filters[sortBy.get]}`}</Tag> : null}
            </div>
        </div>
    )
}

function Tag({ children }) {
    return (
        <div className={"flex items-center gap-2 py-1 px-2 rounded-full text-xs border w-fit select-none"}>
            <span className={"font-medium"}>{children}</span>
            {/* <i className="fa-solid fa-xmark"></i> */}
        </div>
    )
}

function Button({ text, children }) {

    const [ showModal, setShowModal ] = useState(false);
    const handleShowModal = () => setShowModal(!showModal);
    
    const modalRef = useRef(null);
    useClickOutside(modalRef, () => setShowModal(false));

    return (
        <div className={"relative h-full"} ref={modalRef}>
            <button className={"flex items-center gap-3 h-full"} onClick={handleShowModal}>
                <span>{text}</span>
                <i className="fa-light fa-angle-down"></i>
            </button>
            {showModal && (
                children
            )}
        </div>
    )
}

function Modal({ children }) {

    return(
        <div 
            className={"absolute top-10 md:top-16 left-1/2 -translate-x-1/2 bg-white shadow-md border rounded-md z-10 select-none"}
        >
            {children}
        </div>
    )
}