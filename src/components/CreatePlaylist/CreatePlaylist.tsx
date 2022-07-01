import * as React from "react"
import { View } from "react-native"
import { Button, HelperText, Modal, Portal, Surface, TextInput } from "react-native-paper"
import ModalHeader from "../ModalHeader/ModalHeader"

import styles from "./../styles/index"
import InputPlaylist from "./InputPlaylist"
import createPlaylist from "./../../libs/create-playlist"
import { WebSQLDatabase } from "expo-sqlite"
import DatabaseContext from "../../Context/DatabaseContext"

interface CreatePlaylistProps {
  open: boolean;
  onClose: () => void;
  onCreated: (newPlaylist: {id: number, name: string}) => void;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({
  open,
  onClose,
  onCreated
}) => {
  const database = React.useContext<WebSQLDatabase>(DatabaseContext)

  const playlistNameRef = React.useRef<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [pendingCreate, setPendingCreate] = React.useState(false)

  const PATTERN_PLAYLIST = React.useMemo(() => /^[a-z\d \-]{2,32}$/i, [])

  React.useEffect(() => {
    return () => {
      playlistNameRef.current = null
    }
  })

  const onValidPlaylistName = () => {
    setError(null)
  }

  const onInvalidPlaylistName = () => {
    setError("playlist name invalid.")
  }

  const onCreatePlaylist = (playlistName: string) => {
    if (!playlistName.length) {
      setError("playlist name cant be empty.")
    } else if (!canSubmit) {
      console.log("> cant submit new playlist")
    } else {
      setPendingCreate(true)

      createPlaylist(database, playlistName)
        .then(insertedId => {
          if (typeof insertedId === "number") {
            console.log("> new playlist created")
            onCreated({ id: insertedId, name: playlistName })
          } else {
            console.log("> playlist has been create BUT cant get inserted id")
          }
        })
        .catch((error) => {
          console.log("> playlist cant be create with:", error)
        })
        .finally(() => {
          setPendingCreate(false)
        })
    }
  }

  const canSubmit = !pendingCreate && !error

  return (
    <Portal>
      <Modal visible={open} onDismiss={onClose}>
        <Surface style={styles.modalContainer}>
          <ModalHeader
            title='Create new playlist'
            onClose={onClose} />

            <View style={{
              marginVertical: 4
            }}>
              <InputPlaylist
                onBlur={playlistName => {
                  playlistNameRef.current = playlistName
                }}
                pattern={PATTERN_PLAYLIST}
                onValid={onValidPlaylistName}
                onInvalid={onInvalidPlaylistName}
                onSubmit={onCreatePlaylist} />

                <HelperText type="error" visible={!!error}>
                  {error}
                </HelperText>

                <Button mode="contained" disabled={!canSubmit} icon="plus" onPress={() => {
                  onCreatePlaylist(playlistNameRef.current || "")
                }}>
                  create
                </Button>
            </View>
        </Surface>
      </Modal>
    </Portal>
  )
}

export default CreatePlaylist
