import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCloser = createAsyncThunk(
    'route/fetchCloser',
    async (coords: { lat: number; lng: number }, { rejectWithValue }) => {
        try {
            const map_key = process.env.NEXT_PUBLIC_MAP_KEY;
            const lat = coords.lat;
            const lng = coords.lng;

            if (!lat || !lng) return [];

            const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${map_key}`;
            const response = await axios.get(url);

            return response.data.features.map((feature: any) => formatFeature(feature, map_key));

        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const formatFeature = (feature: any, map_key: string | undefined) => {
    const [fLng, fLat] = feature.center;

    const seed = feature.id ? feature.id.length : 7;
    const stableRating = (4.2 + (seed % 8) / 10).toFixed(1);
    const stableReviews = 50 + (seed * 11) % 900;

    return {
        id: feature.id,
        name: feature.place_name,
        shortName: feature.text || "Nearby Place",
        coords: { lat: fLat, lng: fLng },
        image: `https://api.maptiler.com/maps/hybrid/static/${fLng},${fLat},16/400x300.jpg?key=${map_key}`,
        category: feature.properties?.category || feature.place_type?.[0] || "Location",
        rating: stableRating,
        reviewsCount: stableReviews,
    };
};