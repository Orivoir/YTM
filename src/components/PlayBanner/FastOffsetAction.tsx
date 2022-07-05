import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Animated, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { AUDIO_FAST_OFFSET_BATCH_COULDOWN_DURATION, AUDIO_FAST_OFFSET_TIME_DURATION } from '../../constant';

interface FastOffsetActionProps {
  onOffsetTime: () => void;
  direction: "forward" | "backward";
}

const AnimatedText = Animated.createAnimatedComponent(Text);

const FastOffsetAction: React.FC<FastOffsetActionProps> = ({
  onOffsetTime,
  direction
}) => {

  const fadeText = React.useRef(new Animated.Value(0));

  const couldownID = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const isInTransitionRef = React.useRef<boolean>(false);

  const theme = useTheme();

  React.useEffect(() => {

    return () => {
      if(couldownID.current) {
        clearTimeout(couldownID.current);
      }
    }
  }, [])

  return (
    <View style={{position: "relative"}}>
      <Animated.Text style={{
        color: theme.colors.text,
        position: "absolute",
        opacity: fadeText.current
      }}>
        {direction === "backward" ? "-": "+"}
        {AUDIO_FAST_OFFSET_TIME_DURATION/1000}
        {/* <></> */}
      </Animated.Text>
      <IconButton
        onPress={() => {
          if(!isInTransitionRef.current) {
            isInTransitionRef.current = true;
            Animated.timing(fadeText.current, {
              toValue: 1,
              duration: AUDIO_FAST_OFFSET_BATCH_COULDOWN_DURATION / 2,
              useNativeDriver: true
            })
            .start(({finished}) => {
              isInTransitionRef.current = false;
            })

            couldownID.current = setTimeout(() => {
              Animated.timing(fadeText.current, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
              })
              .start(({finished}) => {})
            }, AUDIO_FAST_OFFSET_BATCH_COULDOWN_DURATION);
          }
          onOffsetTime()
        }}
        icon={`step-${direction}`}
        size={24} />
    </View>
  );
}

export default FastOffsetAction;