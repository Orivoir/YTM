import * as React from "react"
import { DeviceEventEmitter, FlatList, Image, View } from "react-native"
import { ActivityIndicator, Button, Text } from "react-native-paper"
import { EVENT_ADD_DOWNLOADS } from "../../constant"
import useSelectPlaylist from "../../hooks/useSelectPlaylist"
import music2download from "../../libs/music2download"
import ModalHeader from "../ModalHeader/ModalHeader"
import MusicInline from "../MusicInline/MusicInline"
import api, { AlbumPreviewAPI, MusicVideoAPI } from "./../../api/ytm-api"

interface AlbumDetailsProps {
  item: AlbumPreviewAPI;
  onClose: () => void;
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({
  item,
  onClose
}) => {

  const [isPendingAlbum, setIsPendingAlbum] = React.useState<boolean>(false)
  const abortAlbum = React.useRef<AbortController>(new AbortController())

  const musicsRef = React.useRef<MusicVideoAPI[]>([])

  React.useEffect(() => {
    abortAlbum.current = new AbortController()
    setIsPendingAlbum(true)

    api.getAlbum(item.albumId || "", {
      signal: abortAlbum.current.signal
    })
      .then(({ musics }) => {
        musicsRef.current = musics
      })
      .catch(error => {
        console.log(`> cant fetch album with: ${error.code} => ${error.message}`)
      })
      .finally(() => {
        setIsPendingAlbum(false)
      })

    return () => {
      abortAlbum.current.abort()
    }
  }, [item])

  const {onOpen, playlist, render} = useSelectPlaylist({
    musicTitle: item.title || ""
  });

  React.useEffect(() => {
    if(playlist && musicsRef.current) {
      DeviceEventEmitter.emit(
        EVENT_ADD_DOWNLOADS,
        musicsRef.current.map(music => (
          music2download(music, playlist.id)
        ))
      )
    }
  }, [playlist])

  return (
    <>
    <ModalHeader title={item.title || ""} subtitle={item.artist} onClose={onClose} />

    <View style={{
      marginVertical: 4
    }}>

      <View style={{
        marginBottom: 8,
        display: "flex",
        alignItems: "center"
      }}>
        <View style={{ marginBottom: 4 }}>
          <Image style={{ width: 96, height: 96 }} source={{ uri: item.thumbnailUrl }} />
        </View>

        <View>
          <Text>published in {item.year} by {item.artist}</Text>
        </View>

        <View>
          <Button icon="download" onPress={onOpen}>
            Download {!isPendingAlbum ? musicsRef.current.length + " musics": "all"}
          </Button>
        </View>
      </View>

      <View style={{
        maxHeight: 300
      }}>
        {isPendingAlbum
          ? (
          <ActivityIndicator animating size={32} />
            )
          : (
          <FlatList
            renderItem={({ item }) => <MusicInline music={item} />}
            ItemSeparatorComponent={() => <View style={{ marginVertical: 2 }} />}
            horizontal={false}
            keyExtractor={item => item.youtubeId || item.title || ""}
            data={musicsRef.current} />
            )}
      </View>

    </View>

    {render}
    </>
  )
}

export default AlbumDetails
