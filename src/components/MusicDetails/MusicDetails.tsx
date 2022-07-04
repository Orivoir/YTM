import * as React from "react"
import { ActivityIndicator, View, DeviceEventEmitter } from "react-native"
import { EVENT_ADD_DOWNLOAD } from "../../constant"
import useSelectPlaylist from "../../hooks/useSelectPlaylist"
import ArtistInline from "../ArtistInline/ArtistInline"
import ModalHeader from "../ModalHeader/ModalHeader"
import api, { ArtistAPI, GetArtistAPI, MusicVideoAPI } from "./../../api/ytm-api"
import Download from "./Download"

interface MusicDetailsProps {
  item: MusicVideoAPI;
  onClose: () => void;
}

const MusicDetails: React.FC<MusicDetailsProps> = ({
  item,
  onClose
}) => {

  const artistsRef = React.useRef<ArtistAPI[]>([])
  const abortArtists = React.useRef<AbortController>(new AbortController())

  const { onOpen, playlist, render } = useSelectPlaylist({
    musicTitle: item.title || ""
  })

  const [isPendingArtists, setIsPendingArtists] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!item.artists?.length) {
      return
    }

    setIsPendingArtists(true)

    abortArtists.current = new AbortController()

    Promise.all(item.artists.map(artist => (
      api.getArtist(artist.id || "", { signal: abortArtists.current.signal })
    )))
      .then((responses: GetArtistAPI[]) => {
        artistsRef.current = responses.map(response => response.artist)
      })
      .catch(firstError => {
        console.log(`> cant fetch artists with ${firstError.code} => ${firstError.message}`)
      })
      .finally(() => {
        setIsPendingArtists(false)
      })

    return () => {
      abortArtists.current.abort()
    }
  }, [item])

  React.useEffect(() => {
    if (playlist !== null) {
      onDownload(playlist)
    }
  }, [playlist])

  const onDownload = (playlist: {id: number, name: string}) => {
    console.log("> add new download")

    DeviceEventEmitter.emit(EVENT_ADD_DOWNLOAD, {
      youtubeId: item.youtubeId || "",
      ownerName: artistsRef?.current[0].name || "",
      remote: api.getStreamUrl(item.youtubeId || ""),
      title: item.title || "",
      thumbnail: item.thumbnailUrl,
      playlistId: playlist.id,
      ownerThumbnail: (artistsRef?.current[0].thumbnails && artistsRef?.current[0].thumbnails.length > 0) ? artistsRef?.current[0].thumbnails[0].url : undefined
    })
  }

  return (
    <>
    <ModalHeader title={item.title || ""} subtitle={item.album} onClose={onClose} />

    <View style={{ marginVertical: 4 }}>
      <Download
        youtubeId={item.youtubeId || ""}
        thumbnailUrl={item.thumbnailUrl || ""}
        onDownload={onOpen} />

      <View>
        {isPendingArtists
          ? (
          <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 4
          }}>
            <ActivityIndicator animating size={16} />
          </View>
            )
          : (
          <View style={{
            marginVertical: 4
          }}>
            {artistsRef.current?.map(artist => (
              <ArtistInline artist={artist} key={artist.artistId} />
            ))}
          </View>
            )}
      </View>
    </View>

    {render}
    </>
  )
}

export default MusicDetails
