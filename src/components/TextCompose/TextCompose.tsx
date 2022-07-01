import * as React from "react"
import { View } from "react-native"
import { Text, useTheme } from "react-native-paper"

interface TextComposeProps {
  leftValue: string;
  rightValue: string;
  separator?: string;
}

const TextCompose: React.FC<TextComposeProps> = ({
  leftValue,
  rightValue,
  separator = "//"
}) => {
  const theme = useTheme()

  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }}>
      <Text>{leftValue}</Text>
      <Text style={{
        marginEnd: 2,
        marginStart: 2,
        color: theme.colors.disabled
      }}>{separator}</Text>
      <Text>{rightValue}</Text>
    </View>
  )
}

export default TextCompose
