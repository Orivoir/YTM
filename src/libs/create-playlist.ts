import { SQLError, SQLResultSet, SQLResultSetRowList, SQLTransaction, WebSQLDatabase } from "expo-sqlite"

export default function getPlaylists (database: WebSQLDatabase, name: string): Promise<number | null> {
  return new Promise<number | null>((
    resolve: (insertedId: number | null) => void,
    reject: (reason: SQLError) => void
  ): void => {
    database.transaction(tx => {
      tx.executeSql("INSERT INTO playlist(name) VALUES(?)", [name], (_: SQLTransaction, result: SQLResultSet) => {
        resolve(result.insertId || null)
      }, (_: SQLTransaction, error: SQLError): boolean => {
        reject(error)
        return false
      })
    })
  })
}
