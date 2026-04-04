"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTripPoints } from './api/fetchTripPoints';

type TripState = {
    coordinates: number[][];
    distance: number | null;
    duration: number | null;
    status: 'idle' | 'loading' | 'error' | 'success';
    userLocation: { lat: number; lng: number } | null;
}

const initialState: TripState = {
    coordinates: [],
    distance: null,
    duration: null,
    status: 'idle',
    userLocation: null,
};

export const tripSlice = createSlice({
    name: 'trip',
    initialState,
    reducers: {
        clearTrip: (state) => {
            state.coordinates = [];
            state.distance = null;
            state.duration = null;
            state.status = 'idle';
            state.userLocation = null;
        },
        setUserLocation: (state, action: PayloadAction<{ lat: number; lng: number } | null>) => {
            state.userLocation = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTripPoints.pending, (state) => {
                state.status = 'loading';
                state.coordinates = [];
            })
            .addCase(fetchTripPoints.fulfilled, (state, action: any) => {
                state.status = 'success';
                state.coordinates = action.payload.geometry.coordinates;
                state.distance = action.payload.distance;
                state.duration = action.payload.duration;
            })
            .addCase(fetchTripPoints.rejected, (state) => {
                state.status = 'error';
                state.coordinates = [];
            })
    }
});

export const { clearTrip, setUserLocation } = tripSlice.actions;
export default tripSlice.reducer;