import * as React from "react"
import { TextInput } from "react-native-paper"

interface InputPlaylistProps {
  onSubmit: (playlistName: string) => void;
  onBlur: (playlistName: string) => void;

  pattern?: RegExp;
  onValid?: () => void;
  onInvalid?: () => void;
}

const InputPlaylist: React.FC<InputPlaylistProps> = ({
  onSubmit,
  onBlur,
  pattern,
  onValid,
  onInvalid
}) => {
  const [playlistName, setPlaylistName] = React.useState<string>("")
  const [error, setError] = React.useState<boolean>(false)

  const onChangeValue = (text: string) => {
    setPlaylistName(text)

    if (pattern instanceof RegExp) {
      if (!pattern.test(text)) {
        setError(true)
        onInvalid instanceof Function && onInvalid()
      } else {
        setError(false)
        onValid instanceof Function && onValid()
      }
    }
  }

  return (
    <TextInput
      error={error}
      right={(
        <TextInput.Affix text={`${playlistName.length}/32`} />
      )}
      value={playlistName}
      placeholder='playlist'
      blurOnSubmit
      onEndEditing={() => onBlur(playlistName.trim())}
      onBlur={() => onBlur(playlistName.trim())}
      onSubmitEditing={() => onSubmit(playlistName.trim())}
      onChangeText={onChangeValue} />
  )
}

export default InputPlaylist
