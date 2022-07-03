import * as React from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { Audio, AVPlaybackStatus } from "expo-av"
import { documentDirectory } from "expo-file-system"
import { Avatar, Button, IconButton, Surface, Text, Title, useTheme } from "react-native-paper"
import { View, Animated } from "react-native"
import { Sound } from "expo-av/build/Audio"
import Timeline from "./Timeline"
import { createCancelLocalMusic } from "../../store/actions/playLocalActions"
import splitText from "../../libs/splitText"
import PlayAction from "./PlayAction"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import SwipeTrash from "../SwipeTrash/SwipeTrash"
import TextCompose from "../TextCompose/TextCompose"
import useBatchOffsetTime from "../../hooks/useBatchOffsetTime"
import VolumeAction from "./VolumeAction"

interface PlayBannerProps {}

const PlayBanner: React.FC<PlayBannerProps> = () => {
  const playLocalMusic = useAppSelector(state => state.playLocal)
  const dispatch = useAppDispatch()

  const soundRef = React.useRef<Sound | null>(null)
  const durationMillisRef = React.useRef<number>(0)

  const [_, forceRefresh] = React.useState<any>()

  const theme = useTheme()

  const {onOffsetTime} = useBatchOffsetTime(soundRef.current || null);

  React.useEffect(() => {
    if (playLocalMusic) {
      Audio.Sound.createAsync({
        uri: documentDirectory + playLocalMusic.filename
      })
        .then(({ sound, status }) => {
          if (status.isLoaded) {
            console.log("> load audio with status: ", status)

            soundRef.current = sound
            durationMillisRef.current = status.durationMillis || 0

            forceRefresh(Math.random())
          } else {
            console.log("> cant load file with status: ", status)
          }
        })
        .catch(error => {
          console.log("> cant open file with: ", error)
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


  if (!playLocalMusic) {
    return <></>
  }

  const onCancel = () => {
    dispatch(createCancelLocalMusic())
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

          <View style={{
            marginBottom: 4
          }}>
            {soundRef.current && (
              <Timeline
                sound={soundRef.current}
                durationMillis={durationMillisRef.current} />
            )}
          </View>

          <View style={{
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
                  <Avatar.Image size={32} source={{ uri: playLocalMusic.ownerThumbnail }} />
                </View>
            </View>
          </View>

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
                  onPress={() => onOffsetTime("backward")}
                  icon="step-backward"
                  size={24} />

                <View style={{ marginEnd: 8 }} />

                {soundRef.current && <PlayAction sound={soundRef.current} />}

                <View style={{ marginEnd: 8 }} />

                <IconButton
                  onPress={() => onOffsetTime("forward")}
                  icon="step-forward"
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
