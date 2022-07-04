import { MusicVideoAPI } from "../api/ytm-api";
// import { DownloadStateItem } from "../store/reducers/downloadReducers";
import api from './../api/ytm-api'
export type DownloadStateItem = {
  ownerName: string;
  playlistId: number;
  remote: string;
  title: string;
  youtubeId: string;
  thumbnail?: string;
  publishedAt?: string;
  ownerThumbnail?: string;
}
export default function music2download(
  music: MusicVideoAPI,
  playlistId: number,
  data: {
    ownerThumbnail?: string;
    publishedAt?: string
  }={}
): DownloadStateItem {
  return {
    ownerName: music.artists ? music.artists[0].name : "",
    playlistId,
    remote: api.getStreamUrl(music.youtubeId || ""),
    title: music.title || "",
    thumbnail: music.thumbnailUrl || "",
    youtubeId: music.youtubeId || "",
    ...data
  }
}