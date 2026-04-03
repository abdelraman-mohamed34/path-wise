import { AppDispatch, RootState } from "@/app/store";
import { getLocationDetails } from "@/store/details/api/fetchLocationDetails";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type Coords = {
    name?: string;
    lat: number;
    lng: number;
};

export const useFavorites = () => {
    const [favors, setFavors] = useState<Coords[]>([]);
    const details = useSelector((d: RootState) => d.details.selectedLocation);
    const disPatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const data = localStorage.getItem("favorites");
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                if (Array.isArray(parsedData)) {
                    setFavors(parsedData);
                }
            } catch (e) {
                console.error("Favorites storage is corrupted", e);
            }
        }
    }, []);

    const addToFavors = (newFavors: Coords) => {
        disPatch(getLocationDetails(newFavors));

        setFavors((prev) => {
            const filtered = prev.filter(
                (item) => !(item.lat === newFavors.lat && item.lng === newFavors.lng)
            );

            const entryWithDetails = {
                ...newFavors,
                name: newFavors.name || details?.name || "Saved Location"
            };

            const updated = [entryWithDetails, ...filtered].slice(0, 8);
            localStorage.setItem("favorites", JSON.stringify(updated));

            return updated;
        });
    };

    return { favors, addToFavors };
};