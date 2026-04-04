import { AppDispatch } from "@/app/store";
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
    const disPatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const storedData = localStorage.getItem("favorites");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (Array.isArray(parsedData)) setFavors(parsedData);
            } catch (e) {
                console.error("Favorites storage is corrupted", e);
            }
        }
    }, []);

    const addToFavors = async (newFavors: Coords) => {
        try {
            const result = await disPatch(getLocationDetails(newFavors)).unwrap();
            const entryWithDetails = {
                ...newFavors,
                name: result?.name || "Unknown Location"
            };

            setFavors((prevFavors) => {
                const filtered = prevFavors.filter(
                    (item) => !(item.lat === newFavors.lat && item.lng === newFavors.lng)
                );
                const updated = [entryWithDetails, ...filtered].slice(0, 8);
                localStorage.setItem("favorites", JSON.stringify(updated));

                return updated;
            });

        } catch (error) {
            console.error("Failed to add to favorites", error);
        }
    };

    return { favors, addToFavors };
};


