import * as React from "react"
import { View, FlatList, useWindowDimensions } from "react-native"
import { Modal, Portal, Surface } from "react-native-paper"
import ModalHeader from "../ModalHeader/ModalHeader"
import MusicLocalInline from "../MusicLocalInline/MusicLocalInline"
import styles from "../styles"

interface PlaylistDetailsProps {
  playlistName: string;
  musics: {
    playlist_id: number,
    id: number,
    title: string,
    ownerName: string,
    filename: string,
    publishedAt?: string,
    thumbnail?: string,
    ownerThumbnail?: string
  }[];

  open: boolean;
  onClose: () => void;
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({
  musics,
  onClose,
  open,
  playlistName
}) => {
  const { height } = useWindowDimensions()

  return (
    <Portal>
      <Modal visible={open} onDismiss={onClose}>
        <Surface style={styles.modalContainer}>
          <ModalHeader
            title={playlistName}
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
