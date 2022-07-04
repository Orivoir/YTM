import { SQLError, SQLResultSet, SQLTransaction, WebSQLDatabase } from "expo-sqlite";
import deleteMusicFileSystem from "./delete-music-file-system";

export default function deleteMusic(database: WebSQLDatabase, musicId: number): Promise<boolean> {

  return new Promise<boolean>((
    resolve: (isDeleted: boolean) => void,
    reject: (error: SQLError) => void
  ): void => {
    database.transaction(tx => {

      tx.executeSql(
        "SELECT filename FROM music WHERE id = ?",
        [musicId],
        (_: SQLTransaction, result: SQLResultSet) => {
          deleteMusicFileSystem(result.rows._array[0].filename)
          .then(() => {
            tx.executeSql(
              "DELETE FROM music WHERE id = ?",
              [musicId],
              (_: SQLTransaction, result: SQLResultSet) => {
                resolve(result.rowsAffected === 1)
              },
              (_: SQLTransaction, error: SQLError) => {
                reject(error)
                return false;
              }
            )
          })
          .catch(reject)
        },
        (_: SQLTransaction, error: SQLError) => {
          reject(error)
          return false;
        }
      )
    })
  })

}