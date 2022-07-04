import * as React from "react"
import { DeviceEventEmitter, Image, View } from "react-native"
import { Avatar, IconButton, Surface, Text, useTheme } from "react-native-paper"
import splitText from "../../libs/splitText"
import TextCompose from "../TextCompose/TextCompose"
import createMusic from "./../../libs/create-music"
import DatabaseContext from "../../Context/DatabaseContext"
import useDownload from "../../hooks/useDownload"
import ProgressBar from './ProgressBar'
import { EVENT_ADD_DOWNLOAD, EVENT_ADD_DOWNLOADS } from "../../constant"
import { DownloadStateItem } from "../../libs/music2download"

interface DownloadBannerProps {}

const DownloadBanner: React.FC<DownloadBannerProps> = () => {

  const theme = useTheme()

  const database = React.useContext(DatabaseContext)
  const downloads = React.useRef<DownloadStateItem[]>([])

  const downloadSizeBytes = React.useRef<number>(0);
  const [currentDownload, setCurrentDownload] = React.useState<DownloadStateItem | null>(null);

  const onDownloadAbort = () => {
    console.log("> download has been aborted")
    downloadSizeBytes.current = 0;
    onNextDownload()
  }

  const onDownloadError = (reason: any) => {
    console.log("> download has fail with: ", reason);
    downloadSizeBytes.current = 0;
    onNextDownload();
  }

  const onNextDownload = () => {
    downloads.current.shift();

    setCurrentDownload(downloads.current[0] || null);
  }

  const onDownloadFinish = (result: {filename: string}) => {
    console.log("> download success")

    const lastDownloadSizeBytes = downloadSizeBytes.current;
    downloadSizeBytes.current = 0;

    if(currentDownload) {

      const {
        ownerName,
        playlistId,
        title,
        ownerThumbnail,
        publishedAt,
        thumbnail
      } = currentDownload;

      createMusic(database, {
        filename: result.filename,
        ownerName: ownerName,
        playlist_id: playlistId,
        title: title,
        ownerThumbnail: ownerThumbnail,
        publishedAt: publishedAt,
        thumbnail: thumbnail
      })
      .then(insertedId => {
        console.log(`> create new music at SQLite table with id: ${insertedId}`)
        console.log(`> create local file: ${result.filename}`)
        console.log(`> file size: ${(lastDownloadSizeBytes / 1000000).toFixed(3)}MB`)

        onNextDownload();
      })
      .catch((sqliteError) => {
        console.log("> cant upgrade music SQLite table with: ", sqliteError)
      })

    } else {
      console.log("> Oops, has lost metadata download :-(");
    }
  }

  const onGetDownloadSize = (sizeBytes: number) => {
    downloadSizeBytes.current = sizeBytes;
  }

  const onToggleDownloadStatus = (status: "pause" | "resume") => {
    console.log("> download has switch status to: " + status);
  }

  const { cancelDownload, startDownload } = useDownload({
    onDownloadAbort,
    onDownloadError,
    onDownloadFinish,
    onGetDownloadSize,
    onToggleDownloadStatus
  })

  const onPushDownload = (download: DownloadStateItem) => {
    downloads.current.push(download);
    afterPushDownload();
  }

  const onPushDownloads = (_downloads: DownloadStateItem[]) => {
    downloads.current.push(..._downloads);
    afterPushDownload();
  }

  const afterPushDownload = () => {
    if(!currentDownload) {
      setCurrentDownload(downloads.current[0] || null);
    }
  }

  React.useEffect(() => {

    const subscriptionSingle = DeviceEventEmitter.addListener(EVENT_ADD_DOWNLOAD, onPushDownload)
    const subscriptionMultiple = DeviceEventEmitter.addListener(EVENT_ADD_DOWNLOADS, onPushDownloads)

    return () => {
      subscriptionSingle.remove();
      subscriptionMultiple.remove();
    }
  }, []);

  React.useEffect(() => {
    if(currentDownload) {
      console.log("> new item to download");

      startDownload(currentDownload.remote);
    }
  }, [currentDownload])

  if (!currentDownload) {
    return <></>
  }

  const onCancelDownload = () => {
    cancelDownload();
  }

  const {
    ownerName,
    title,
    ownerThumbnail,
    publishedAt,
    thumbnail
  } = currentDownload;

  return (
    <Surface>
      <View style={{
        paddingVertical: 4,
        paddingHorizontal: 8
      }}>

        <ProgressBar />

        <View style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end"
        }}>
          <IconButton icon="close" size={24} onPress={onCancelDownload} />
        </View>

        <View style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
          <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Image style={{ width: 48, height: 48 }} source={{ uri: thumbnail || "" }} />

            <View style={{
              marginStart: 4
            }}>
              <TextCompose
                leftValue={splitText(title, 15)}
                rightValue={publishedAt || ""} />
            </View>
          </View>

          <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Avatar.Image size={16} source={{ uri: ownerThumbnail || "" }} />

            <View style={{ marginStart: 4 }}>
              <Text>{ownerName}</Text>
            </View>
          </View>

          <View>
            <Text style={{
              color: theme.colors.disabled
            }}>
              {downloads.current.length - 1} remaining
            </Text>
          </View>
        </View>
      </View>
    </Surface>
  )
}

export default DownloadBanner
