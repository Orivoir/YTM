import { useAppSelector } from "./redux"

export default function useCanDownload (youtubeId: string) {
  // const downloads = useAppSelector(state => state.download)

  // const downloadStatus = downloads.find(download => (
  //   download.youtubeId === youtubeId
  // ))

  return {
    canDownload: true
  }
}
