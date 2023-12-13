import useAppContext from "./useAppContext";

export default function useAddToCart(product, set) {
    const ls = localStorage.getItem('cart') || '[]';
    const cart = JSON.parse(ls);

    const productId = product.id;
    const productIsInCart = cart.products.find(p => p.id == productId);
    if(productIsInCart) {
        const newCart = cart?.products?.map(p => {
            if(p.id == productId) {
                return {...p, count: p.count + 1 }
            }
            return p;
        })
        localStorage.setItem('cart', JSON.stringify({ ...cart, products: newCart }));
        set(current => { return { ...current, products: newCart }});
        return;
    }

    const newCart = cart.products.concat([product]);
    localStorage.setItem('cart', JSON.stringify({ ...cart, products: newCart }));
    set(current => { return { ...current, products: newCart } });
}