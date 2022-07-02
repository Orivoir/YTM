import * as React from "react"
import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs"
import type { BottomTabParamsList } from "./../Routing"
import { ActivityIndicator, Button, Chip, Surface, Title } from "react-native-paper"

import styles from "../styles"
import { View, StyleSheet, ViewStyle, FlatList } from "react-native"

import SearchResult from "../SearchResult/SearchResult"
import SearchBar from "../SearchBar/SearchBar"
import { AlbumPreviewAPI, ArtistPreviewAPI, MusicVideoAPI } from "../../api/ytm-api"

const Search: React.FC<MaterialBottomTabScreenProps<BottomTabParamsList, "Search">> = () => {
  const [items, setItems] = React.useState<{
    artists: ArtistPreviewAPI[];
    musics: MusicVideoAPI[];
    albums: AlbumPreviewAPI[];
  }>({
    albums: [],
    artists: [],
    musics: []
  })

  const [isPending, setIsPending] = React.useState<boolean>(false)

  const onCancelSearch = () => {
    console.log("> abort search")

    // abort network request (reject with error.code === 20)
    abortSearchRef.current?.abort()
  }

  const pendingStatus = React.useRef<{
    isPendingAlbums: boolean;
    isPendingArtists: boolean;
    isPendingMusics: boolean;
  }>({
    isPendingAlbums: false,
    isPendingArtists: false,
    isPendingMusics: false
  })

  const onNextStepSearch = (type: "album" | "music" | "artist") => {

    switch(type) {
      case "album":
        pendingStatus.current.isPendingAlbums = false;
        break;
      case "artist":
        pendingStatus.current.isPendingArtists = false;
        break;
      case "music":
        pendingStatus.current.isPendingMusics = false;
        break;
    }

    if(
      !pendingStatus.current.isPendingAlbums &&
      !pendingStatus.current.isPendingArtists &&
      !pendingStatus.current.isPendingMusics
    ) {
      setIsPending(false);
    }
  }

  const abortSearchRef = React.useRef<AbortController | null>(null)

  return (
    <View style={StyleSheet.compose<ViewStyle>(styles.screenContainer, { flex: 1 })}>
      <View style={{ flex: 1 }}>
        <SearchBar
          onNewAlbums={albums => {
            onNextStepSearch("album")
            setItems(currentItems => ({...currentItems, albums}))
          }}
          onNewArtists={artists => {
            onNextStepSearch("artist")
            setItems(currentItems => ({...currentItems, artists}))
          }}
          onNewMusics={musics => {
            onNextStepSearch("music")
            setItems(currentItems => ({...currentItems, musics}))
          }}
          onNewAbortController={(abortSearch: AbortController) => (
            abortSearchRef.current = abortSearch
          )}
          onStartPending={() => {
            pendingStatus.current = {
              isPendingAlbums: true,
              isPendingArtists: true,
              isPendingMusics: true
            }
            setIsPending(true)
          }}
          onSubmitSearch={() => !isPending}  />

        <View style={{
          marginVertical: 8,
          flex: 1
        }}>

          <View style={{ flex: 1 }}>
            <View>
              <FlatList
                renderItem={({ item }) => (
                  <Chip onPress={() => {
                    console.log(`@TODO: search from chip for: ${item}`)
                  }}>{item}</Chip>
                )}
                horizontal
                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 2 }} />}
                keyExtractor={label => label}
                data={["Angele", "Maître Gims", "Eminem", "Orelsan", "Niska", "Booba"]} />
              </View>

              <View style={{
                flex: 1
              }}>
                <SearchResult
                  pendingStatus={pendingStatus.current}
                  albums={items.albums}
                  musics={items.musics}
                  artists={items.artists} />
              </View>
            </View>

        </View>
      </View>
    </View>
  )
}

export default Search
