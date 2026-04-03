import { createSlice } from '@reduxjs/toolkit'

const getCurrentLanguage = (): string => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem('lang');
        if (saved) return saved;
    }
    return "en";
}

const initialState = {
    defaultLang: getCurrentLanguage(),
}

export const langSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        toggleLang: (state) => {
            const newLang = state.defaultLang === "ar" ? "en" : "ar";
            state.defaultLang = newLang;

            if (typeof window !== "undefined") {
                localStorage.setItem('lang', newLang);
            }
        }
    },
})

export const { toggleLang } = langSlice.actions
export default langSlice.reducer