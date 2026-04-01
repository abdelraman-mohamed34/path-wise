import { configureStore } from '@reduxjs/toolkit'
import langReducer from '../store/lang/changeLang'
import themeReducer from '../store/theme/changeTheme'
import locationReducer from '../store/location/location'

export const store = configureStore({
    reducer: {
        language: langReducer,
        theme: themeReducer,
        location: locationReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch