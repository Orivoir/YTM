import { AlbumPreviewAPI, ArtistPreviewAPI, MusicVideoAPI } from "../../api/ytm-api"

export type SearchDetailsState = MusicVideoAPI | ArtistPreviewAPI | AlbumPreviewAPI | null;

export type SearchDetailsActionName =
  "CANCEL_SEARCH_DETAILS" |
  "MUSIC_SEARCH_DETAILS" |
  "ALBUM_SEARCH_DETAILS" |
  "ARTIST_SEARCH_DETAILS";

export type SearchDetailsAction = {
  type: SearchDetailsActionName;
  music?: MusicVideoAPI;
  artist?: ArtistPreviewAPI;
  album?: AlbumPreviewAPI;
}

const INITIAL_STATE: SearchDetailsState = null

export default function searchDetailsReducers (
  state:SearchDetailsState = INITIAL_STATE,
  action: SearchDetailsAction): SearchDetailsState {
  switch (action.type) {
    case "CANCEL_SEARCH_DETAILS":
      return null
    case "ALBUM_SEARCH_DETAILS":
      return action.album || state
    case "ARTIST_SEARCH_DETAILS":
      return action.artist || state
    case "MUSIC_SEARCH_DETAILS":
      return action.music || state
    default:
      return state
  }
}
