import * as React from 'react';
import CircularProgress from 'react-native-circular-progress-indicator'
import { useTheme } from 'react-native-paper';


interface CircularProgressDownloadProps {
  size?: number;
  secondsETA?: number;
  progress: number;
  showETA?: boolean;
}

const CircularProgressDownload: React.FC<CircularProgressDownloadProps> = ({
  size=30,
  progress,
  showETA=true,
  secondsETA="unknown"
}) => {

  React.useEffect(() => {}, [])

  const theme = useTheme();

  return (
    <CircularProgress
      value={progress}
      radius={size}
      activeStrokeWidth={3}
      inActiveStrokeWidth={1}
      activeStrokeColor={theme.colors.accent}
      inActiveStrokeColor={theme.colors.disabled}
      titleColor={theme.colors.text}
      subtitleColor={theme.colors.disabled}
      subtitle={showETA ? (secondsETA + " seconds"): ""}
      progressValueColor={theme.colors.text}
      progressValueFontSize={12} />
  );
}

export default CircularProgressDownload;