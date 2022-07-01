import * as React from "react"
import { View } from "react-native"
import { Button, Divider, HelperText, Modal, Paragraph, Portal, Surface, useTheme } from "react-native-paper"
import ModalHeader from "../ModalHeader/ModalHeader"
import styles from "../styles"

interface ConfirmActionProps {
  open: boolean;
  onClose: () => void;

  relationalText: string;

  actionContinue: {
    title: string;
    type: "unsafe" | "safe",
    onPress: () => void;
  };

  actionCancel: {
    title: string;
    type: "unsage" | "safe",
    onPress: () => void;
  }

  /**
   * @default "delete"
   */
  actionType?: string;

  /**
   * @default "item"
   */
  itemType?: string;

  /**
   * @description marker cant undo action
   */
  warnCantUndo?: boolean;

  title?: string;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
  open,
  onClose,
  actionType = "delete",
  itemType = "item",
  warnCantUndo = false,
  relationalText,
  actionCancel,
  actionContinue,
  title
}) => {
  const theme = useTheme()

  const getSafeActionButton = (): JSX.Element => {
    const data = actionCancel.type === "safe" ? actionCancel : actionContinue

    return (
      <Button mode="text" onPress={data.onPress}>
        {data.title.toLocaleUpperCase()}
      </Button>
    )
  }

  const getUnsafeActionButton = (): JSX.Element => {
    const data = actionContinue.type === "unsafe" ? actionContinue : actionCancel

    return (
      <Button mode="text" color={theme.colors.error} onPress={data.onPress}>
        {data.title.toLocaleUpperCase()}
      </Button>
    )
  }

  return (
    <Portal>
      <Modal visible={open} onDismiss={onClose}>
        <Surface style={styles.modalContainer}>
          <ModalHeader
            title={`Are you sur ${actionType} ${itemType} ?`}
            subtitle={title}
            onClose={onClose} />

            <View style={{
              marginVertical: 4
            }}>

              <View style={{ marginBottom: 4 }}>
                <View style={{
                  marginBottom: 4
                }}>
                  <Paragraph>{relationalText}</Paragraph>
                </View>

                <HelperText type="error" visible={warnCantUndo}>
                  This action cant be undo.
                </HelperText>
              </View>

              <Divider />

              <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4
              }}>
                {getSafeActionButton()}
                <View style={{ marginHorizontal: 4 }} />
                {getUnsafeActionButton()}
              </View>

            </View>
        </Surface>
      </Modal>
    </Portal>
  )
}

export default ConfirmAction
