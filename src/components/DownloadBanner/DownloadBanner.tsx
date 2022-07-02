import * as React from "react"
import { Image, View } from "react-native"
import { Avatar, IconButton, Surface, Text, ThemeProvider, useTheme } from "react-native-paper"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import splitText from "../../libs/splitText"
import TextCompose from "../TextCompose/TextCompose"
import type { DownloadStateItem } from "./../../store/reducers/downloadReducers"
import {
  createDownloadResumable,
  documentDirectory
} from "expo-file-system"
import createMusic from "./../../libs/create-music"
import DatabaseContext from "../../Context/DatabaseContext"
import { createCancelDownload, createFinishDownload } from "../../store/actions/downloadReducers"
import deleteMusicFileSystem from './../../libs/delete-music-file-system'
import useDownload, { ProgressState } from "../../hooks/useDownload"
import ProgressBar from './ProgressBar'

interface DownloadBannerProps {}

const DownloadBanner: React.FC<DownloadBannerProps> = () => {

  const theme = useTheme()

  const database = React.useContext(DatabaseContext)
  const downloads = useAppSelector(state => state.download)
  const dispatch = useAppDispatch()

  const currentDownload = React.useRef<DownloadStateItem | null>(null);
  const downloadSizeBytes = React.useRef<number>(0);

  const [isVisible, setIsVisible] = React.useState<boolean>();

  const onDownloadAbort = () => {
    downloadSizeBytes.current = 0;
    currentDownload.current = null;
    setIsVisible(false);
  }

  const onDownloadError = (reason: any) => {
    console.log("> download has fail with: ", reason);
    downloadSizeBytes.current = 0;
    currentDownload.current = null;

    setIsVisible(false);
  }

  const onDownloadFinish = (result: {filename: string}) => {
      console.log("> download success")

      downloadSizeBytes.current = 0;

      if(currentDownload.current) {

        const {
          ownerName,
          playlistId,
          title,
          ownerThumbnail,
          publishedAt,
          thumbnail,
          youtubeId
        } = currentDownload.current;

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
          // console.log(`> file size: ${(downloadAwaitRef.current.totalBytesExpectedToWrite / 1000000).toFixed(3)}MB`)

          currentDownload.current = null;

          dispatch(createFinishDownload(youtubeId || ""))
        })
        .catch((sqliteError) => {
          console.log("> cant upgrade music SQLite table with: ", sqliteError)
        })
        .finally(() => {
          setIsVisible(false);
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

  React.useEffect(() => {

    console.log("> downloads state has change");

    if(!currentDownload.current && downloads.length > 0) {
      console.log("> start new download");

      currentDownload.current = downloads[0];

      startDownload(currentDownload.current.remote);

      setIsVisible(true);
    }

  }, [downloads]);


  if (!isVisible || !currentDownload.current) {
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
  } = currentDownload.current;

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
              {downloads.length - 1} remaining
            </Text>
          </View>
        </View>
      </View>
    </Surface>
  )
}

export default DownloadBanner
