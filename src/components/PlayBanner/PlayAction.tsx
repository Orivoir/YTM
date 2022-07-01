import { AVPlaybackStatus } from "expo-av"
import { Sound } from "expo-av/build/Audio"
import * as React from "react"
import { IconButton } from "react-native-paper"

interface PlayActionProps {
  sound: Sound;
}

const PlayAction: React.FC<PlayActionProps> = ({
  sound
}) => {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)

  React.useEffect(() => {
    sound.getStatusAsync()
      .then((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying)
        }
      })
  }, [sound])

  const onTogglePlay = () => {
    if (isPlaying) {
      sound.pauseAsync()
        .then(() => {
          console.log("> audio switch to pause status")
          setIsPlaying(false)
        })
    } else {
      sound.playAsync()
        .then(() => {
          console.log("> audio switch to play status")
          setIsPlaying(true)
        })
    }
  }

  return (
    <IconButton
      onPress={onTogglePlay}
      icon={isPlaying ? "pause" : "play"}
      size={24} />
  )
}

export default PlayAction
