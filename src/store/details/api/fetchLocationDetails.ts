import { RootState } from "@/app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface LocationDetail {
    id: string;
    name: string;
    shortName: string;
    coords: { lat: number; lng: number };
    image: string;
    category: string;
    rating: string;
    reviewsCount: number;
}


export interface LocationDetail {
    id: string;
    name: string;
    shortName: string;
    coords: { lat: number; lng: number };
    image: string;
    category: string;
    rating: string;
    reviewsCount: number;
}

export const getLocationDetails = createAsyncThunk<
    LocationDetail,
    { lat: number; lng: number },
    { rejectValue: string; state: RootState }
>(
    'details/getLocationDetails',
    async (coords, { rejectWithValue }) => {
        try {
            const map_key = process.env.NEXT_PUBLIC_MAP_KEY;

            if (!map_key) {
                return rejectWithValue("Map API Key is missing. Check your .env file.");
            }

            // طلب البيانات من MapTiler
            const locationDetailsURL = `https://api.maptiler.com/geocoding/${coords.lng},${coords.lat}.json?key=${map_key}&types=poi,place,address`;
            const res = await axios.get(locationDetailsURL);

            const feature = res.data?.features?.[0];

            if (!feature) {
                return rejectWithValue("Could not find any information for this location.");
            }

            const placeName = feature.text || feature.place_name?.split(',')[0] || "Unknown Location";
            const imageUrl = `https://api.maptiler.com/maps/hybrid/static/${coords.lng},${coords.lat},16/500x300.jpg?key=${map_key}`;

            const idSeed = feature.id ? feature.id.length : 7;
            const stableRating = (3.8 + (idSeed % 12) / 10).toFixed(1);
            const stableReviews = 50 + (idSeed * 3);

            return {
                id: feature.id || `${coords.lat.toFixed(4)}-${coords.lng.toFixed(4)}`,
                name: feature.place_name || placeName,
                shortName: placeName,
                coords: coords,
                image: imageUrl,
                category: feature.properties?.category?.[0] || feature.properties?.type || "Location",
                rating: stableRating,
                reviewsCount: stableReviews
            };

        } catch (error: any) {
            let errorMessage = "An unexpected error occurred";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Fetch Details Error:", errorMessage);
            return rejectWithValue(errorMessage);
        }
    },
    {
        condition: (coords, { getState }) => {
            const { details } = getState();

            if (details.status === 'loading') {
                return false;
            }

            const lastCoords = details.selectedLocation?.coords;
            if (lastCoords) {
                const isSameLat = lastCoords.lat.toFixed(4) === coords.lat.toFixed(4);
                const isSameLng = lastCoords.lng.toFixed(4) === coords.lng.toFixed(4);

                if (isSameLat && isSameLng) {
                    return false;
                }
            }

            return true;
        }
    }
);