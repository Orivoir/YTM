import * as React from "react"
import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs"
import type { BottomTabParamsList } from "./../Routing"
import { Button, Card, IconButton, List, Paragraph, Surface, Title } from "react-native-paper"

import styles from "../styles"
import { FlatList, Image, View } from "react-native"
import CategoryItem from "../CategoryItem/CategoryItem"
import categories, { MusicCategory } from "./../../libs/categories"
import Categories from "./../Categories/Categories"

const Home: React.FC<MaterialBottomTabScreenProps<BottomTabParamsList, "Home">> = () => {
  const onFetchCategory = (categoryId: number) => {
    const category: MusicCategory | null = categories.find(c => c.id === categoryId) || null

    if (!category) {
      console.log(`> never find category with id: ${categoryId}`)
    }

    // fetch data...
  }

  return (
    <View style={styles.screenContainer}>

      <Categories onFetchCategory={onFetchCategory} />

    </View>
  )
}

export default Home
