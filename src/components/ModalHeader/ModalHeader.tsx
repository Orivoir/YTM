import * as React from "react"
import { Appbar } from "react-native-paper"

interface ModalHeaderProps {
  onClose: () => void;
  title: string;
  subtitle?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  onClose,
  title,
  subtitle
}) => {
  return (
    <Appbar>
      <Appbar.Content title={title} subtitle={subtitle} />

      <Appbar.Action icon="close" onPress={onClose} />
    </Appbar>
  )
}

export default ModalHeader
