import {
  documentDirectory,
  deleteAsync
} from "expo-file-system";

export default function deleteMusicFileSystem(filename: string): Promise<void> {
  return deleteAsync(documentDirectory + filename);
}
