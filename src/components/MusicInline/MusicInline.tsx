import * as React from "react"
import { DeviceEventEmitter, View } from "react-native"
import { Avatar, HelperText, IconButton, Text, Title } from "react-native-paper"
import api, { MusicVideoAPI } from "../../api/ytm-api"
import { EVENT_ADD_DOWNLOAD } from "../../constant"
import useCanDownload from "../../hooks/useCanDownload"
import useSelectPlaylist from "../../hooks/useSelectPlaylist"
import music2download from "../../libs/music2download"
import splitText from "../../libs/splitText"
import TextCompose from "../TextCompose/TextCompose"

interface MusicInlineProps {
  music: MusicVideoAPI;
}

const MusicInline: React.FC<MusicInlineProps> = ({
  music
}) => {
  const { onOpen, playlist, render } = useSelectPlaylist({
    musicTitle: music.title || ""
  })

  const {canDownload} = useCanDownload(music.youtubeId || "");

  const onDownload = (playlist: {id: number, name: string}) => {
    console.log("> add new download");

    DeviceEventEmitter.emit(
      EVENT_ADD_DOWNLOAD,
      music2download(music, playlist.id)
    )

  }

  React.useEffect(() => {
    if (playlist !== null) {
      onDownload(playlist)
    }
  }, [playlist])

  return (
    <>
    <View style={{
      display: "flex",
      alignItems: "center",
      flexDirection: "row"
    }}>

      <View style={{ marginEnd: 8 }}>
        <Avatar.Image size={32} source={{ uri: music.thumbnailUrl }} />
      </View>

      <View style={{ marginEnd: 8 }}>
        <TextCompose
          leftValue={splitText(music.title || "", 15)}
          rightValue={splitText(music.album || "", 15)} />
      </View>

      <View>
        <IconButton
          disabled={!canDownload}
          icon="download"
          size={24}
          onPress={onOpen} />
      </View>

    </View>

    {render}
    </>
  )
}

export default MusicInline
