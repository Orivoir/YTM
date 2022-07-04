import * as React from "react"
import { FlatList, View } from "react-native"
import { ActivityIndicator, Button, Modal, Portal, RadioButton, Surface, Text } from "react-native-paper"
import DatabaseContext from "../../Context/DatabaseContext"
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

  const playlistsRef = React.useRef<{id: number, name: string}[]>([])
  const [isPending, setIsPending] = React.useState<boolean>(false)

  const [playlistChecked, setPlaylistChecked] = React.useState<number>(Infinity)

  React.useEffect(() => {
    if(open) {
      setIsPending(true)

      getPlaylists(database)
        .then(rows => {
          playlistsRef.current = rows._array
        })
        .catch(error => {
          console.log("> cant read playlists from SQLite with: ", error)
        })
        .finally(() => {
          setIsPending(false)
        })
    }
  }, [open])

  return (
    <Portal>
      <Modal visible={open} onDismiss={onClose}>
        <Surface style={styles.modalContainer}>
          <ModalHeader
            title="Select playlist"
            subtitle={`${splitText(musicTitle, 15)} => ${playlistsRef.current.find(p => p.id === playlistChecked)?.name || "?"}`}
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
                      data={playlistsRef.current} />
                  </RadioButton.Group>
                </View>

                  <Button
                    onPress={() => {
                      if (closeOnSubmit) {
                        onClose()
                      }
                      onSelect(playlistsRef.current.find(p => p.id === playlistChecked) || { id: -1, name: "" })
                    }}
                    disabled={!isFinite(playlistChecked)}
                    icon="download"
                    mode="contained">
                    download
                  </Button>
              </View>
                )}
          </View>
        </Surface>
      </Modal>
    </Portal>
  )
}

export default SelectPlaylist
