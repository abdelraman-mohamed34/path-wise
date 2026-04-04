import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Coords {
    lat: number;
    lng: number;
}

interface FetchTripParams {
    sCoords: Coords; // Start Coords
    eCoords: Coords; // End Coords
}

export const fetchTripPoints = createAsyncThunk(
    'route/fetchTripPoints',
    async ({ sCoords, eCoords }: FetchTripParams, { rejectWithValue }) => {
        try {
            const map_key = process.env.NEXT_PUBLIC_MAP_KEY;

            if (!sCoords.lat || !eCoords.lat) {
                return rejectWithValue("Missing coordinates");
            }

            const url = `https://router.project-osrm.org/route/v1/driving/${sCoords.lng},${sCoords.lat};${eCoords.lng},${eCoords.lat}?overview=full&geometries=geojson`;
            const response = await axios.get(url);
            const data = response.data;
            return data.routes[0];

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);