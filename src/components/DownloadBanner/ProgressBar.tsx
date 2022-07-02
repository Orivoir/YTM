import * as React from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import { ProgressBar as PaperProgressBar } from 'react-native-paper';
import { ProgressState } from '../../hooks/useDownload';

interface ProgressBarProps {}

const ProgressBar: React.FC<ProgressBarProps> = () => {

  const [progress, setProgress] = React.useState<number>(0);

  const onProgressUpdate = (state: {
    percent: number;
    totalBytesExpectedToWrite: number;
    totalBytesWritten: number;
    isFinish: boolean;
  }) => {
    setProgress(state.percent / 100);
  }

  React.useEffect(() => {

    const subscription = DeviceEventEmitter.addListener("progress.update", onProgressUpdate);

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <View>
      <PaperProgressBar progress={progress} />
    </View>
  );
}

export default ProgressBar;