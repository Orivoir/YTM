import * as React from "react"
import { Card, TouchableRipple } from "react-native-paper"
import { useAppDispatch } from "../../hooks/redux"
import { SearchDetailsAction } from "../../store/reducers/searchDetailsReducers"
import { SearchItemDetailsCallback, SearchItemHelper } from "../SearchResult/SearchResult"
import {
  createAlbumSearchDetails,
  createArtistSearchDetails,
  createCancel,
  createMusicSearchDetails
} from "./../../store/actions/searchDetailsActions"

interface SearchItemProps extends SearchItemHelper {
  title: string;
  thumbnailUrl: string;
  subtitle?: string;
  width?: number;
  id?: number | string;
  type: "Musics" | "Albums" | "Artists";
  getDetails: SearchItemDetailsCallback;
}

const SearchItem: React.FC<SearchItemProps> = ({
  title,
  subtitle,
  thumbnailUrl,
  width = 180,
  id,
  type,
  getDetails,
  isAlbum,
  isArtist,
  isMusic
}) => {
  const dispatch = useAppDispatch()

  const onPress = () => {
    const details = getDetails()

    let action: SearchDetailsAction = createCancel()

    if (isAlbum(details)) {
      action = createAlbumSearchDetails(details)
    } else if (isArtist(details)) {
      action = createArtistSearchDetails(details)
    } else if (isMusic(details)) {
      action = createMusicSearchDetails(details)
    } else {
      console.log("> cant open details for search item because never find category item")
    }

    dispatch(action)
  }

  return (
    <Card style={{
      minWidth: width,
      maxWidth: width,
      width
    }}>
      <Card.Title title={title} subtitle={subtitle} />

      <TouchableRipple onPress={onPress}>
        <Card.Cover source={{ uri: thumbnailUrl }} style={{ width }} />
      </TouchableRipple>
    </Card>
  )
}

export default SearchItem
