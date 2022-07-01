import * as React from "react"
import { View } from "react-native"
import { Button, HelperText, Modal, Portal, Surface, TextInput } from "react-native-paper"
import ModalHeader from "../ModalHeader/ModalHeader"

import styles from "./../styles/index"
import createPlaylist from "./../../libs/create-playlist"
import { WebSQLDatabase } from "expo-sqlite"
import DatabaseContext from "../../Context/DatabaseContext"
import { useAppDispatch } from "../../hooks/redux"
import {createAddSingle} from './../../store/actions/playlistsActions'

interface CreatePlaylistProps {
  open: boolean;
  onClose: () => void;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({
  open,
  onClose,
}) => {
  const database = React.useContext<WebSQLDatabase>(DatabaseContext)

  const dispatch = useAppDispatch();

  const [error, setError] = React.useState<string | null>(null)
  const [pendingCreate, setPendingCreate] = React.useState(false)
  const [playlistName, setPlaylistName] = React.useState<string>("");

  const PATTERN_PLAYLIST = React.useMemo(() => /^[a-z\d \-]{2,32}$/i, [])

  const onValidPlaylistName = () => {
    setError(null)
  }

  const onInvalidPlaylistName = () => {
    setError("playlist name invalid.")
  }

  const checkPlaylistName = (playlistName: string) => {
    if(PATTERN_PLAYLIST.test(playlistName)) {
      onValidPlaylistName();
    } else {
      onInvalidPlaylistName();
    }
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

            const playlistCreated = { id: insertedId, name: playlistName };

            dispatch(createAddSingle(playlistCreated));
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

  const canSubmit = !pendingCreate && !error;

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
              <TextInput
                error={!!error}
                right={(
                  <TextInput.Affix text={`${playlistName.length}/32`} />
                )}
                value={playlistName}
                placeholder='playlist'
                blurOnSubmit
                onSubmitEditing={() => onCreatePlaylist(playlistName)}
                onChangeText={(text) => {
                  setPlaylistName(text)
                  checkPlaylistName(text);
                }} />

                <HelperText type="error" visible={!!error}>
                  {error}
                </HelperText>

                <Button
                  mode="contained"
                  disabled={!canSubmit}
                  icon="plus"
                  onPress={() => {
                    onCreatePlaylist(playlistName);
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
