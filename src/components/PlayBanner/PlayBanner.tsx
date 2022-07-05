import * as React from "react"
import { Audio } from "expo-av"
import { documentDirectory } from "expo-file-system"
import { Avatar, IconButton, Surface, useTheme } from "react-native-paper"
import { View, DeviceEventEmitter } from "react-native"
import { Sound } from "expo-av/build/Audio"
import Timeline from "./Timeline"
import splitText from "../../libs/splitText"
import PlayAction from "./PlayAction"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import SwipeTrash from "../SwipeTrash/SwipeTrash"
import TextCompose from "../TextCompose/TextCompose"
import useBatchOffsetTime from "../../hooks/useBatchOffsetTime"
import VolumeAction from "./VolumeAction"
import { EVENT_PLAY_MUSIC } from "../../constant"
import { PlayLocalState } from "../../store/reducers/playLocalReducers"
import FastOffsetAction from "./FastOffsetAction"

interface PlayBannerProps {}

const PlayBanner: React.FC<PlayBannerProps> = () => {

  const soundRef = React.useRef<Sound | null>(null)
  const durationMillisRef = React.useRef<number>(0)

  const [playLocalMusic, setPlayLocalMusic] = React.useState<PlayLocalState | null>(null)

  const [isPendingLoad, setIsPendingLoad] = React.useState<boolean>(false)

  const theme = useTheme()

  const {onOffsetTime} = useBatchOffsetTime(soundRef.current || null);

  const onPlay = (params: {
    filename: string,
    id: number;
    ownerName: string;
    playlist_id: number;
    title: string;
    ownerThumbnail?: string;
    publishedAt?: string;
    thumbnail?: string;
  }) => {

    setPlayLocalMusic(params);
  }

  React.useEffect(() => {
    if (playLocalMusic) {
      console.log("> play new audio")
      setIsPendingLoad(true);
      Audio.Sound.createAsync({
        uri: documentDirectory + playLocalMusic.filename
      })
      .then(({ sound, status }) => {
        if (status.isLoaded) {
          console.log("> sound has been loaded")

          soundRef.current = sound
          durationMillisRef.current = status.durationMillis || 0

        } else {
          console.log("> cant load file with status: ", status)
        }
      })
      .catch(error => {
        console.log("> cant open file with: ", error)
      })
      .finally(() => {
        setIsPendingLoad(false);
      })
    } else {
      console.log("> not audio to play, idle state")
    }

    return () => {
      soundRef.current?.unloadAsync()
        .then(() => {
          console.log("> audio has been unloaded")
        })

      soundRef.current = null
      durationMillisRef.current = 0
    }
  }, [playLocalMusic])

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(EVENT_PLAY_MUSIC, onPlay);

    return () => {
      subscription.remove();
    }
  }, [])


  if (!playLocalMusic) {
    return <></>
  }

  const onCancel = () => {
    soundRef.current?.unloadAsync()
    .then(() => {
      console.log("> sound unloaded");
      setPlayLocalMusic(null);
    })
    .catch(reason => {
      console.log("> cant unload sound with: ", reason);
    })
  }

  return (
    <SwipeTrash
      contentActionIcon={<MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />}
      contentAction="CLOSE"
      onTrash={() => {
        onCancel()
      }}>
      <Surface>
        <View style={{
          paddingVertical: 4,
          paddingHorizontal: 8
        }}>

          {/* timeline */}
          <View style={{
            marginBottom: 4
          }}>
            {soundRef.current && (
              <Timeline
                sound={soundRef.current}
                durationMillis={durationMillisRef.current} />
            )}
          </View>

          {/* <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: 4
          }}>
            <View style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}>
              <TextCompose
                leftValue={splitText(playLocalMusic.title)}
                rightValue={splitText(playLocalMusic.ownerName)} />

                <View style={{
                  marginStart: 4
                }}>
                  {playLocalMusic.ownerThumbnail ? (
                    <Avatar.Image size={32} source={{ uri: playLocalMusic.ownerThumbnail }} />
                  ): (
                    <Avatar.Text size={32} label={playLocalMusic.ownerName.slice(0, 2)} />
                  )}
                </View>
            </View>
          </View> */}

          {/* controls */}
          <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}>
            <View style={{
              display: "flex",
              flexDirection: "column"
            }}>
              <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}>
                <IconButton
                  onPress={() => {}}
                  icon="skip-backward"
                  size={24} />

                <FastOffsetAction onOffsetTime={() => onOffsetTime("backward")} direction="backward" />

                {soundRef.current && <PlayAction sound={soundRef.current} />}

                  <FastOffsetAction onOffsetTime={() => onOffsetTime("forward")} direction="forward" />

                <IconButton
                  onPress={() => {}}
                  icon="skip-forward"
                  size={24} />
              </View>
            </View>

            {soundRef.current && <VolumeAction sound={soundRef.current} />}
          </View>

        </View>
      </Surface>
    </SwipeTrash>
  )
}

export default PlayBanner
