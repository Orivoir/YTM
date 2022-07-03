import { AlbumPreviewAPI, ArtistPreviewAPI, MusicVideoAPI } from "../../api/ytm-api"
import {produce} from 'immer'

export type SearchResultState = {
  artist: ArtistPreviewAPI[];
  musics: MusicVideoAPI[];
  albums: AlbumPreviewAPI[];

  pendingState: {
    artists: boolean;
    musics: boolean;
    albums: boolean;
  }
}

export type SearchResultActionName =
  "START_ALL_PENDING" |
  "NEW_RESULT_ARTISTS" |
  "NEW_RESULT_MUSICS" |
  "NEW_RESULT_ALBUMS"

export type SearchResultAction = {
  type: SearchResultActionName;
  artists?: ArtistPreviewAPI[];
  musics?: MusicVideoAPI[];
  albums?: AlbumPreviewAPI[];
}

const INITIAL_STATE: SearchResultState = {
  albums: [],
  artist: [],
  musics: [],
  pendingState: {
    albums: false,
    artists: false,
    musics: false
  }
}

export default function searchResultReducers(
  state: SearchResultState = INITIAL_STATE,
  action: SearchResultAction
): SearchResultState {

  switch(action.type) {
    case "START_ALL_PENDING":
      return produce(state, draft => {
        draft.pendingState = {
          albums: true,
          artists: true,
          musics: true
        }
      })
    case "NEW_RESULT_ALBUMS":
      return produce(state, draft => {
        draft.albums = action.albums || draft.albums
        draft.pendingState.albums = false;
      })
    case "NEW_RESULT_ARTISTS":
      return produce(state, draft => {
        draft.artist = action.artists || draft.artist;
        draft.pendingState.artists = false;
      })
    case "NEW_RESULT_MUSICS":
      return produce(state, draft => {
        draft.musics = action.musics || draft.musics;
        draft.pendingState.musics = false;
      })
    default:
      return state;
  }
}