import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ThemeState = {
    mode: 'dark' | 'light'
}

const getInitialTheme = (): 'dark' | 'light' => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("theme") as 'dark' | 'light';
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark";
}

const initialState: ThemeState = {
    mode: getInitialTheme(),
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", state.mode);
            }
        },
        setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
            state.mode = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", state.mode);
            }
        }
    },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer