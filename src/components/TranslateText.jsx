import axios from 'axios';
import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

export default async function TranslateText({text, lang}) {
    const [showingText, setShowingText] = useState(text);

    async function handleTranslate() {
        try {
            const response = await axios.request({
                url: `${API_URL}?key=${API_KEY}`,
                data: {
                    q: text,
                    target: lang,
                }
            });

            setShowingText(response.data.data.translations[0].translatedText || text);
        } catch (error) {
            setShowingText(text);
        }
    }

    useEffect(() => {
        handleTranslate();
    }, [])

    return (
        <div>asd</div>
    );
};