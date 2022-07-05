import * as React from "react"
import { DeviceEventEmitter, EmitterSubscription, View } from "react-native"
import { Avatar, IconButton} from "react-native-paper"
import type { MusicVideoAPI } from "../../api/ytm-api"
import { EVENT_ADD_DOWNLOAD, EVENT_SELECTED_PLAYLIST, EVENT_SELECT_PLAYLIST } from "../../constant"
import useDownloadStatus from "../../hooks/useDownloadStatus"
import useSelectPlaylist from "../../hooks/useSelectPlaylist"
import music2download from "../../libs/music2download"
import splitText from "../../libs/splitText"
import CircularProgressDownload from "../CircularProgressDownload/CircularProgressDownload"
import TextCompose from "../TextCompose/TextCompose"

interface MusicInlineProps {
  music: MusicVideoAPI;
}

const MusicInline: React.FC<MusicInlineProps> = ({
  music
}) => {
  // const { onOpen, playlist, render } = useSelectPlaylist({
  //   musicTitle: music.title || ""
  // })

  const {canDownload, progress} = useDownloadStatus(music.youtubeId || "");

  // const playlistSelectedSubscriptionRef = React.useRef<EmitterSubscription | null>(null);

  const {onOpen, playlist} = useSelectPlaylist({
    musicTitle: music.title || ""
  });

  const onDownload = (playlist: {id: number, name: string}) => {
    console.log("> add new download");

    DeviceEventEmitter.emit(
      EVENT_ADD_DOWNLOAD,
      music2download(music, playlist.id)
    )

  }

  React.useEffect(() => {
    if(playlist) {
      onDownload(playlist);
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
        {canDownload ? (
          <IconButton
            icon="download"
            size={24}
            onPress={onOpen} />
        ): (
          <CircularProgressDownload size={15} showETA={false} progress={progress} />
        )}
      </View>

    </View>
    </>
  )
}

export default MusicInline
