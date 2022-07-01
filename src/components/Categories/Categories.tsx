import * as React from "react"
import { FlatList, View } from "react-native"
import { Title } from "react-native-paper"
import CategoryItem from "../CategoryItem/CategoryItem"
import categories from "./../../libs/categories"

interface CategoriesProps {
  onFetchCategory: (categoryId: number) => void;
}

const Categories: React.FC<CategoriesProps> = ({
  onFetchCategory
}) => {
  return (
    <View>
      <Title>Best categories</Title>

      <FlatList
        keyExtractor={(item) => item.id.toString()}
        horizontal
        ItemSeparatorComponent={() => (
          <View style={{ marginHorizontal: 4 }} />
        )}
        renderItem={({ item }) => (
          <CategoryItem {...item} onPressCategory={onFetchCategory} />
        )}
        data={categories} />
    </View>
  )
}

export default Categories
