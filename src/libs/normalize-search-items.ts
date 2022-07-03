import { AlbumPreviewAPI, ArtistPreviewAPI, MusicVideoAPI } from "../api/ytm-api"


export type SearchItemType = {
  id?: string | number;
  title: string;
  thumbnailUrl: string;
  subtitle?: string;

  getDetails: SearchItemDetailsCallback;
};

export type SearchItemDetailsCallback = () => AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI;

export const normalizeAlbums = (albums: AlbumPreviewAPI[]): SearchItemType[] => {
  return albums.map(album => ({
    getDetails: () => album,
    thumbnailUrl: album.thumbnailUrl || "",
    title: album.title || "",
    id: album.albumId,
    subtitle: album.artist
  }))
}

export const normalizeMusics = (musics: MusicVideoAPI[]): SearchItemType[] => {
  return musics.map(music => ({
    id: music.youtubeId,
    thumbnailUrl: music.thumbnailUrl || "",
    title: music.title || "",
    subtitle: music.album,
    getDetails: () => music
  }))
}

export const normalizeArtists = (artists: ArtistPreviewAPI[]): SearchItemType[] => {
  return artists.map(artist => ({
      id: artist.artistId,
      thumbnailUrl: artist.thumbnailUrl || "",
      title: artist.name || "",
      subtitle: artist.subscribers,
      getDetails: () => artist
  }))
}
