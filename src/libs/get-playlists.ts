import { SQLError, SQLResultSet, SQLResultSetRowList, SQLTransaction, WebSQLDatabase } from "expo-sqlite"

export default function getPlaylists (database: WebSQLDatabase) {
  return new Promise<SQLResultSetRowList>((
    resolve: (rows: SQLResultSetRowList) => void,
    reject: (reason: SQLError) => void
  ): void => {
    database.transaction(tx => {
      tx.executeSql("SELECT * FROM playlist", [], (_: SQLTransaction, result: SQLResultSet) => {
        resolve(result.rows)
      }, (_: SQLTransaction, error: SQLError): boolean => {
        reject(error)
        return false
      })
    })
  })
}
