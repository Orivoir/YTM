import * as React from "react"
import { DeviceEventEmitter } from "react-native"
import { Card, TouchableRipple } from "react-native-paper"
import { SearchItemDetailsCallback } from "../../libs/normalize-search-items"

interface SearchItemProps {
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
  getDetails
}) => {

  const onPress = () => {
    const details = getDetails()

    DeviceEventEmitter.emit("search.item.details", details);
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
