import * as React from "react"
import { View } from "react-native"
import { Searchbar as PaperSearchbar } from "react-native-paper"
import api, { AlbumPreviewAPI, ArtistPreviewAPI, MusicVideoAPI } from "../../api/ytm-api"

interface SearchBarProps {
  onNewAlbums: (albums: AlbumPreviewAPI[]) => void;
  onNewMusics: (musics: MusicVideoAPI[]) => void;
  onNewArtists: (artists: ArtistPreviewAPI[]) => void;

  onSubmitSearch?: (query: string) => boolean
  onStartPending?: () => void;
  onFetchError?: (reason: any) => void;
  onNewAbortController?: (abortController: AbortController) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onNewAlbums,
  onNewArtists,
  onNewMusics,
  onFetchError = () => {},
  onSubmitSearch = () => true,
  onNewAbortController = () => {},
  onStartPending=() => {}
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const onChangeText = (text: string) => {
    setSearchQuery(text)
  }

  const abortSearch = React.useRef<AbortController>(new AbortController())

  React.useEffect(() => {
    abortSearch.current = new AbortController()
    onNewAbortController(abortSearch.current)
    return () => {
      abortSearch.current.abort()
    }
  }, [])

  const search = (query: string) => {
    if (!onSubmitSearch(query)) {
      return
    }

    onStartPending();

    api.searchAlbums(query, { signal: abortSearch.current.signal })
    .then(({albums}) => {
      console.log("> has search fetch albums with success")
      onNewAlbums(albums);
    })
    .catch(error => {
      console.log("> cant fetch search albums with: ", error)
      onFetchError(error)
    })

    api.searchMusics(query, { signal: abortSearch.current.signal })
    .then(({musics}) => {
      console.log("> has search fetch musics with success")
      onNewMusics(musics);
    })
    .catch(error => {
      console.log("> cant fetch search musics with: ", error)
      onFetchError(error)
    })

    api.searchArtists(query, { signal: abortSearch.current.signal })
    .then(({artists}) => {
      console.log("> has search fetch artists with success")
      onNewArtists(artists);
    })
    .catch(error => {
      console.log("> cant fetch search artists with: ", error)
      onFetchError(error)
    })
  }

  const onSearch = () => {
    search(searchQuery)
  }

  return (
    <View>
      <PaperSearchbar
        onChangeText={onChangeText}
        value={searchQuery}
        onSubmitEditing={onSearch}
        placeholder='title, artist, album...' />
    </View>
  )
}

export default SearchBar
