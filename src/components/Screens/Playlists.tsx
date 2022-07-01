import * as React from "react"
import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs"
import type { BottomTabParamsList } from "./../Routing"
import DatabaseContext from "../../Context/DatabaseContext"
import type { WebSQLDatabase } from "expo-sqlite"

import getPlaylists from "../../libs/get-playlists"
import { Surface, Title, Paragraph, FAB, Divider } from "react-native-paper"
import { View } from "react-native"

import styles from "./../styles"
import CreatePlaylist from "../CreatePlaylist/CreatePlaylist"
import { FlatList } from "react-native-gesture-handler"
import PlaylistItem from "../PlaylistItem/PlaylistItem"

const Playlists: React.FC<MaterialBottomTabScreenProps<BottomTabParamsList, "Playlists">> = () => {
  const database = React.useContext<WebSQLDatabase>(DatabaseContext)

  const [playlists, setPlaylists] = React.useState<{id: number, name: string}[]>([])
  const [isOpenCreatePlaylist, setIsOpenCreatePlaylist] = React.useState<boolean>(false)

  const onOpenCreatePlaylist = () => {
    setIsOpenCreatePlaylist(true)
  }

  const onRefreshPlaylist = () => {
    console.log("> refresh playlist")
    getPlaylists(database)
      .then(rows => {
        console.log(rows)
        setPlaylists(rows._array)
      })
      .catch(error => {
        console.log("> cant read playlist from SQLite with: ", error)
      })
  }

  React.useEffect(() => {
    onRefreshPlaylist()
  }, [])

  return (
    <Surface style={styles.screenContainer}>
      {!playlists.length
        ? (
        <View>
          <Paragraph>
            You will see playlists here.
          </Paragraph>
        </View>
          )
        : (
        <View>
          <FlatList
            renderItem={({ item }) => <PlaylistItem {...item} />}
            keyExtractor={item => item.id.toString()}
            data={playlists} />
        </View>
          )}

      <View style={{
        position: "absolute",
        right: 0
      }}>
        <FAB icon="plus" onPress={onOpenCreatePlaylist} />
      </View>

      <CreatePlaylist
        open={isOpenCreatePlaylist}
        onCreated={onRefreshPlaylist}
        onClose={() => (
          setIsOpenCreatePlaylist(false)
        )} />
    </Surface>
  )
}

export default Playlists
