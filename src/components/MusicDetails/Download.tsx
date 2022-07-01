import * as React from "react"
import { Image, View } from "react-native"
import { HelperText, IconButton } from "react-native-paper"
import useCanDownload from "../../hooks/useCanDownload"

interface DownloadProps {
  thumbnailUrl: string;
  youtubeId: string;
  onDownload: () => void;
}

const Download: React.FC<DownloadProps> = ({
  thumbnailUrl,
  youtubeId,
  onDownload
}) => {
  const { canDownload } = useCanDownload(youtubeId)

  return (
    <View style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }}>
      <View style={{
        position: "relative"
      }}>
        <Image style={{ width: 96, height: 96 }} source={{ uri: thumbnailUrl }} />

        <View style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          backgroundColor: "rgba(0,0,0,.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <IconButton
            disabled={!canDownload}
            icon="download"
            size={24}
            onPress={onDownload} />
        </View>

      </View>

      <HelperText type="info" visible={!canDownload}>
        Already in download queue.
      </HelperText>
    </View>
  )
}

export default Download
