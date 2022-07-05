# todo list of YTM app:

## Non-Render todos:

- [x] component `MusicInline` should implement callback `onDownload`.
- [ ] screen `Search` cancel search button not work.
- [x] screen `Search` should implement action search from `Chip` suggestions.
- [x] component `PlaylistItem` should implement delete playlist action, with `SwipeTrash` component.
- [x] folder `./libs` should create file `delete-playlist.ts`.
- [x] folder `./libs` should create file `delete-music-file-system.ts`.
- [x] component `CreatePlaylist` when press button create before validate input from virtual keyboard not work *(playlist cant be empty)*.
- [x] screen `Playlist` not refresh after a download finish, fix it with create reducers `musicsReducers`.
- [ ] component `PlayBanner` emit **can't perform React state...** during `onCancel` action, free memory (unload audio) before dispatch cancel action.
- [x] component `Search` should provide API data **step-by-step** *(musics, albums, artists)* replace `Promise.all` with *standalone promises*.
- [x] component `DownloadBanner` should implement action `onCancelDownload`.
- [ ] component `DownloadBanner` should be refactoring *(200 lines)*, download context can be provide from a custom hook.
- [x] reducers `downloadReducers` should implement a action **"ADD_MULTIPLE_DOWNLOAD"** with a array of `DownloadStateItem` as value.
- [x] component `AlbumDetails` should implement action *download all album*.
- [ ] component `Home` should implement action *fetch category*.
- [ ] folder `./components` should create component `Stats` show consumers data *(network, local file, SQLite tables)*.
- [x] component `MusicLocalInline` should implement action delete with `SwipeTrash` component.
- [x] folder `./libs` should create file `delete-music.ts` *(from SQLite table)*.
- [x] component `PlayBanner` should replace state `forceRefresh` with best practice.
- [ ] component `PlayBanner` should be refactoring *(185 lines)*, audio context can be provide from a custom hooks.
- [ ] component `PlayBanner` should implement actions *next music* and *previous music*.
- [ ] network requests freeze UI [facebook/react-native #32867](https://github.com/facebook/react-native/issues/32867)
- [x] hooks re implements useCanDownload *(currently based on removed code)*
- [x] component `SelectPlaylist` should implement action create new playlist
- [x] component `SelectPlaylist` at randomly times emit: **Can't perform a React state update on an unmounted component.**
- [ ] component `Timeline` during action cancel play audio emit: **Can't perform a React state update on an unmounted component.**
- [ ] component `CreatePlaylist` should reject create many times playlist with same name.
- [x] component `AlbumDetails` is laggy/jerky, the `SelectPlaylist` modal should be unique into **App**, render at Routing component and open/close with `DeviceEventEmitter`
- [x] component `PlayBanner` *crash* during play file and remove file at same time, remove music action should **emit event** with `DeviceEventEmitter` **before** remove file system

## Render todos:

- [x] component `Timeline` should replace usage of deprecated native component `Slider`.
- [ ] component `Timeline` set current time with *non drag-and-drop* (only press) not work.
- [ ] component `MusicInline` can has *large text* cause outside area.
- [ ] component `DownloadBanner` render to big, should be refactoring.
- [ ] component `ArtistDetails` should implement body render
- [ ] component `Header` should implement action *show stats*
- [ ] component `PlayBanner` render to big, should be refactoring.
