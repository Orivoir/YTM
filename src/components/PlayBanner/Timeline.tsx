import { AVPlaybackStatus } from "expo-av"
import { Sound } from "expo-av/build/Audio"
import * as React from "react"
import Slider from '@react-native-community/slider';


interface TimelineProps {
  sound: Sound;
  durationMillis: number;
}

const Timeline: React.FC<TimelineProps> = ({
  sound,
  durationMillis
}) => {
  const [currentTime, setCurrentTime] = React.useState<number>(0)
  const [virtualCurrentTime, setVirtualCurrentTime] = React.useState<number>(0)

  const isEngagedRef = React.useRef<boolean>(false)

  React.useEffect(() => {
    sound.setOnPlaybackStatusUpdate((playbackStatus: AVPlaybackStatus) => {
      if (playbackStatus.isLoaded) {
        setCurrentTime(playbackStatus.positionMillis)
      }
    })
  }, [sound])

  const onChangeCurrentTime = (newCurrentTime: number) => {
    sound.setPositionAsync(newCurrentTime)
      .then(() => {
        console.log("> set current time at: " + newCurrentTime)
      })
  }

  return (
    <Slider
      onValueChange={newValue => {
        if (isEngagedRef.current) {
          setVirtualCurrentTime(newValue)
        }
      }}
      onResponderRelease={() => {
        isEngagedRef.current = false
        onChangeCurrentTime(virtualCurrentTime)
      }}
      onResponderStart={() => {
        isEngagedRef.current = true
        setVirtualCurrentTime(currentTime)
      }}

      value={isEngagedRef.current ? virtualCurrentTime : currentTime}
      maximumValue={durationMillis}
      minimumValue={0} />
  )
}

export default Timeline
