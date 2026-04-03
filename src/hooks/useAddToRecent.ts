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
    const details = useSelector((d: RootState) => d.details.selectedLocation);
    const disPatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem("recent");
            if (data) {
                try {
                    const parsedData = JSON.parse(data);
                    if (Array.isArray(parsedData)) {
                        setRecent(parsedData);
                    }
                } catch (e) {
                    console.error("Recent searches storage is corrupted", e);
                }
            }
        }
    }, []);

    const addToRecent = (newRecent: Coords) => {

        disPatch(getLocationDetails(newRecent));

        setRecent((prev) => {

            const filtered = prev.filter(
                (item) => !(item.lat === newRecent.lat && item.lng === newRecent.lng)
            );

            console.log(`name is : ${details?.name}`)
            const entryWithDetails = {
                ...newRecent,
                name: details?.name || newRecent.name || "Unknown Location"
            };

            const updated = [entryWithDetails, ...filtered].slice(0, 8);
            localStorage.setItem("recent", JSON.stringify(updated));

            return updated;
        });
    };
    return { recent, addToRecent };
};