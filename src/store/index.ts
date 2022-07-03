import { configureStore, combineReducers } from "@reduxjs/toolkit"

import downloadReducers from "./reducers/downloadReducers"
import playLocalReducers from "./reducers/playLocalReducers"
import playlistsReducers from "./reducers/playlistsReducer"
import searchResultReducers from "./reducers/searchResultReducers"

const combinedReducers = combineReducers({
  download: downloadReducers,
  playLocal: playLocalReducers,
  playlists: playlistsReducers,
  searchResult: searchResultReducers
})

const store = configureStore({
  reducer: combinedReducers
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
