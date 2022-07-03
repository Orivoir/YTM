import * as React from "react"
import { FlatList, View } from "react-native"
import { ActivityIndicator, Title } from "react-native-paper"
import { AlbumPreviewAPI, ArtistPreviewAPI, MusicVideoAPI } from "../../api/ytm-api"
import { useAppSelector } from "../../hooks/redux"
import SearchItem from "../SearchItem/SearchItem"
import {
  normalizeArtists,
  normalizeAlbums,
  normalizeMusics
} from "../../libs/normalize-search-items"

export type SearchItemHelper = {
  isAlbum: (details: AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI) => details is AlbumPreviewAPI;
  isArtist: (details: AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI) => details is ArtistPreviewAPI;
  isMusic: (details: AlbumPreviewAPI | MusicVideoAPI | ArtistPreviewAPI) => details is MusicVideoAPI;
}

interface SearchListProps {
  type: "Musics" | "Albums" | "Artists";
}

const SearchList: React.FC<SearchListProps> = ({
  type
}) => {

  const {items, isPending}: {
    items: ArtistPreviewAPI[] | AlbumPreviewAPI[] | MusicVideoAPI[];
    isPending: boolean;
  } = useAppSelector((state) => {
    return (
      type === "Albums" ? {
        items: state.searchResult.albums,
        isPending: state.searchResult.pendingState.albums
      }: type === "Artists" ? {
        items: state.searchResult.artist,
        isPending: state.searchResult.pendingState.artists
      }: {
        items: state.searchResult.musics,
        isPending: state.searchResult.pendingState.musics
      }
    )

  });

  if(!isPending && items.length === 0) {
    return <></>;
  }

  const getNormalizer = () => {
    switch(type) {
      case "Albums":
        return normalizeAlbums;
      case "Artists":
        return normalizeArtists;
      default:
        return normalizeMusics;
    }
  }

  const normalizer = getNormalizer();

  const itemsNormalized = normalizer(items);

  return (
    <View>
      <Title>{type}</Title>

      {isPending ? (
        <View style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <ActivityIndicator animating size={32} />
        </View>
      ): (
      <FlatList
        keyExtractor={item => item.id?.toString() || ""}
        horizontal
        ItemSeparatorComponent={() => (
          <View style={{ marginHorizontal: 4 }} />
        )}
        renderItem={({ item }) => (
          <SearchItem
            getDetails={item.getDetails}
            type={type}
            id={item.id}
            title={item.title || ""}
            thumbnailUrl={item.thumbnailUrl || ""}
            subtitle={item.subtitle} />
        )}
        data={itemsNormalized} />
      )}

    </View>
  )
}

export default SearchList
