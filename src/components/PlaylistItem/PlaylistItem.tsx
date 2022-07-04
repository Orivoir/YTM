import * as React from "react"
import { View } from "react-native"
import { Avatar, IconButton, Surface, Text } from "react-native-paper"
import DatabaseContext from "../../Context/DatabaseContext"
import useSwipeDelete from "../../hooks/useSwipeDelete"
import splitText from "../../libs/splitText"
import PlaylistDetails from "../PlaylistDetails/PlaylistDetails"
import deletePlaylist from "./../../libs/delete-playlist"

interface PlaylistItemProps {
  id: number;
  name: string;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  id,
  name
}) => {
  const database = React.useContext(DatabaseContext)

  const [isOpenDetails, setIsOpenDetails] = React.useState<boolean>(false)

  const thumbnailRef = React.useRef<string | null>(null)

  const isDeletedRef = React.useRef<boolean>(false);

  const onOpenPlaylist = () => {
    setIsOpenDetails(true)
  }

  const onDeletePlaylist = () => {
    isDeletedRef.current = true;
    // setIsOpenConfirmDelete(false);

    deletePlaylist(database, id)
    .then(countMusicsDeleted => {

      console.log(`> has delete playlist with: ${countMusicsDeleted} musics`);

    })
    .catch(error => {
      console.log("> cant delete playlist with: ", error);
    })
  }

  const {render} = useSwipeDelete({
    onDelete: onDeletePlaylist,
    itemType: "playlist",
    relationalText: `Do you want remove playlist ${name} and all musics from this ?`,
    children: (
      <Surface style={{
        paddingVertical: 2,
        paddingHorizontal: 4
      }}>
        <View style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}>
          <View style={{
            marginEnd: 8
          }}>
            {thumbnailRef.current
              ? (
              <Avatar.Image size={32} source={{ uri: thumbnailRef.current }} />
                )
              : (
              <Avatar.Text size={32} label={name.charAt(0)} />
                )}
          </View>

          <View style={{
            marginEnd: 8
          }}>
            <Text>{splitText(name)}</Text>
          </View>

          <View>
            <IconButton icon="folder-music" onPress={onOpenPlaylist} />
          </View>
        </View>
      </Surface>
    )
  })

  if(isDeletedRef.current) {
    return <></>;
  }

  return (
    <>
      {render}

      <PlaylistDetails
        playlist={{name, id}}
        open={isOpenDetails}
        onClose={() => {
          setIsOpenDetails(false)
        }} />
    </>
  )
}

export default PlaylistItem
