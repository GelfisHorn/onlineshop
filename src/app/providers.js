'use client';

import { AppContextProvider } from "@/context/AppContext";

export function Providers({ children }) {
    return (
        <AppContextProvider>
            {children}
        </AppContextProvider>
    );
}