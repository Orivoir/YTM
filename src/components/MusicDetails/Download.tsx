import * as React from "react"
import { DeviceEventEmitter, Image, View } from "react-native"
import { HelperText, IconButton, useTheme } from "react-native-paper"
import { EVENT_DOWNLOAD_PROGRESS_UPDATE } from "../../constant";
import CircularProgressDownload from "../CircularProgressDownload/CircularProgressDownload";

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
  // const { canDownload } = useCanDownload(youtubeId)

  const [downloadProgress, setDownloadProgress] = React.useState<number>(-1);

  const onDownloadStatus = (downloadStatus: {
    id: string;
    isFinish: boolean;
    percent: number
  }) => {

    if(youtubeId === downloadStatus.id) {
      if(downloadStatus.isFinish) {
        setDownloadProgress(-1);
      } else {
        setDownloadProgress(downloadStatus.percent);
      }
    }

  }

  React.useEffect(() => {

    const subscription = DeviceEventEmitter.addListener(EVENT_DOWNLOAD_PROGRESS_UPDATE, onDownloadStatus);

    return () => {
      subscription.remove();
    }

  }, []);

  const canDownload = downloadProgress === -1;

  const theme = useTheme();

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
          {!canDownload ? (
            <CircularProgressDownload
              progress={downloadProgress}
              size={30} />
          ): (
            <IconButton
              icon="download"
              size={24}
              onPress={onDownload} />
          )}
        </View>

      </View>

      <HelperText type="info" visible={!canDownload}>
        Already in download queue.
      </HelperText>
    </View>
  )
}

export default Download
