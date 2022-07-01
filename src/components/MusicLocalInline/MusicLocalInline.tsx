import * as React from "react"
import { Image, View } from "react-native"
import { IconButton } from "react-native-paper"
import { useAppDispatch } from "../../hooks/redux"
import splitText from "../../libs/splitText"
import { createPlayLocalMusic } from "../../store/actions/playLocalActions"
import TextCompose from "../TextCompose/TextCompose"

interface MusicLocalInlineProps {
  playlist_id: number;
  id: number;
  title: string;
  ownerName: string;
  filename: string;
  publishedAt?: string;
  thumbnail?: string;
  ownerThumbnail?: string;
}

const MusicLocalInline: React.FC<MusicLocalInlineProps> = ({
  filename,
  id,
  ownerName,
  playlist_id,
  title,
  ownerThumbnail,
  publishedAt,
  thumbnail
}) => {
  const dispatch = useAppDispatch()

  const onPlayMusic = () => {
    dispatch(createPlayLocalMusic({
      filename,
      id,
      ownerName,
      playlist_id,
      title,
      ownerThumbnail,
      publishedAt,
      thumbnail
    }))
  }

  return (
    <View>
      <View style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }}>
        {thumbnail && (
          <View style={{
            marginEnd: 8
          }}>
            <Image
              source={{ uri: thumbnail }}
              style={{ width: 32, height: 32 }} />
          </View>
        )}

        <View style={{
          marginEnd: 8
        }}>
          <TextCompose
            rightValue={publishedAt || "?"}
            leftValue={splitText(title, 15)} />
        </View>

        <View>
          <IconButton
            icon="play"
            size={24}
            onPress={onPlayMusic} />
        </View>
      </View>
    </View>
  )
}

export default MusicLocalInline
