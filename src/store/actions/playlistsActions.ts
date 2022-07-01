import { PlaylistAction, PlaylistState } from "../reducers/playlistsReducer";

export const createAddMultiple = (value: PlaylistState): PlaylistAction => ({
  type: "NEW_MULTIPLE_PLAYLIST",
  value
})

export const createAddSingle = (value: {id: number; name: string}): PlaylistAction => ({
  type: "NEW_PLAYLIST",
  value
})

export const createUpdate = (value: {id: number; name: string}): PlaylistAction => ({
  type: "UPDATE_PLAYLIST",
  value
})

export const createRemove = (playlistId: number): PlaylistAction => ({
  type: "REMOVE_PLAYLIST",
  id: playlistId
})
