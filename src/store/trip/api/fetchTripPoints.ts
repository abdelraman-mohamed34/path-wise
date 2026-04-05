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

interface TripResult {
    geometry: {
        type: "LineString";
        coordinates: number[][];
    };
    distance: number;
    duration: number;
}

export const fetchTripPoints = createAsyncThunk<TripResult, FetchTripParams>(
    'trip/fetchTripPoints',
    async ({ sCoords, eCoords }, { rejectWithValue, signal }) => {
        try {
            const response = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${sCoords.lng},${sCoords.lat};${eCoords.lng},${eCoords.lat}?overview=full&geometries=geojson`,
                {
                    signal,
                    timeout: 10000
                }
            );

            if (response.data.code !== 'Ok') {
                return rejectWithValue('Route not found');
            }

            const route = response.data.routes[0];

            return {
                geometry: route.geometry,   // { type: "LineString", coordinates: number[][] }
                distance: route.distance,   // meters
                duration: route.duration,   // seconds
            };
        } catch (error: any) {
            if (axios.isCancel(error)) {
                console.log('Request cancelled');
                return rejectWithValue('cancelled');
            }
            return rejectWithValue(error.message || 'Failed to fetch route');
        }
    }
);