import { AVPlaybackStatus } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import React from "react";

export default function useBatchOffsetTime(sound: Sound | null = null) {

  const accumulatedOffsetTimeRef = React.useRef<number>(0);
  const couldownID = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const isEngagedCouldownRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    return () => {
      if(couldownID.current) {
        clearTimeout(couldownID.current)
      }
    }
  })

  const onBatchOffsetTime = () => {

    sound?.getStatusAsync()
    .then((playbackStatus: AVPlaybackStatus) => {
      if (playbackStatus.isLoaded) {
        sound?.setPositionAsync(
          playbackStatus.positionMillis + accumulatedOffsetTimeRef.current
        )
        .then(() => {
          console.log(`> offset current time ${accumulatedOffsetTimeRef.current/1000}seconds`)
          accumulatedOffsetTimeRef.current = 0;
          isEngagedCouldownRef.current = false;
        })
      }
    })

  }

  const onOffsetTime = (direction: "backward" | "forward") => {

    const offset = (1000 * 10) * (direction === "backward" ? -1 : 1)

    // batch multiple offset current time
    accumulatedOffsetTimeRef.current += offset;

    if(!isEngagedCouldownRef.current) {
      isEngagedCouldownRef.current = true;

      couldownID.current = setTimeout(onBatchOffsetTime, 500);
    } else {
      // @Should reset timeout

      if(couldownID.current) {
        clearTimeout(couldownID.current);
      }
      couldownID.current = setTimeout(onBatchOffsetTime, 500);
    }
  }

  return {
    onOffsetTime
  }
}