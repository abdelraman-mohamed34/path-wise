import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCloser } from './api/fetchClosestPlacesThunk';
import { getLocationDetails } from './api/fetchLocationDetails';

type LocationDetail = {
    id: string;
    name: string;
    shortName: string;
    coords: { lat: number; lng: number };
    image: string;
    category: string;
    rating: string;
    reviewsCount: number;
}
type Coords = {
    name?: string
    lat: number,
    lng: number
}

type DetailsState = {
    selectedLocation: LocationDetail | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
    nearbyPlaces: LocationDetail[];
    nearbyLoading: boolean;
    recentSearched?: (Coords[] | null);
}

// states
const initialState: DetailsState = {
    selectedLocation: null,
    status: 'idle',
    error: null,
    nearbyPlaces: [],
    nearbyLoading: false,
    recentSearched: null,
};

export const details = createSlice({
    name: 'details',
    initialState,
    reducers: {
        clearDetails: (state) => {
            state.selectedLocation = null;
            state.status = 'idle';
        },
        addToRecentSearched: (state, action) => {
            state.recentSearched = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLocationDetails.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getLocationDetails.fulfilled, (state, action: PayloadAction<LocationDetail>) => {
                state.status = 'success';
                state.selectedLocation = action.payload;
            })
            .addCase(getLocationDetails.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload as string;
            })

            .addCase(fetchCloser.pending, (state) => {
                state.nearbyLoading = true;
            })
            .addCase(fetchCloser.fulfilled, (state, action: PayloadAction<LocationDetail[]>) => {
                state.nearbyLoading = false;
                state.nearbyPlaces = action.payload;
            })
            .addCase(fetchCloser.rejected, (state) => {
                state.nearbyLoading = false;
            });
    }
});

export const { clearDetails, addToRecentSearched } = details.actions;
export default details.reducer;