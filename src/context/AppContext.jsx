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

    const router = useRouter();

    const [ auth, setAuth ] = useState({
        _id: "",
        name: "",
        surname: "",
        email: "",
        authenticated: false,
        loading: true
    });
    const [ darkMode, setDarkMode ] = useState(false);
    const [ lang, setLang ] = useState("es");
    const [ currency, setCurrency ] = useState("EUR");
    const [ cart, setCart ] = useState(CART_DEFAULT);

    function initContext() {
        GetProfile();
        loadLanguage();
        // Load currency
        setCurrency("EUR");
        // Load Cart
        const lsCart = localStorage.getItem('cart');
        setCart(JSON.parse(lsCart) || CART_DEFAULT);
        if(!lsCart) {
            localStorage.setItem('cart', JSON.stringify(CART_DEFAULT))
        }
        // Theme
        const theme = JSON.parse(localStorage.getItem('theme'));
        if(!theme) localStorage.setItem('theme', false);
        setDarkMode(theme || false)
    }
 
    function loadLanguage() {
        const newLang = window.location.pathname.split('/')[1];
        const validLanguage = Object.keys(langs).includes(newLang);

        if (validLanguage) {
            setLang(newLang);
            localStorage.setItem('lang', newLang);
        } else {
            const lang = localStorage.getItem('lang') || 'es'; 
            setLang(lang);
            router.push({ query: { ...router.query, lang } });
            if(newLang == "") return;
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
            darkMode,
            setDarkMode,
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