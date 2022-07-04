import * as React from "react"
import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs"
import type { BottomTabParamsList } from "./../Routing"
import DatabaseContext from "../../Context/DatabaseContext"
import type { WebSQLDatabase } from "expo-sqlite"

import getPlaylists from "../../libs/get-playlists"
import { Surface, Title, Paragraph, FAB, Divider } from "react-native-paper"
import { View } from "react-native"

import styles from "./../styles"
// import CreatePlaylist from "../CreatePlaylist/CreatePlaylist"
import { FlatList } from "react-native-gesture-handler"
import PlaylistItem from "../PlaylistItem/PlaylistItem"
import { useAppSelector } from "../../hooks/redux"
import { useDispatch } from "react-redux"
import {createAddMultiple} from './../../store/actions/playlistsActions'
import useCreatePlaylist from "../../hooks/useCreatePlaylist"


const Playlists: React.FC<MaterialBottomTabScreenProps<BottomTabParamsList, "Playlists">> = () => {

  const playlists = useAppSelector(state => state.playlists);
  const dispatch = useDispatch();

  const database = React.useContext(DatabaseContext);

  // const [isOpenCreatePlaylist, setIsOpenCreatePlaylist] = React.useState<boolean>(false)

  // const onOpenCreatePlaylist = () => {
  //   setIsOpenCreatePlaylist(true)
  // }

  const {onOpen, render} = useCreatePlaylist();

  React.useEffect(() => {
    getPlaylists(database)
    .then(rows => {
      const _playlists = rows._array;
      dispatch(createAddMultiple(_playlists));
    })
  }, []);

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
        <FAB icon="plus" onPress={onOpen} />
      </View>

      {render}
      {/* <CreatePlaylist
        open={isOpenCreatePlaylist}
        onClose={() => (
          setIsOpenCreatePlaylist(false)
        )} /> */}
    </Surface>
  )
}

export default Playlists
