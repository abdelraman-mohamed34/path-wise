import { AppDispatch, RootState } from "@/app/store";
import { getLocationDetails } from "@/store/details/api/fetchLocationDetails";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type Coords = {
    name?: string;
    lat: number;
    lng: number;
};

export const useRecentSearches = () => {
    const [recent, setRecent] = useState<Coords[]>([]);
    const disPatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const data = localStorage.getItem("recent");
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                if (Array.isArray(parsedData)) setRecent(parsedData);
            } catch (e) { console.error(e); }
        }
    }, []);

    const addToRecent = async (newRecent: Coords) => {
        try {
            const result = await disPatch(getLocationDetails(newRecent)).unwrap();

            const entryWithDetails = {
                ...newRecent,
                name: result?.name || "Unknown Location"
            };

            setRecent((prev) => {
                const filtered = prev.filter(
                    (item) => !(item.lat === newRecent.lat && item.lng === newRecent.lng)
                );
                const updated = [entryWithDetails, ...filtered].slice(0, 8);
                localStorage.setItem("recent", JSON.stringify(updated));
                return updated;
            });
        } catch (error) {
            console.error("Failed to fetch location details", error);
        }
    };

    return { recent, addToRecent };
};