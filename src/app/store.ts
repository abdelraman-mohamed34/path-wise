import { configureStore } from '@reduxjs/toolkit'
import langReducer from '../store/lang/languageSlice'
import themeReducer from '../store/theme/themeSlice'
import locationReducer from '../store/location/locationSlice'
import detailsReducer from '../store/details/detailsSlice'
import dataReducer from '../store/global_data/dataSlice'

export const store = configureStore({
    reducer: {
        language: langReducer,
        theme: themeReducer,
        location: locationReducer,
        details: detailsReducer,
        data: dataReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch