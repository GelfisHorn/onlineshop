import axios from 'axios';
// React
import { createContext, useEffect, useState } from 'react';
// Nextjs
import { useRouter } from 'next/router';
// Langs
import langs from '../langs'
// Hooks
import useAuthHeaders from '@/hooks/useAuthHeaders';

const AppContext = createContext();

const CART_DEFAULT = {
    products: [],
    discountCode: ""
}

export function AppContextProvider({ children }) {

    const [ auth, setAuth ] = useState({
        _id: "",
        name: "",
        surname: "",
        email: "",
        authenticated: false,
        loading: true
    });
    const [ lang, setLang ] = useState("de");
    const [ currency, setCurrency ] = useState("EUR");
    const [ cart, setCart ] = useState(CART_DEFAULT);

    function initContext() {
        GetProfile();
        loadLanguage();
        // Load currency
        setCurrency(localStorage.getItem('currency') || "EUR");
        // Load Cart
        const lsCart = localStorage.getItem('cart');
        setCart(JSON.parse(lsCart) || CART_DEFAULT);
        if(!lsCart) {
            localStorage.setItem('cart', JSON.stringify(CART_DEFAULT))
        }
    }
 
    function loadLanguage() {
        const newLang = window.location.pathname.split('/')[1];
        const validLanguage = Object.keys(langs).includes(newLang);

        if (validLanguage) {
            setLang(newLang);
            localStorage.setItem('lang', newLang);
        } else {
            setLang(localStorage.getItem('lang') || 'de');
            if(newLang == "") return;
            // router.push('/404');
        }
    }

    async function GetProfile() {
        const config = useAuthHeaders();
        if(!config) {
            setAuth({ authenticated: false, loading: false });
            return;
        };
        
        try {
            const { data } = await axios.post('/api/user/getProfile', config);
            setAuth({ 
                _id: data._id,
                name: data.name,
                surname: data.surname,
                email: data.email, 
                address: data.address,
                postalCode: data.postalCode,
                city: data.city,
                phoneNumber: data.phoneNumber,
                authenticated: true,
                loading: false
            });
        } catch (error) {
            setAuth(current => {
                return {...current, loading: false }
            });
            return;
        } 
    }

    useEffect(() => {
        initContext();
    }, []);

    return (
        <AppContext.Provider value={{ 
            auth,
            setAuth,
            lang,
            setLang,
            currency,
            setCurrency,
            cart,
            setCart
        }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContext