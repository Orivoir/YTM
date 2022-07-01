import * as React from "react"
import { View } from "react-native"
import { Avatar, Text, useTheme } from "react-native-paper"
import { ArtistAPI } from "../../api/ytm-api"
import TextCompose from "../TextCompose/TextCompose"

interface ArtistInlineProps {
  artist: ArtistAPI;
}

const ArtistInline: React.FC<ArtistInlineProps> = ({
  artist
}) => {
  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 4
    }} key={artist.artistId}>
      {(artist?.thumbnails && artist?.thumbnails?.length > 0) && (
        <Avatar.Image source={{ uri: artist.thumbnails[0].url }} size={32} />
      )}

      <Text style={{
        marginStart: 8,
        marginEnd: 8
      }}>{artist.name}</Text>

      <TextCompose
        rightValue={`${artist?.singles?.length} single`}
        leftValue={`${artist?.albums?.length} albums`} />
    </View>
  )
}

export default ArtistInline
