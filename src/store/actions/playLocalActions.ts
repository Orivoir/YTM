import { PlayLocalAction, PlayLocalState } from "../reducers/playLocalReducers"

export const createPlayLocalMusic = (value: PlayLocalState): PlayLocalAction => ({
  type: "PLAY_LOCAL_MUSIC",
  value
})

export const createCancelLocalMusic = (): PlayLocalAction => ({
  type: "CANCEL_LOCAL_MUSIC"
})
