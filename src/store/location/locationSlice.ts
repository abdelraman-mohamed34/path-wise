// src/store/location/locationSlice.ts

"use client";
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

type Coords = {
    lat: number;
    lng: number;
}

type Location = {
    id: string;
    name: string;
    coords: Coords;
}

type RouteState = {
    userLocation: Coords | null;
    results: Location[];
    locations: Location[];
    optimizedOrder: string[];
    status: 'idle' | 'loading' | 'success' | 'error';
    thisLocationIsMine: boolean;
}

const initialState: RouteState = {
    userLocation: null,
    thisLocationIsMine: false,
    results: [],
    locations: [],
    optimizedOrder: [],
    status: 'idle',
};

export const searchLocation = createAsyncThunk(
    'route/searchLocation',
    async (query: string, { rejectWithValue }) => {
        try {
            const API_KEY = process.env.NEXT_PUBLIC_MAP_KEY;
            const response = await axios.get(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${API_KEY}`
            );

            const features = response.data.features;
            if (!features || features.length === 0) throw new Error("المكان غير موجود");

            return features.map((f: any) => ({
                id: f.id,
                name: f.place_name,
                coords: {
                    lng: f.center[0],
                    lat: f.center[1],
                },
            })) as Location[];

        } catch (error: any) {
            return rejectWithValue(error.message || "search failed");
        }
    }
);

export const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        setUserLocation: (state, action: PayloadAction<Coords | null>) => {
            state.userLocation = action.payload;
            state.thisLocationIsMine = true;
        },
        addLocation: (state, action: PayloadAction<Location>) => {
            state.locations.push(action.payload);
        },
        removeLocation: (state, action: PayloadAction<string>) => {
            state.locations = state.locations.filter(loc => loc.id !== action.payload);
        },
        setOptimizedOrder: (state, action: PayloadAction<string[]>) => {
            state.optimizedOrder = action.payload;
            state.status = 'success';
        },
        setRouteStatus: (state, action: PayloadAction<RouteState['status']>) => {
            state.status = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchLocation.pending, (state) => {
                state.status = 'loading';
                state.results = [];
            })
            .addCase(searchLocation.fulfilled, (state, action: PayloadAction<Location[]>) => {
                state.status = 'success';
                state.results = action.payload;
                state.thisLocationIsMine = false;
            })
            .addCase(searchLocation.rejected, (state) => {
                state.status = 'error';
                state.results = [];
            })
    }
});

export const {
    setUserLocation,
    addLocation,
    removeLocation,
    setOptimizedOrder,
    setRouteStatus
} = routeSlice.actions;

export default routeSlice.reducer;