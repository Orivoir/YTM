import * as React from "react"
import { Image, View } from "react-native"
import { Avatar, IconButton, ProgressBar, Surface, Text, ThemeProvider, useTheme } from "react-native-paper"
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

interface DownloadBannerProps {}

const DownloadBanner: React.FC<DownloadBannerProps> = () => {
  const downloads = useAppSelector(state => state.download)

  const [currentDownload, setCurrentDownload] = React.useState<DownloadStateItem | null>(null)
  const [progress, setProgress] = React.useState<number>(0)

  const downloadResumableRef = React.useRef<ReturnType<typeof createDownloadResumable> | null>(null)
  const filenameRef = React.useRef<string | null>(null)
  const downloadAwaitRef = React.useRef<{totalBytesExpectedToWrite: number, totalBytesWritten: number}>({
    totalBytesExpectedToWrite: 0,
    totalBytesWritten: 0
  })

  const theme = useTheme()

  const database = React.useContext(DatabaseContext)

  const dispatch = useAppDispatch()

  React.useEffect(() => {
    console.log("> downloads state has change")

    if (!currentDownload && downloads.length > 0) {
      console.log("> start new download")

      const nextDownload = downloads[0]
      const nextFilename = `${nextDownload.youtubeId}-${Date.now().toString()}-${Math.random().toString()}.mp3`

      filenameRef.current = nextFilename

      downloadResumableRef.current = createDownloadResumable(
        nextDownload.remote,
        (documentDirectory + filenameRef.current),
        {},
        ({ totalBytesExpectedToWrite, totalBytesWritten }) => {
          downloadAwaitRef.current = {
            totalBytesExpectedToWrite,
            totalBytesWritten
          }

          if (
            totalBytesExpectedToWrite <= 0 ||
            isNaN(totalBytesExpectedToWrite) ||
            !isFinite(totalBytesExpectedToWrite)
          ) {
            console.log(`> download fail never data provide from server at: ${nextDownload.remote}`)
            downloadResumableRef.current?.cancelAsync()
              .then(() => {
                console.log("> download has been aborted")
              })
            // @TODO: abort download
          } else {
            const pct = (totalBytesWritten / totalBytesExpectedToWrite) * 100
            setProgress(pct / 100)
          }
        }
      )

      downloadResumableRef.current.downloadAsync()
        .then((result) => {
          console.log("> download finish")

          if (result) {
            console.log("> download success")
            createMusic(database, {
              filename: filenameRef.current || "",
              ownerName: nextDownload.ownerName,
              playlist_id: nextDownload.playlistId,
              title: nextDownload.title,
              ownerThumbnail: nextDownload.ownerThumbnail,
              publishedAt: nextDownload.publishedAt,
              thumbnail: nextDownload.thumbnail
            })
              .then(insertedId => {
                console.log(`> create new music at SQLite table with id: ${insertedId}`)
                console.log(`> create local file: ${filenameRef.current}`)
                console.log(`> file size: ${(downloadAwaitRef.current.totalBytesExpectedToWrite / 1000000).toFixed(3)}MB`)

                filenameRef.current = null
                downloadAwaitRef.current = {
                  totalBytesExpectedToWrite: 0,
                  totalBytesWritten: 0
                }

                const ytid = nextDownload.youtubeId

                setCurrentDownload(null)
                dispatch(createFinishDownload(ytid))
              })
              .catch((sqliteError) => {
                console.log("> cant upgrade music SQLite table with: ", sqliteError)
              })
          } else {
            console.log("> download has been abort, or has fail")
          }
        })
        .catch(error => {
          console.log("> download has been abort with: ", error)
        })

      setCurrentDownload(nextDownload)
    } else {
      console.log("> all downloads finish, idle state.")
    }
  }, [downloads])

  if (!currentDownload) {
    return <></>
  }

  const onCancelDownload = () => {

    downloadResumableRef.current?.cancelAsync()
    .then(() => {
      console.log('> download has been canceled');
      deleteMusicFileSystem(filenameRef.current || "")
      .then(() => {
        console.log("> local file partial download has been deleted");

        filenameRef.current = null
        downloadAwaitRef.current = {
          totalBytesExpectedToWrite: 0,
          totalBytesWritten: 0
        }

        setCurrentDownload(null);

        dispatch(createCancelDownload(currentDownload.youtubeId));
      })
    })

  }

  return (
    <Surface>
      <View style={{
        paddingVertical: 4,
        paddingHorizontal: 8
      }}>

        <View>
          <ProgressBar progress={progress} />
        </View>

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
            <Image style={{ width: 48, height: 48 }} source={{ uri: currentDownload.thumbnail || "" }} />

            <View style={{
              marginStart: 4
            }}>
              <TextCompose
                leftValue={splitText(currentDownload.title, 15)}
                rightValue={currentDownload.publishedAt || ""} />
            </View>
          </View>

          <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Avatar.Image size={16} source={{ uri: currentDownload.ownerThumbnail || "" }} />

            <View style={{ marginStart: 4 }}>
              <Text>{currentDownload.ownerName}</Text>
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
