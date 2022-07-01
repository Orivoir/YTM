import * as React from "react"

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { NavigationContainer, DarkTheme } from "@react-navigation/native"
import Home from "./Screens/Home"
import Search from "./Screens/Search"
import Playlists from "./Screens/Playlists"
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons"
import Header from "./Header/Header"
import SearchItemDetails from "./SearchItemDetails/SearchItemDetails"
import DownloadBanner from "./DownloadBanner/DownloadBanner"
import PlayBanner from "./PlayBanner/PlayBanner"

export type BottomTabParamsList = {
  Home: undefined,
  Search: undefined,
  Playlists: undefined
}

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamsList>()

interface RoutingProps {}

const Routing: React.FC<RoutingProps> = () => {
  return (
    <>
    <NavigationContainer theme={DarkTheme}>

      <Header />

      <SearchItemDetails />
      <DownloadBanner />

      <PlayBanner />

      <BottomTab.Navigator initialRouteName='Home'>
        <BottomTab.Screen options={{
          tabBarIcon: (props) => (
            <MaterialIcon {...props} size={24} name="home" />
          )
        }} name='Home' component={Home} />
        <BottomTab.Screen options={{
          tabBarIcon: (props) => (
            <MaterialIcon {...props} size={24} name="magnify" />
          )
        }} name='Search' component={Search} />
        <BottomTab.Screen options={{
          tabBarIcon: (props) => (
            <MaterialIcon {...props} size={24} name="playlist-music" />
          )
        }} name='Playlists' component={Playlists} />
      </BottomTab.Navigator>
    </NavigationContainer>
    </>
  )
}

export default Routing
