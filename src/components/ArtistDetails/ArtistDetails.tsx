import * as React from "react"
import ModalHeader from "../ModalHeader/ModalHeader"
import type { ArtistPreviewAPI } from "./../../api/ytm-api"

interface ArtistDetailsProps {
  item: ArtistPreviewAPI;
  onClose: () => void;
}

const ArtistDetails: React.FC<ArtistDetailsProps> = ({
  item,
  onClose
}) => {
  return (
    <>
    <ModalHeader title={item.name || ""} subtitle={item.subscribers} onClose={onClose} />
    </>
  )
}

export default ArtistDetails
