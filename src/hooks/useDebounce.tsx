"use client";
import { useEffect, useState } from "react";

function useDebounce(text: string, delay: number) {
    const [textAfterDebounce, setTextAfterDebounce] = useState<string>(text);

    useEffect(() => {
        const handler = setTimeout(() => {
            setTextAfterDebounce(text);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [text, delay]);

    return textAfterDebounce;
}

export default useDebounce;