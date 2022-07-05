import * as React from "react"
import { DeviceEventEmitter, FlatList, View } from "react-native"
import { ActivityIndicator, Button, Modal, Portal, RadioButton, Surface, Text } from "react-native-paper"
import { EVENT_SELECTED_PLAYLIST, EVENT_SELECT_PLAYLIST } from "../../constant"
import DatabaseContext from "../../Context/DatabaseContext"
import useCreatePlaylist from "../../hooks/useCreatePlaylist"
import getPlaylists from "../../libs/get-playlists"
import splitText from "../../libs/splitText"
import ModalHeader from "../ModalHeader/ModalHeader"
import styles from "../styles"

interface SelectPlaylistProps {}

const SelectPlaylist: React.FC<SelectPlaylistProps> = () => {
  const database = React.useContext(DatabaseContext)

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false)
  const [playlistChecked, setPlaylistChecked] = React.useState<number>(Infinity)

  const {onOpen, render} = useCreatePlaylist();


  const playlistsRef = React.useRef<{id: number, name: string}[]>([])
  const musicTitleRef = React.useRef<string>("");

  const playlists = playlistsRef.current;
  const musicTitle = musicTitleRef.current;


  const onSelect = (params: {
    musicTitle: string,
    id: string
  }) => {
    musicTitleRef.current = params.musicTitle;
    setIsOpen(true);
  }

  const onSelected = () => {
    console.log("> on selected trigger")
    DeviceEventEmitter.emit(EVENT_SELECTED_PLAYLIST, {
      playlist: playlists.find(p => p.id === playlistChecked) || null
    });

    musicTitleRef.current = "";

    setPlaylistChecked(Infinity);
    onClose();
  }

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(EVENT_SELECT_PLAYLIST, onSelect);

    return () => {
      subscription.remove();
    }

  }, []);

  React.useEffect(() => {

    if(isOpen) {
      console.log("> fetch playlists at SQLite");
      setIsPending(true)

      getPlaylists(database)
        .then(rows => {
          playlistsRef.current = rows._array;
        })
        .catch(error => {
          console.log("> cant read playlists from SQLite with: ", error)
        })
        .finally(() => {
          setIsPending(false)
        })
    } else {
      console.log("> skip fetch playlists");
    }
  }, [isOpen])

  const onClose = () => {
    setIsOpen(false);
  }

  return (
    <>
    <Portal>
      <Modal visible={isOpen} onDismiss={onClose}>
        <Surface style={styles.modalContainer}>
          <ModalHeader
            title="Select playlist"
            subtitle={`${splitText(musicTitle || "", 15)} => ${playlists.find(p => p.id === playlistChecked)?.name || "?"}`}
            onClose={onClose} />

          <View style={{
            marginVertical: 4
          }}>
            {isPending
              ? (
              <View style={{
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ActivityIndicator animating size={32} />
              </View>
                )
              : (
              <View>
                <View style={{ marginBottom: 4 }}>
                  <RadioButton.Group
                    onValueChange={value => setPlaylistChecked(parseInt(value))}
                    value={playlistChecked.toString()}>
                    <FlatList
                      keyExtractor={item => item.id.toString()}
                      ItemSeparatorComponent={() => <View style={{ marginVertical: 2 }} />}
                      renderItem={({ item }) => (
                        <View style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center"
                        }}>
                          <Text style={{ marginEnd: 2 }}>{item.name}</Text>
                          <RadioButton
                            value={item.id.toString()} />
                        </View>
                      )}
                      data={playlists} />
                  </RadioButton.Group>
                </View>

                <View style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <Button
                    onPress={onSelected}
                    disabled={!isFinite(playlistChecked)}
                    icon="download"
                    mode="outlined">
                    download
                  </Button>

                  <View style={{marginVertical: 2}} />

                  <Button
                    onPress={onOpen}
                    mode="outlined"
                    icon="plus">
                      create playlist
                  </Button>
                </View>
              </View>
                )}
          </View>
        </Surface>
      </Modal>
    </Portal>
    {render}
    </>
  )
}

export default SelectPlaylist
