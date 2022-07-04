import React from "react"
import { DeviceEventEmitter } from "react-native"
import { EVENT_DOWNLOAD_PROGRESS_UPDATE } from "../constant"

export default function useDownloadStatus (youtubeId: string) {

  const [progress, setProgress] = React.useState<number>(-1);

  const onDownloadStatus = (params: {
    isFinish: boolean,
    id: string,
    percent: number
  }) => {
    if(params.id === youtubeId) {
      if(params.isFinish) {
        setProgress(-1);
      } else {
        setProgress(params.percent);
      }
    }
  }

  React.useEffect(() => {

    const subscription = DeviceEventEmitter.addListener(EVENT_DOWNLOAD_PROGRESS_UPDATE, onDownloadStatus);

    return () => {
      subscription.remove();
    }

  }, [])

  return {
    canDownload: progress === -1,
    progress
  }
}
