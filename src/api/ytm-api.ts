export interface BaseResponseAPI {
  success: boolean;
  message: string;
}
export interface BaseResponseListAPI extends BaseResponseAPI {
  count: number;
}

// ============= ytdl-core =============
export interface FormatAPI {
  url: string;
  mimeType: string;
  itag: number;
  contentLength: string;
  container: string;
  quality: string
  qualityLabel?: string | null;
  audioQuality?: string | null;
  audioCodec: string;
  approxDurationMs: string;
}
export interface AuthorAPI {
  id: string;
  name: string;
  avatar: string; // to remove later
  thumbnails?: ThumbnailAPI[];
  verified: boolean;
  user?: string;
  channel_url: string;
  external_channel_url?: string;
  user_url?: string;
  subscriber_count?: number;
}
export interface ThumbnailAPI {
  url: string;
  width: number;
  height: number;
}
export interface RelatedVideoAPI {
  id?: string;
  title?: string;
  published?: string;
  author: AuthorAPI | "string"; // to remove the `string` part later
  ucid?: string; // to remove later
  author_thumbnail?: string; // to remove later
  short_view_count_text?: string;
  view_count?: string;
  length_seconds?: number;
  video_thumbnail?: string; // to remove later
  thumbnails: ThumbnailAPI[];
  richThumbnails: ThumbnailAPI[];
  isLive: boolean;
}
export interface MediaAPI {
    category: string;
    category_url: string;
    game?: string;
    game_url?: string;
    year?: number;
    song?: string;
    artist?: string;
    artist_url?: string;
    writers?: string;
    licensed_by?: string;
    thumbnails: ThumbnailAPI[];
}
export interface VideoDetailsAPI {
  published: number;
  video_url: string;
  age_restricted: boolean;
  likes: number | null;
  dislikes: number | null;
  media: MediaAPI;
  author: AuthorAPI;
  thumbnails: ThumbnailAPI[];
  description: string | null;
  title: string;
  lengthSeconds: string;
  viewCount: string;
  category: string;
  publishDate: string;
  ownerChannelName: string;
  keywords: string[];
}

// ============= node-youtube-music =============
export interface MusicVideoAPI {
  youtubeId?: string;
  title?: string;
  thumbnailUrl?: string;
  artists?: {
      name: string;
      id?: string;
  }[];
  album?: string;
  isExplicit?: boolean;
  duration?: {
      label: string;
      totalSeconds: number;
  };
}

export enum AlbumTypeAPI {
  ep = "EP",
  album = "Album",
  single = "Single"
}

export interface AlbumPreviewAPI {
  albumId?: string;
  title?: string;
  type?: AlbumTypeAPI;
  thumbnailUrl?: string;
  artist?: string;
  artistId?: string;
  year?: string;
  isExplicit?: boolean;
}
export interface ArtistPreviewAPI {
  name?: string;
  artistId?: string;
  thumbnailUrl?: string;
  subscribers?: string;
}
export interface ArtistAPI {
  artistId?: string;
  name?: string;
  description?: string;
  thumbnails?: ThumbnailAPI[];
  songsPlaylistId?: string;
  albums?: AlbumPreviewAPI[];
  singles?: AlbumPreviewAPI[];
  suggestedArtists?: ArtistPreviewAPI[];
  subscribers?: string;
}

export interface PlaylistPreviewAPI {
  playlistId?: string;
  title?: string;
  thumbnailUrl?: string;
  totalSongs?: number;
}

// ============= endpoints =============

// GET /details/:key
export interface DetailsAPI extends BaseResponseAPI {
  formats: FormatAPI[];
  details?: VideoDetailsAPI;
  relatedVideos?: RelatedVideoAPI[];
}

// GET /get-album/:key
export interface GetAlbumAPI extends BaseResponseListAPI {
  musics: MusicVideoAPI[];
}

// GET /get-artist/:key
export interface GetArtistAPI extends BaseResponseAPI {
  artist: ArtistAPI;
}

// GET /get-playlist/:key
export interface GetPlaylistAPI extends BaseResponseListAPI {
  musics: MusicVideoAPI[];
}

// GET /suggestions/:key
export interface GetSuggestionsAPI extends BaseResponseListAPI {
  suggestions: MusicVideoAPI[];
}

// GET /search-albums/:q
export interface SearchAlbumsAPI extends BaseResponseListAPI {
  albums: AlbumPreviewAPI[];
}

// GET /search-artists/:q
export interface SearchArtistsAPI extends BaseResponseListAPI {
  artists: ArtistPreviewAPI[];
}

// GET /search-music/:q
export interface SearchMusicsAPI extends BaseResponseListAPI {
  musics: MusicVideoAPI[];
}

// GET /search-playlists/:q
export interface SearchPlaylistsAPI extends BaseResponseListAPI {
  playlists: PlaylistPreviewAPI[];
}

// ============= requests API =============

const BASE_URL = "https://agile-everglades-02813.herokuapp.com/api"

const API = {
  createUrl (uri: string) {
    if (uri.charAt(0) !== "/") {
      uri = "/" + uri
    }

    return BASE_URL + uri
  },

  getStreamUrl (youtubeId: string): string {
    return API.createUrl(`/stream/${youtubeId}`)
  },

  details (videoId: string, requestInit: RequestInit): Promise<DetailsAPI> {
    return API.request<DetailsAPI>(
      API.createUrl(`/details/${videoId}`),
      requestInit
    )
  },

  getAlbum (albumId: string, requestInit: RequestInit): Promise<GetAlbumAPI> {
    return API.request<GetAlbumAPI>(
      API.createUrl(`/get-album/${albumId}`),
      requestInit
    )
  },

  getArtist (artistId: string, requestInit: RequestInit): Promise<GetArtistAPI> {
    return API.request<GetArtistAPI>(
      API.createUrl(`/get-artist/${artistId}`),
      requestInit
    )
  },

  getPlaylist (playlistId: string, requestInit: RequestInit): Promise<GetPlaylistAPI> {
    return API.request<GetPlaylistAPI>(
      API.createUrl(`/get-playlist/${playlistId}`),
      requestInit
    )
  },

  getSuggestions (videoId: string, requestInit: RequestInit): Promise<GetSuggestionsAPI> {
    return API.request<GetSuggestionsAPI>(
      API.createUrl(`/suggestions/${videoId}`),
      requestInit
    )
  },

  searchAlbums (q: string, requestInit: RequestInit): Promise<SearchAlbumsAPI> {
    return API.request<SearchAlbumsAPI>(
      API.createUrl(`/search-albums/${encodeURIComponent(q)}`),
      requestInit
    )
  },

  searchMusics (q: string, requestInit: RequestInit): Promise<SearchMusicsAPI> {
    return API.request<SearchMusicsAPI>(
      API.createUrl(`/search-music/${encodeURIComponent(q)}`),
      requestInit
    )
  },

  searchArtists (q: string, requestInit: RequestInit): Promise<SearchArtistsAPI> {
    return API.request<SearchArtistsAPI>(
      API.createUrl(`/search-artists/${encodeURIComponent(q)}`),
      requestInit
    )
  },

  searchPlaylists (q: string, requestInit: RequestInit): Promise<SearchPlaylistsAPI> {
    return API.request<SearchPlaylistsAPI>(
      API.createUrl(`/search-playlists/${encodeURIComponent(q)}`),
      requestInit
    )
  },

  request<T extends BaseResponseAPI> (url: string | URL, fetchInit: RequestInit): Promise<T> {
    return new Promise<T>((
      resolve: (data: T) => void,
      reject: (reason: any) => void
    ): void => {
      fetch(url.toString(), fetchInit)
        .then((response: Response): Promise<T> => response.json())
        .then(resolve)
        .catch(reject)
    })
  }
}

export default API
