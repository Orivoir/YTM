import { AlbumPreviewAPI, MusicVideoAPI } from "../../api/ytm-api"
import type {
  SearchDetailsAction
} from "../reducers/searchDetailsReducers"

export const createCancel = (): SearchDetailsAction => ({
  type: "CANCEL_SEARCH_DETAILS"
})

export const createMusicSearchDetails = (music: MusicVideoAPI): SearchDetailsAction => ({
  type: "MUSIC_SEARCH_DETAILS",
  music
})

export const createAlbumSearchDetails = (album: AlbumPreviewAPI): SearchDetailsAction => ({
  type: "ALBUM_SEARCH_DETAILS",
  album
})

export const createArtistSearchDetails = (artist: AlbumPreviewAPI): SearchDetailsAction => ({
  type: "ARTIST_SEARCH_DETAILS",
  artist
})
