import * as React from "react"

import Swipable from "react-native-gesture-handler/Swipeable"
import { RectButton } from "react-native-gesture-handler"
import { StyleProp, View, ViewProps, Animated } from "react-native"
import { Title, useTheme } from "react-native-paper"

interface SwipeTrashProps {
  children: JSX.Element | JSX.Element[];
  onTrash: () => void;
  containerStyle?: StyleProp<ViewProps>;
  contentAction: string | JSX.Element;
  contentActionIcon?: JSX.Element;

  onGetSwipableRef?: (swipableRef: Swipable) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View)

const SwipeTrash: React.FC<SwipeTrashProps> = ({
  children,
  onTrash,
  containerStyle,
  contentAction,
  contentActionIcon,
  onGetSwipableRef
}) => {
  const theme = useTheme()

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp"
    })

    const translateX = dragX.interpolate({
      inputRange: [-160, 0],
      outputRange: [-20, 0]
    })

    return (
        <RectButton style={{
          flex: 1,
          backgroundColor: theme.colors.error,
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row"
        }}>

          <AnimatedView style={{
            transform: [
              { scale },
              { translateX }
            ],
            marginHorizontal: 4
          }}>
            {typeof contentAction !== "string"
              ? contentAction
              : (
              <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}>
                <Title style={{ marginEnd: 4 }}>{contentAction}</Title>
                {contentActionIcon}
              </View>
                )}
          </AnimatedView>

        </RectButton>
    )
  }

  return (
    <Swipable
      ref={swipableRef => {
        if (swipableRef && onGetSwipableRef instanceof Function) {
          onGetSwipableRef(swipableRef)
        }
      }}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => onTrash()}
      overshootRight={false}
      enableTrackpadTwoFingerGesture>
        <View style={containerStyle || {}}>
          {children}
        </View>
    </Swipable>
  )
}

export default SwipeTrash
