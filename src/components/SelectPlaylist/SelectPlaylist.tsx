import * as React from "react"
import { DeviceEventEmitter, EmitterSubscription, FlatList, View } from "react-native"
import { ActivityIndicator, Button, Modal, Portal, RadioButton, Surface, Text } from "react-native-paper"
import { EVENT_CREATE_PLAYLIST } from "../../constant"
import DatabaseContext from "../../Context/DatabaseContext"
import useCreatePlaylist from "../../hooks/useCreatePlaylist"
import getPlaylists from "../../libs/get-playlists"
import splitText from "../../libs/splitText"
import ModalHeader from "../ModalHeader/ModalHeader"
import styles from "../styles"

interface SelectPlaylistProps {
  closeOnSubmit?: boolean;
  open: boolean;
  musicTitle: string;
  onClose: () => void;
  onSelect: (playlist: {id: number, name: string}) => void;
}

const SelectPlaylist: React.FC<SelectPlaylistProps> = ({
  open,
  onClose,
  musicTitle,
  onSelect,
  closeOnSubmit = true
}) => {
  const database = React.useContext(DatabaseContext)

  const [playlists, setPlaylists] = React.useState<{id: number, name: string}[]>([])
  const [isPending, setIsPending] = React.useState<boolean>(false)
  const subscriptionRef = React.useRef<EmitterSubscription | null>(null)

  const [playlistChecked, setPlaylistChecked] = React.useState<number>(Infinity)

  const {onOpen, render} = useCreatePlaylist();

  const onNewPlaylist = (playlist: {id: number, name: string}) => {
    setPlaylists(currentPlaylists => ([
      ...currentPlaylists,
      playlist
    ]))
  }

  React.useEffect(() => {

    if(open) {
      subscriptionRef.current = DeviceEventEmitter.addListener(EVENT_CREATE_PLAYLIST, onNewPlaylist)
      setIsPending(true)

      getPlaylists(database)
        .then(rows => {
          setPlaylists(rows._array);
        })
        .catch(error => {
          console.log("> cant read playlists from SQLite with: ", error)
        })
        .finally(() => {
          setIsPending(false)
        })
    } else {
      subscriptionRef.current?.remove()
    }
  }, [open])


  return (
    <>
    <Portal>
      <Modal visible={open} onDismiss={onClose}>
        <Surface style={styles.modalContainer}>
          <ModalHeader
            title="Select playlist"
            subtitle={`${splitText(musicTitle, 15)} => ${playlists.find(p => p.id === playlistChecked)?.name || "?"}`}
            onClose={onClose} />

          <View style={{
            marginVertical: 4
          }}>
            {isPending
              ? (
              <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ActivityIndicator animating size={32} />
              </View>
                )
              : (
              <View style={{
                marginHorizontal: 4
              }}>
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
                    onPress={() => {
                      if (closeOnSubmit) {
                        onClose()
                      }
                      onSelect(playlists.find(p => p.id === playlistChecked) || { id: -1, name: "" })
                    }}
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
