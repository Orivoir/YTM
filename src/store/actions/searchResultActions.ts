import { AlbumPreviewAPI, ArtistPreviewAPI, MusicVideoAPI } from '../../api/ytm-api';
import type {SearchResultAction} from './../reducers/searchResultReducers';

export const createStartAllPending = (): SearchResultAction => ({
  type: "START_ALL_PENDING"
})

export const createNewResultArtists = (artists: ArtistPreviewAPI[]): SearchResultAction => ({
  type: "NEW_RESULT_ARTISTS",
  artists
})

export const createNewResultAlbums = (albums: AlbumPreviewAPI[]): SearchResultAction => ({
  type: "NEW_RESULT_ALBUMS",
  albums
})

export const createNewResultMusics = (musics: MusicVideoAPI[]): SearchResultAction => ({
  type: "NEW_RESULT_MUSICS",
  musics
})