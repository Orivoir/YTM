import * as React from "react"
import { FlatList, View } from "react-native"
import { ActivityIndicator, Title } from "react-native-paper"
import SearchItem from "../SearchItem/SearchItem"
import type { SearchItemType } from "../SearchResult/SearchResult"

interface SearchListProps {
  type: "Musics" | "Albums" | "Artists";
  items: SearchItemType[];

  pendingStatus: {
    isPendingAlbums: boolean;
    isPendingArtists: boolean;
    isPendingMusics: boolean;
  }
}

const SearchList: React.FC<SearchListProps> = ({
  items,
  type,
  pendingStatus
}) => {

  const isPending = (): boolean => {
    switch(type) {
      case "Albums":
        return pendingStatus.isPendingAlbums;
      case "Artists":
        return pendingStatus.isPendingArtists;
      case "Musics":
        return pendingStatus.isPendingMusics;
      default:
        return false;
    }
  }

  if(items.length === 0  && !isPending()) {
    return <></>;
  }

  return (
    <View>
      <Title>{type}</Title>
      {isPending() && (
        <View style={{
          marginVertical: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <ActivityIndicator animating size={32} />
        </View>
      )}
      <FlatList
        keyExtractor={item => item.id?.toString() || ""}
        horizontal
        ItemSeparatorComponent={() => (
          <View style={{ marginHorizontal: 4 }} />
        )}
        renderItem={({ item }) => (
          <SearchItem
            isAlbum={item.isAlbum}
            isArtist={item.isArtist}
            isMusic={item.isMusic}
            getDetails={item.getDetails}
            type={type}
            id={item.id}
            title={item.title || ""}
            thumbnailUrl={item.thumbnailUrl || ""}
            subtitle={item.subtitle} />
        )}
        data={items} />
    </View>
  )
}

export default SearchList
