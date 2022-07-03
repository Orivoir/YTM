import * as React from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Sound } from 'expo-av/build/Audio';
import { AVPlaybackStatus } from 'expo-av';
import { IconButton } from 'react-native-paper';

interface VolumeActionProps {
  sound: Sound
}

const VolumeAction: React.FC<VolumeActionProps> = ({
  sound
}) => {

  const [volume, setVolume] = React.useState<number>(0);
  const isPendingRef = React.useRef<boolean>(true);

  React.useEffect(() => {
    sound.getStatusAsync()
    .then((status: AVPlaybackStatus) => {
      if(status.isLoaded) {
        console.log("> initial volume: ", status.volume);
        isPendingRef.current = false;
        onVolumeChange(status.volume);
      }
    })
  }, [sound]);

  const onVolumeChange = (newVolume: number) => {
    setVolume(newVolume);

    sound.setVolumeAsync(newVolume)
    .then(() => {
      console.log("> set volume at: ", newVolume);
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
    if(volume > 0) {
      onVolumeChange(0);
    } else {
      onVolumeChange(.5);
    }
  }

  return (
    <View style={{
      marginHorizontal: 8,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flex: 1
    }}>
      <View>
        <IconButton icon={getIconName()} onPress={onSetVolume} />
      </View>

      <Slider
        style={{flex: 1}}
        onValueChange={onVolumeChange}
        step={.1}
        vertical={false}
        value={volume}
        maximumValue={1}
        minimumValue={0} />
    </View>
  );
}

export default VolumeAction;