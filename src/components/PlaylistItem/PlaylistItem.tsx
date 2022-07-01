import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as React from "react"
import { DeviceEventEmitter, View } from "react-native"
import Swipable from "react-native-gesture-handler/Swipeable"
import { Avatar, Card, IconButton, Surface, Text, useTheme } from "react-native-paper"
import DatabaseContext from "../../Context/DatabaseContext"
import { useAppSelector } from "../../hooks/redux"
import getMusicsByPlaylist from "../../libs/get-musics-by-playlist"
import splitText from "../../libs/splitText"
import ConfirmAction from "../ConfirmAction/ConfirmAction"
import PlaylistDetails from "../PlaylistDetails/PlaylistDetails"
import SwipeTrash from "../SwipeTrash/SwipeTrash"

interface PlaylistItemProps {
  id: number;
  name: string;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  id,
  name
}) => {
  const database = React.useContext(DatabaseContext)

  const [musics, setMusics] = React.useState<{
    playlist_id: number,
    id: number,
    title: string,
    ownerName: string,
    filename: string,
    publishedAt?: string,
    thumbnail?: string,
    ownerThumbnail?: string
  }[]>([])

  const [isOpenDetails, setIsOpenDetails] = React.useState<boolean>(false)

  const download = useAppSelector(state => state.download);

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = React.useState<boolean>(false)

  const thumbnailRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    getMusicsByPlaylist(database, id)
      .then(rows => {
        rows._array.forEach(music => {
          if (typeof music.thumbnail === "string") {
            thumbnailRef.current = music.thumbnail
          }
        })

        setMusics(rows._array)
      })
      .catch((sqlError) => {
        console.log("> cant read musics from SQLite with: ", sqlError)
      })
  }, [id, download])

  const onOpenPlaylist = () => {
    setIsOpenDetails(true)
  }

  const theme = useTheme()

  const swipableRef = React.useRef<Swipable | null>(null);

  return (
    <>
      <SwipeTrash
        onGetSwipableRef={swipable => {
          swipableRef.current = swipable
        }}
        contentAction="REMOVE"
        contentActionIcon={(
          <MaterialCommunityIcons name='trash-can' size={24} color={theme.colors.text} />
        )}
        onTrash={() => {
          setIsOpenConfirmDelete(true)
        }}>
        <Surface style={{
          paddingVertical: 2,
          paddingHorizontal: 4
        }}>
          <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}>
            <View style={{
              marginEnd: 8
            }}>
              {thumbnailRef.current
                ? (
                <Avatar.Image size={48} source={{ uri: thumbnailRef.current }} />
                  )
                : (
                <Avatar.Text size={48} label={name.charAt(0)} />
                  )}
            </View>

            <View style={{
              marginEnd: 8
            }}>
              <Text>{splitText(name)}</Text>
            </View>

            <View>
              <IconButton icon="folder-music" onPress={onOpenPlaylist} />
            </View>
          </View>
        </Surface>
      </SwipeTrash>

      <PlaylistDetails
        playlistName={name}
        open={isOpenDetails}
        onClose={() => {
          setIsOpenDetails(false)
        }}
        musics={musics} />

        <ConfirmAction
          actionCancel={{
            title: "cancel",
            type: "safe",
            onPress: () => {
              swipableRef.current?.close()
              setIsOpenConfirmDelete(false)
            }
          }}
          actionContinue={{
            title: "remove",
            type: "unsafe",
            onPress: () => {
              console.log(`@TODO: delete playlist ${id}:${name}`)
            }
          }}
          title={`playlist contains ${musics.length} musics`}
          relationalText={`Do you want remove playlist ${name} and all musics from this ?`}
          warnCantUndo
          actionType='remove'
          itemType='playlist'
          onClose={() => {
            swipableRef.current?.close()
            setIsOpenConfirmDelete(false)
          }}
          open={isOpenConfirmDelete} />
    </>
  )
}

export default PlaylistItem
