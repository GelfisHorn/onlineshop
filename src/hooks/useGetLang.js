import langs from "@/langs";
// Context
import useAppContext from '@/hooks/useAppContext';

export default function useGetLang() {
    const { lang: contextLang } = useAppContext();
    let lang;
    
    switch (contextLang) {
        case 'de':
            lang = langs.de
            break;
        case 'en':
            lang = langs.en
            break;
        case 'es':
            lang = langs.es
            break;
        default:
            lang = langs.de
            break;
    }

    return lang;
}