import * as React from "react"
import { FlatList, View } from "react-native"
import { Title } from "react-native-paper"
import SearchItem from "../SearchItem/SearchItem"
import type { SearchItemType } from "../SearchResult/SearchResult"

interface SearchListProps {
  type: "Musics" | "Albums" | "Artists";
  items: SearchItemType[]
}

const SearchList: React.FC<SearchListProps> = ({
  items,
  type
}) => {
  return (
    <View>
      <Title>{type}</Title>
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
