import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Props = {
    inputSearch?: string
}

// states
const initialState: Props = {
    inputSearch: ''
};

export const data = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.inputSearch = action.payload
        },
        deleteSearch: (state) => {
            state.inputSearch = ''
        }
    },
});

export const { setSearch, deleteSearch } = data.actions;
export default data.reducer;