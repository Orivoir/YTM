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

  const isEmpty = items.albums.length === 0 && items.artists.length === 0 && items.musics.length === 0

  const onCancelSearch = () => {
    console.log("> abort search")

    // abort network request (reject with error.code === 20)
    abortSearchRef.current?.abort()
  }

  const abortSearchRef = React.useRef<AbortController | null>(null)

  return (
    <View style={StyleSheet.compose<ViewStyle>(styles.screenContainer, { flex: 1 })}>
      <View style={{ flex: 1 }}>
        <SearchBar
          onNewAbortController={(abortSearch: AbortController) => (
            abortSearchRef.current = abortSearch
          )}
          onSubmitSearch={() => !isPending}
          onTogglePending={setIsPending}
          onNewItems={setItems} />

        <View style={{
          marginVertical: 8,
          flex: 1
        }}>

          {isPending ? (
            <View>
              <ActivityIndicator animating size={32} />

              {/* show abort button only if AbortController is available */}
              {abortSearchRef.current && (
                <View style={{ marginVertical: 4 }}>
                  <Button mode="outlined" onPress={onCancelSearch}>
                    CANCEL
                  </Button>
                </View>
              )}
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {isEmpty
                ? (
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
                  )
                : (
                <View style={{
                  flex: 1
                }}>
                  <SearchResult
                    albums={items.albums}
                    musics={items.musics}
                    artists={items.artists} />
                </View>
                  )}
            </View>
          )}

        </View>
      </View>
    </View>
  )
}

export default Search
