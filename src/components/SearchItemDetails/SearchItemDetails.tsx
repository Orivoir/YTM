import * as React from "react"
import { Modal, Portal, Surface } from "react-native-paper"
import type { AlbumPreviewAPI, ArtistPreviewAPI, MusicVideoAPI } from "../../api/ytm-api"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { createCancel } from "../../store/actions/searchDetailsActions"
import { SearchDetailsState } from "../../store/reducers/searchDetailsReducers"
import AlbumDetails from "../AlbumDetails/AlbumDetails"
import ArtistDetails from "../ArtistDetails/ArtistDetails"
import MusicDetails from "../MusicDetails/MusicDetails"
import styles from "../styles"

interface SearchItemDetailsProps {

}

const SearchItemDetails: React.FC<SearchItemDetailsProps> = () => {
  const searchDetails = useAppSelector(state => state.searchDetails)
  const dispatch = useAppDispatch()

  const isAlbum = (details: SearchDetailsState): details is AlbumPreviewAPI => (
    !!(details as AlbumPreviewAPI)?.albumId
  )
  const isArtist = (details: SearchDetailsState): details is ArtistPreviewAPI => (
    !!(details as ArtistPreviewAPI)?.artistId
  )
  const isMusic = (details: SearchDetailsState): details is MusicVideoAPI => (
    !!(details as MusicVideoAPI)?.youtubeId
  )

  const getComponent = (details: SearchDetailsState | null = null): React.ElementType<{
    onClose: () => void;
    item: any
  }> | never => {
    if (!details) {
      return React.Fragment
    }

    if (isAlbum(details)) {
      return AlbumDetails
    } else if (isArtist(details)) {
      return ArtistDetails
    } else if (isMusic(details)) {
      return MusicDetails
    } else {
      throw new Error("cant render SearchItemDetails because never find item category")
    }
  }

  const Component = getComponent(searchDetails)

  const onCancelDetails = () => {
    dispatch(createCancel())
  }

  if (!searchDetails) {
    return <></>
  }

  return (
    <Portal>
      <Modal visible={!!searchDetails} onDismiss={onCancelDetails}>
        <Surface style={styles.modalContainer}>
          {!!searchDetails && <Component onClose={onCancelDetails} item={searchDetails} />}
        </Surface>
      </Modal>
    </Portal>
  )
}

export default SearchItemDetails
