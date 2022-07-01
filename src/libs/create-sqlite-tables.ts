import type { SQLError, WebSQLDatabase } from "expo-sqlite"

export default function createSqliteTable (database: WebSQLDatabase): Promise<void> {
  return new Promise<void>((
    resolve: () => void,
    reject: (reason: SQLError) => void
  ): void => {
    database.transaction(tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS playlist(
        id INTEGER  PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )`)

      tx.executeSql(`CREATE TABLE IF NOT EXISTS music(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlist_id INT NOT NULL,
        title TEXT NOT NULL,
        ownerName TEXT NOT NULL,
        filename TEXT NOT NULL,

        publishedAt TEXT DEFAULT NULL,
        thumbnail TEXT DEFAULT NULL,
        ownerThumbnail TEXT DEFAULT NULL,

        FOREIGN KEY (playlist_id)
          REFERENCES playlist (id)
      )`)
    }, reject, resolve)
  })
}
