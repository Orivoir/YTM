import { DownloadAction, DownloadStateItem } from "../reducers/downloadReducers"

export const createCancelDownload = (youtubeId: string): DownloadAction => ({
  type: "CANCEL_DOWNLOAD",
  id: youtubeId
})

export const createAddDownload = (newDownload: DownloadStateItem): DownloadAction => ({
  type: "ADD_DOWNLOAD",
  download: newDownload
})

export const createFinishDownload = (youtubeId: string): DownloadAction => ({
  type: "FINISH_DOWNLOAD",
  id: youtubeId
})
