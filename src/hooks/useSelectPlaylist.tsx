import * as React from "react"
import { DeviceEventEmitter, EmitterSubscription } from "react-native";
import { EVENT_SELECTED_PLAYLIST, EVENT_SELECT_PLAYLIST } from "../constant";

export type UseSelectPlaylistOptions = {
  musicTitle: string;
}

export default function useSelectPlaylist (options: UseSelectPlaylistOptions) {

  const [playlist, setPlaylist] = React.useState<{id: number, name: string} | null>(null)

  const playlistSelectedSubscriptionRef = React.useRef<EmitterSubscription | null>(null);

  const onSelectedPlaylist = (params: {
    playlist: {id: number, name: string}
  }) => {
    setPlaylist(params.playlist)
  }

  const onOpen = () => {
    playlistSelectedSubscriptionRef.current?.remove();
    playlistSelectedSubscriptionRef.current = DeviceEventEmitter.addListener(
      EVENT_SELECTED_PLAYLIST,
      onSelectedPlaylist
    )

    DeviceEventEmitter.emit(EVENT_SELECT_PLAYLIST, {
      musicTitle: options.musicTitle || "",
    })
  }

  React.useEffect(() => {

    return () => {
      playlistSelectedSubscriptionRef.current?.remove()
    }

  }, [])

  return {
    playlist,
    onOpen
  }
}
