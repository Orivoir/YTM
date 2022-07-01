export type DownloadStateItem = {
  remote: string; // URL download mp3 content
  playlistId: number;
  youtubeId: string;
  title: string;
  ownerName: string;
  publishedAt?: string;
  thumbnail?: string;
  ownerThumbnail?: string;
}

export type DownloadState = DownloadStateItem[]

export type DownloadActionName = "ADD_DOWNLOAD" | "CANCEL_DOWNLOAD" | "FINISH_DOWNLOAD";

export type DownloadAction = {
  type: DownloadActionName;
  download?: DownloadStateItem;
  id?: string;
}

const INITIAL_STATE: DownloadState = []

export default function downloadReducers (
  state: DownloadState = INITIAL_STATE,
  action: DownloadAction
): DownloadState {
  switch (action.type) {
    case "ADD_DOWNLOAD":
      return action.download
        ? [
            ...state,
            action.download
          ]
        : state
    case "CANCEL_DOWNLOAD":
      return action.id
        ? state.filter(downloadItem => (
          downloadItem.youtubeId !== action.id
        ))
        : state
    case "FINISH_DOWNLOAD":
      return action.id
        ? state.filter(downloadItem => (
          downloadItem.youtubeId !== action.id
        ))
        : state
    default:
      return state
  }
}
