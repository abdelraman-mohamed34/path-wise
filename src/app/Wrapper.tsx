"use client";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import ThemeWrapper from "./ThemeWrapper";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeWrapper>
                {children}
            </ThemeWrapper>
        </Provider>
    );
}