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

export function AppContextProvider({ children }) {

    const [ auth, setAuth ] = useState({
        _id: "",
        name: "",
        surname: "",
        email: "",
        authenticated: false
    });
    const [ lang, setLang ] = useState("de");
    const [ currency, setCurrency ] = useState("EUR");
    const [ cart, setCart ] = useState([]);

    function initContext() {
        GetProfile();
        loadLanguage();
        // Load currency
        setCurrency(localStorage.getItem('currency') || "EUR");
        // Load Cart
        const lsCart = localStorage.getItem('cart') || "[]"
        setCart(JSON.parse(lsCart) || []);
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
        try {
            const config = useAuthHeaders();
            const { data } = await axios.post('/api/user/getProfile', config);
            setAuth({ 
                _id: data._id,
                name: data.name,
                surname: data.surname,
                email: data.email, 
                authenticated: true 
            });
        } catch (error) {
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