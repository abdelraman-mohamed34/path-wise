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

export const getLocationDetails = createAsyncThunk<LocationDetail, { lat: number; lng: number }, { rejectValue: string }>(
    'route/getLocationDetails',
    async (coords, { rejectWithValue }) => {
        try {
            const map_key = process.env.NEXT_PUBLIC_MAP_KEY;

            if (!map_key) {
                return rejectWithValue("Map API Key is missing. Check your .env file.");
            }

            const locationDetailsURL = `https://api.maptiler.com/geocoding/${coords.lng},${coords.lat}.json?key=${map_key}&types=poi,place,address`;
            const res = await axios.get(locationDetailsURL);

            const feature = res.data?.features?.[0];

            if (!feature) {
                return rejectWithValue("Could not find any information for this location.");
            }

            // MapTiler ساعات بترجع الاسم في 'text' وساعات 'place_name'
            const placeName = feature.text || feature.place_name?.split(',')[0] || "Unknown Location";

            const imageUrl = `https://api.maptiler.com/maps/hybrid/static/${coords.lng},${coords.lat},16/500x300.jpg?key=${map_key}`;

            return {
                id: feature.id || `${coords.lat}-${coords.lng}`,
                name: feature.place_name || placeName,
                shortName: placeName,
                coords: coords,
                image: imageUrl,
                category: feature.properties?.category?.[0] || feature.properties?.type || "Location",
                // الـ Logic بتاعك للـ rating ممتاز للـ Dummy Data
                rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
                reviewsCount: Math.floor(Math.random() * 500) + 50
            };

        } catch (error: any) {
            // معالجة أخطاء axios بشكل احترافي
            let errorMessage = "An unexpected error occurred";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error("Fetch Details Error:", errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);