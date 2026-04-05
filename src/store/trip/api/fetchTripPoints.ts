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
    'trip/fetchTripPoints',
    async ({ sCoords, eCoords }: { sCoords: any; eCoords: any }, { rejectWithValue, signal }) => {
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

            return response.data.routes[0].geometry.coordinates.map((coord: any) => ({
                lat: coord[1],
                lng: coord[0],
            }));
        } catch (error: any) {
            if (axios.isCancel(error)) {
                console.log('Request cancelled');
                return rejectWithValue('cancelled');
            }
            return rejectWithValue(error.message || 'Failed to fetch route');
        }
    }
);