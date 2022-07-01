import * as React from "react"
import { ScrollView } from "react-native"
import type { AlbumPreviewAPI, AlbumTypeAPI, ArtistPreviewAPI, MusicVideoAPI } from "../../api/ytm-api"
import MusicDetails from "../MusicDetails/MusicDetails"
import SearchList from "../SearchList/SearchList"

interface SearchResultProps {
  albums: AlbumPreviewAPI[];
  musics: MusicVideoAPI[];
  artists: ArtistPreviewAPI[];
}

export type SearchItemHelper = {
  isAlbum: (details: AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI) => details is AlbumPreviewAPI;
  isArtist: (details: AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI) => details is ArtistPreviewAPI;
  isMusic: (details: AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI) => details is MusicVideoAPI;
}

export type SearchItemDetailsCallback = () => AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI;

export type SearchItemType = {
  id?: string | number;
  title: string;
  thumbnailUrl: string;
  subtitle?: string;

  getDetails: SearchItemDetailsCallback;
} & SearchItemHelper;

const SearchResult: React.FC<SearchResultProps> = ({
  albums,
  musics,
  artists
}) => {
  const isAlbum: (details: AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI) => details is AlbumPreviewAPI = (details): details is AlbumPreviewAPI => {
    return !!(details as AlbumPreviewAPI).albumId
  }
  const isArtist: (details: AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI) => details is ArtistPreviewAPI = (details): details is ArtistPreviewAPI => {
    return !!(details as ArtistPreviewAPI).artistId
  }
  const isMusic: (details: AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI) => details is MusicVideoAPI = (details): details is MusicVideoAPI => {
    return !!(details as MusicVideoAPI).youtubeId
  }

  const helpers: SearchItemHelper = {
    isAlbum,
    isArtist,
    isMusic
  }

  const albumsNormalized = React.useMemo<SearchItemType[]>(() => albums.map(album => ({
    id: album.albumId,
    thumbnailUrl: album.thumbnailUrl || "",
    title: album.title || "",
    subtitle: album.artist,
    getDetails: () => album,
    ...helpers
  })), [albums])

  const musicsNormalized = React.useMemo<SearchItemType[]>(() => musics.map(music => ({
    id: music.youtubeId,
    thumbnailUrl: music.thumbnailUrl || "",
    title: music.title || "",
    subtitle: music.album,
    getDetails: () => music,
    ...helpers
  })), [musics])
  const artistsNormalized = React.useMemo<SearchItemType[]>(() => artists.map(artist => ({
    id: artist.artistId,
    thumbnailUrl: artist.thumbnailUrl || "",
    title: artist.name || "",
    subtitle: artist.subscribers,
    getDetails: () => artist,
    ...helpers
  })), [artists])

  const results = React.useMemo<{type: "Musics" | "Albums" | "Artists"; items: SearchItemType[]}[]>(() => ([
    { type: "Musics", items: musicsNormalized },
    { type: "Albums", items: albumsNormalized },
    { type: "Artists", items: artistsNormalized }
  ]), [
    artistsNormalized,
    musicsNormalized,
    albumsNormalized
  ])

  return (
    <>
      <ScrollView>
        {results.map((result, index) => (
          <SearchList
            type={result.type}
            items={result.items}
            key={index} />
        ))}
      </ScrollView>

    </>
  )
}

export default SearchResult
