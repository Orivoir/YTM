import { SQLError, SQLResultSet, SQLTransaction, WebSQLDatabase } from "expo-sqlite";
import deleteMusicFileSystem from "./delete-music-file-system";

export default function deleteMusic(
  database: WebSQLDatabase,
  musicId: number,
  filename: string
): Promise<boolean> {

  return new Promise<boolean>((
    resolve: (isDeleted: boolean) => void,
    reject: (error: SQLError) => void
  ): void => {
    deleteMusicFileSystem(filename)
    .then(() => {
      console.log("DELETE FILE SYSTEM")
      database.transaction(tx => {
        tx.executeSql(
          "DELETE FROM music WHERE id = ?",
          [musicId],
          (_: SQLTransaction, result: SQLResultSet) => {
            console.log("DELETE SQLITE ENTRY")
            resolve(result.rowsAffected === 1)
          },
          (_: SQLTransaction, error: SQLError) => {
            reject(error)
            return false;
          }
        )
      })
    })
    .catch(reject)
  })

}