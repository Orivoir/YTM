import * as React from "react"
import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs"
import type { BottomTabParamsList } from "./../Routing"
import { ActivityIndicator, Button, Chip, Surface, Title } from "react-native-paper"

import styles from "../styles"
import { View, StyleSheet, ViewStyle, FlatList, ScrollView } from "react-native"

import SearchBar from "../SearchBar/SearchBar"
import SearchList from "../SearchList/SearchList"

const Search: React.FC<MaterialBottomTabScreenProps<BottomTabParamsList, "Search">> = () => {

  return (
    <View style={StyleSheet.compose<ViewStyle>(styles.screenContainer, { flex: 1 })}>
      <View style={{ flex: 1 }}>
        <SearchBar />

        <View style={{
          marginVertical: 8,
          flex: 1
        }}>

          <View style={{ flex: 1 }}>
            <View>
              <FlatList
                renderItem={({ item }) => (
                  <Chip onPress={() => {
                    console.log(`@TODO: search from chip suggestions with: ${item}`);
                    // onSearchRef.current(item);
                  }}>{item}</Chip>
                )}
                horizontal
                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 2 }} />}
                keyExtractor={label => label}
                data={["Angele", "Maître Gims", "Eminem", "Orelsan", "Niska", "Booba"]} />
              </View>

              <View style={{marginVertical: 4}} />

              <View style={{
                flex: 1
              }}>
                <ScrollView>
                  <SearchList type="Musics" />
                  <SearchList type="Albums" />
                  <SearchList type="Artists" />
                </ScrollView>
              </View>
            </View>

        </View>
      </View>
    </View>
  )
}

export default Search
