import * as React from "react"
import { View, FlatList, useWindowDimensions } from "react-native"
import { Modal, Portal, Surface } from "react-native-paper"
import DatabaseContext from "../../Context/DatabaseContext"
import getMusicsByPlaylist from "../../libs/get-musics-by-playlist"
import ModalHeader from "../ModalHeader/ModalHeader"
import MusicLocalInline from "../MusicLocalInline/MusicLocalInline"
import styles from "../styles"

type MusicDetailItem = {
  playlist_id: number;
  id: number,
  title: string,
  ownerName: string,
  filename: string,
  publishedAt?: string,
  thumbnail?: string;
  ownerThumbnail?: string;
}

interface PlaylistDetailsProps {
  playlist: {name: string; id: number};
  // musics: {
  //   playlist_id: number,
  //   id: number,
  //   title: string,
  //   ownerName: string,
  //   filename: string,
  //   publishedAt?: string,
  //   thumbnail?: string,
  //   ownerThumbnail?: string
  // }[];

  open: boolean;
  onClose: () => void;
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({
  onClose,
  open,
  playlist
}) => {
  const { height } = useWindowDimensions()

  const musicsRef = React.useRef<MusicDetailItem[]>([]);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const database = React.useContext(DatabaseContext)

  const refreshMusics = () => {
    setIsPending(true);
    getMusicsByPlaylist(database, playlist.id)
    .then(rows => {
      musicsRef.current = rows._array
    })
    .catch((sqlError) => {
      console.log("> cant read musics from SQLite with: ", sqlError)
    })
    .finally(() => {
      setIsPending(false)
    })
  }

  React.useEffect(() => {
    if(open) {
      refreshMusics();
    }
  }, [open]);

  const musics = musicsRef.current;

  return (
    <Portal>
      <Modal visible={open} onDismiss={onClose}>
        <Surface style={styles.modalContainer}>
          <ModalHeader
            title={playlist.name}
            subtitle={`${musics.length} musics`}
            onClose={onClose} />

          <View style={{
            marginVertical: 4
          }}>
            <View style={{
              height: height / 2,
              maxHeight: height / 2
            }}>
              <FlatList
                ItemSeparatorComponent={() => (
                  <View style={{ marginVertical: 2 }} />
                )}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <MusicLocalInline {...item} />}
                data={musics} />
            </View>
          </View>
        </Surface>
      </Modal>
    </Portal>
  )
}

export default PlaylistDetails
