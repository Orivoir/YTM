import * as React from "react"
import SelectPlaylist from "../components/SelectPlaylist/SelectPlaylist"

export type UseSelectPlaylistOptions = {
  musicTitle: string;
}

export default function useSelectPlaylist (options: UseSelectPlaylistOptions) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const [playlist, setPlaylist] = React.useState<{id: number, name: string} | null>(null)

  const onSelect = (_playlist: {id: number, name: string}) => {
    setPlaylist(_playlist)
  }

  const onOpen = () => (
    setIsOpen(true)
  )

  const render = (
    <SelectPlaylist
      musicTitle={options.musicTitle}
      onClose={() => setIsOpen(false)}
      onSelect={onSelect}
      open={isOpen} />
  )

  return {
    render,
    playlist,
    onOpen
  }
}
