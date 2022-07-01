import { SQLError, SQLResultSet, SQLResultSetRowList, SQLTransaction, WebSQLDatabase } from "expo-sqlite"

export default function getPlaylists (database: WebSQLDatabase, music: {
  playlist_id: number,
  title: string,
  ownerName: string,
  filename: string,
  publishedAt?: string,
  thumbnail?: string,
  ownerThumbnail?: string
}): Promise<number | null> {
  return new Promise<number | null>((
    resolve: (insertedId: number | null) => void,
    reject: (reason: SQLError) => void
  ): void => {
    database.transaction(tx => {
      tx.executeSql(`INSERT INTO
        music(
          playlist_id,
          title,
          ownerName,
          filename,
          publishedAt,
          thumbnail,
          ownerThumbnail
        ) VALUES(?,?,?,?,?,?,?)`, [
        music.playlist_id,
        music.title,
        music.ownerName,
        music.filename,
        music.publishedAt || "NULL",
        music.thumbnail || "NULL",
        music.ownerThumbnail || "NULL"
      ], (_: SQLTransaction, result: SQLResultSet) => {
        resolve(result.insertId || null)
      }, (_: SQLTransaction, error: SQLError): boolean => {
        reject(error)
        return false
      })
    })
  })
}
