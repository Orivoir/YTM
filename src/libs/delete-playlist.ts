import { SQLError, SQLResultSet, SQLTransaction, WebSQLDatabase } from 'expo-sqlite';
import deleteMusicFileSystem from './delete-music-file-system'
import getMusicsByPlaylist from './get-musics-by-playlist'

export default function deletePlaylist(database: WebSQLDatabase, playlistId: number) {
  return new Promise<number | null>((
    resolve: (countMusicDeleted: number | null) => void,
    reject: (reason: SQLError) => void
  ): void => {

    // get musics from playlist id
    getMusicsByPlaylist(database, playlistId)
    .then(rows => {

      // remove physical file for each music
      Promise.all([
        rows._array.map(music => (
          deleteMusicFileSystem(music.filename)
        ))
      ])
      .then(() => {

        let countMusicDeleted: number | null = null;

        let ready = false;

        const nextStep = () => {
          if(!ready) {
            ready = true;
            return;
          } else {
            resolve(countMusicDeleted);
          }
        }

        database.transaction(tx => {

          // delete SQLite musics entries
          tx.executeSql("DELETE FROM music WHERE playlist_id = ?", [playlistId], (_: SQLTransaction, result: SQLResultSet) => {
            countMusicDeleted = result.rowsAffected;
            nextStep();
          }, (_: SQLTransaction, error: SQLError): boolean => {
            reject(error)
            return false
          })

          // delete SQLite playlist entry
          tx.executeSql("DELETE FROM playlist WHERE id = ?", [playlistId], (_: SQLTransaction, result: SQLResultSet) => {
            nextStep();
          }, (_: SQLTransaction, error: SQLError): boolean => {
            reject(error)
            return false
          })

        })

      })
      .catch(reject);

    })
    .catch(reject);
  })
}
