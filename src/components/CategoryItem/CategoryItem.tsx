import * as React from "react"
import { View } from "react-native"
import { Card, IconButton } from "react-native-paper"
import { MusicCategory } from "../../libs/categories"

interface CategoryItemProps extends MusicCategory {

  onPressCategory: (categoryId: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  name,
  id,
  thumbnail,
  onPressCategory
}) => {
  return (
    <Card style={{
      width: 180,
      maxWidth: 180,
      minWidth: 180
    }}>
      <Card.Title title={name} />

      <View style={{
        position: "relative"
      }}>
        <Card.Cover source={thumbnail} style={{ width: 180 }} />

        <View style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          top: 0,
          backgroundColor: "rgba(0,0,0,.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>

          <View>
            <IconButton icon="music-box-multiple" size={24} onPress={() => onPressCategory(id)} />
          </View>

        </View>
      </View>
    </Card>
  )
}

export default CategoryItem
