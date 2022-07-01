export type PlayLocalState = {
  filename: string;
  id: number;
  ownerName: string;
  playlist_id: number;
  title: string;
  ownerThumbnail?: string;
  publishedAt?: string;
  thumbnail?: string;
} | null;

export type PlayLocalActionName = "PLAY_LOCAL_MUSIC" | "CANCEL_LOCAL_MUSIC";

export type PlayLocalAction = {
  type: PlayLocalActionName;
  value?: PlayLocalState;
}

const INITIAL_STATE: PlayLocalState = null

export default function playLocalReducers (
  state: PlayLocalState = INITIAL_STATE,
  action: PlayLocalAction
): PlayLocalState {
  switch (action.type) {
    case "CANCEL_LOCAL_MUSIC":
      return null
    case "PLAY_LOCAL_MUSIC":
      return action.value ? action.value : null
    default:
      return state
  }
}
