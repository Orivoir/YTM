import { SQLError, SQLResultSet, SQLResultSetRowList, SQLTransaction, WebSQLDatabase } from "expo-sqlite"

export default function getMusicsByPlaylist (
  database: WebSQLDatabase,
  playlistId: number
) {
  return new Promise<SQLResultSetRowList>((
    resolve: (rows: SQLResultSetRowList) => void,
    reject: (error: SQLError) => void
  ): void => {
    database.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM music WHERE playlist_id = ?",
        [playlistId],
        (_: SQLTransaction, result: SQLResultSet) => {
          resolve(result.rows)
        },
        (_: SQLTransaction, error: SQLError): boolean => {
          reject(error)
          return false
        }
      )
    })
  })
}
