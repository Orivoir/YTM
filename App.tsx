import React from "react"
import { StatusBar } from "expo-status-bar"
import DatabaseContext, { database } from "./src/Context/DatabaseContext"

import createSqliteTable from "./src/libs/create-sqlite-tables"
import Routing from "./src/components/Routing"
import { Provider as ThemeProvider, DarkTheme, ActivityIndicator, Text } from "react-native-paper"
import { Provider as ReduxProvider } from "react-redux"
import store from "./src/store"
import { View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function App () {
  const [isPrePending, setIsPrePending] = React.useState(true)
  const isPrePendingError = React.useRef<boolean>(false)

  React.useEffect(() => {
    createSqliteTable(database)
      .catch(error => {
        isPrePendingError.current = true
        console.log("> create SQLite tables has fail with: ", error)
      })
      .then(() => {
        console.log("> SQLite tables has been created.")
      })
      .finally(() => {
        setIsPrePending(false)
      })
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" translucent={false} />

      <DatabaseContext.Provider value={database}>

        <ReduxProvider store={store}>
          <ThemeProvider theme={DarkTheme}>

              {isPrePending
                ? (
                <View style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <ActivityIndicator animating size={32} />
                </View>
                  )
                : <Routing />}

          </ThemeProvider>
        </ReduxProvider>

      </DatabaseContext.Provider>
    </GestureHandlerRootView>
  )
}
