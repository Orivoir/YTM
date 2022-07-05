import * as React from 'react';
import { View, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { Sound } from 'expo-av/build/Audio';
import { AVPlaybackStatus } from 'expo-av';
import { IconButton, Portal } from 'react-native-paper';

interface VolumeActionProps {
  sound: Sound
}

const VolumeAction: React.FC<VolumeActionProps> = ({
  sound
}) => {

  const [volume, setVolume] = React.useState<number>(0);
  const isPendingRef = React.useRef<boolean>(true);

  const sliderAnimatedValue = React.useRef(new Animated.Value(0));

  const sliderToValueRef = React.useRef<number>(1);

  const markerPosition = React.useRef(new Animated.ValueXY({x: 0, y: 0}));

  const markerRef = React.useRef<View | null>(null);

  React.useEffect(() => {
    sound.getStatusAsync()
    .then((status: AVPlaybackStatus) => {
      if(status.isLoaded) {
        console.log("> initial volume: ", status.volume);
        isPendingRef.current = false;
        onVolumeChange(status.volume, true);
      }
    })
  }, [sound]);


  const onVolumeChange = (newVolume: number, skipToggleVolume=false) => {
    setVolume(newVolume);

    sound.setVolumeAsync(newVolume)
    .then(() => {
      console.log("> set volume at: ", newVolume);

      if(!skipToggleVolume) {
        onSetVolume();
      }
    })
  }

  if(isPendingRef.current) {
    return <></>;
  }

  const getIconName = (): string => {
    if(volume === 0) {
      return "volume-mute"
    } else if(volume <= .33) {
      return "volume-low"
    } else if(volume <= .5) {
      return "volume-medium"
    } else {
      return "volume-high"
    }
  }

  const onSetVolume = () => {

    Animated.timing(sliderAnimatedValue.current, {
      toValue: sliderToValueRef.current,
      duration: 500,
      useNativeDriver: true,
    }).start(({finished}) => {
      if(finished) {
        sliderToValueRef.current = sliderToValueRef.current === 1 ? 0: 1
      }
    })
  }

  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    }}>
      {/* Volume icon button */}
      <Animated.View style={{
        opacity: sliderAnimatedValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0]
        }),
        transform: [
          {translateY: sliderAnimatedValue.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 30]
          })}
        ]
      }}>
        <IconButton icon={getIconName()} onPress={onSetVolume} />
      </Animated.View>

      {/* marker position Slider */}
      <View ref={view => {
        markerRef.current = view;
      }} onLayout={() => {

        markerRef.current?.measure((x,y, width, height, pageX, pageY) => {
            Animated.timing(markerPosition.current, {
            toValue: {
              x: pageX - width,
              y: pageY
            },
            duration: 250,
            useNativeDriver: true
          })
          .start();
        })

      }} style={{
        position: "absolute",
        height: 10,
        width: 10,
      }} />

      {/* Slider */}
      <Portal>
        <Animated.View style={{
          position: "absolute",
          width: 120,
          // backgroundColor: "red",
          opacity: sliderAnimatedValue.current,
          transform: [
            {translateY: Animated.add(markerPosition.current.y, sliderAnimatedValue.current.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0]
            }))},
            {translateX: markerPosition.current.x}
          ]
        }}>
          <Slider
            style={{flex: 1}}
            onSlidingComplete={onVolumeChange}
            step={.1}
            value={volume}
            maximumValue={1}
            minimumValue={0} />
        </Animated.View>
      </Portal>
    </View>
  );
}

export default VolumeAction;