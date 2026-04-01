import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
    id: string;
    name: string;
    coords: { lat: number; lng: number };
}

interface RouteState {
    locations: Location[];
    optimizedOrder: string[];
    status: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: RouteState = {
    locations: [],
    optimizedOrder: [],
    status: 'idle',
};

export const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
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
});

export const { addLocation, removeLocation, setOptimizedOrder, setRouteStatus } = routeSlice.actions;
export default routeSlice.reducer;