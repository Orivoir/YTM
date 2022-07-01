export type PlaylistState = {
  id: number;
  name: string;
}[]

export type PlaylistActionName =
  "NEW_PLAYLIST" |
  "NEW_MULTIPLE_PLAYLIST" |
  "REMOVE_PLAYLIST" |
  "UPDATE_PLAYLIST"

export type PlaylistAction = {
  type: PlaylistActionName;
  value?: PlaylistState | {id: number; name: string};
  id?: number;
}

const INITIAL_STATE: PlaylistState = [];

export default function playlistsReducers(
  state: PlaylistState = INITIAL_STATE,
  action: PlaylistAction
): PlaylistState {

  switch(action.type) {
    case "NEW_PLAYLIST":
      return (!!action.value && !(action.value instanceof Array)) ? [
        ...state,
        action.value
      ]: state
    case "NEW_MULTIPLE_PLAYLIST":
      return (!!action.value && (action.value instanceof Array)) ? [
        ...state,
        ...action.value
      ]: state
    case "REMOVE_PLAYLIST":
      return (!!action.id) ? state.filter(playlist => (
        playlist.id !== action.id
      )): state
    case "UPDATE_PLAYLIST":
      if((!!action.value && !(action.value instanceof Array))) {
        const val = action.value;
        return state.map(playlist => (
          val.id === playlist.id ? val: playlist
        ))
      } else {
        return state;
      }
    default:
      return state;
  }
}