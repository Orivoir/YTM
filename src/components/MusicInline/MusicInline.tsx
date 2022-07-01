import * as React from "react"
import { View } from "react-native"
import { Avatar, IconButton, Text, Title } from "react-native-paper"
import api, { MusicVideoAPI } from "../../api/ytm-api"
import useSelectPlaylist from "../../hooks/useSelectPlaylist"
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

  const onDownload = (playlist: {id: number, name: string}) => {
    console.log(`@TODO: dispatch download with (
      youtubeId: ${music.youtubeId},
      ownerName: ${music.artists ? music.artists[0].name : ""},
      remote: ${api.getStreamUrl(music.youtubeId || "")},
      title: ${music.title},
      thumbnail: ${music.thumbnailUrl},
      playlistId: ${playlist.id}
    )`)
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
        <IconButton icon="download" size={24} onPress={onOpen} />
      </View>

    </View>

    {render}
    </>
  )
}

export default MusicInline
