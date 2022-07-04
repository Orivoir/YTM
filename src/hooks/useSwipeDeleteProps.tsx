import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function useSwipeDeleteProps() {

  const theme = useTheme();

  const contentActionIcon = <MaterialCommunityIcons name="trash-can" size={24} color={theme.colors.text} />;
  const contentAction = "REMOVE"

  return {
    contentActionIcon,
    contentAction
  }
}