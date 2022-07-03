import * as React from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import { ProgressBar as PaperProgressBar } from 'react-native-paper';
import { EVENT_DOWNLOAD_PROGRESS_UPDATE } from '../../constant';
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

    const subscription = DeviceEventEmitter.addListener(EVENT_DOWNLOAD_PROGRESS_UPDATE, onProgressUpdate);

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