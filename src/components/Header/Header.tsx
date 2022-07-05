import * as React from "react"
import { Appbar } from "react-native-paper"
import { useAppDispatch } from "../../hooks/redux"

interface HeaderProps {

}

const Header: React.FC<HeaderProps> = () => {
  return (
    <Appbar style={{
      zIndex: 1
    }}>
      <Appbar.Content title="YTM" subtitle="YouTube Music" />
    </Appbar>
  )
}

export default Header
