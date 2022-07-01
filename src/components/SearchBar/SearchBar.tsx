import * as React from "react"
import { View } from "react-native"
import { Searchbar as PaperSearchbar } from "react-native-paper"
import api, { AlbumPreviewAPI, ArtistPreviewAPI, MusicVideoAPI } from "../../api/ytm-api"

interface SearchBarProps {
  onNewItems: (items: {
    artists: ArtistPreviewAPI[],
    musics: MusicVideoAPI[],
    albums: AlbumPreviewAPI[]
  }) => void;

  onSubmitSearch?: (query: string) => boolean
  onTogglePending?: (isPending: boolean) => void;
  onFetchError?: (reason: any) => void;
  onNewAbortController?: (abortController: AbortController) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onNewItems,
  onTogglePending = () => {},
  onFetchError = () => {},
  onSubmitSearch = () => true,
  onNewAbortController = () => {}
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

    onTogglePending(true)

    Promise.all([
      api.searchAlbums(query, { signal: abortSearch.current.signal }),
      api.searchMusics(query, { signal: abortSearch.current.signal }),
      api.searchArtists(query, { signal: abortSearch.current.signal })
    ])
      .then(responses => {
        console.log("> has search fetch with success")

        const albums = responses[0].albums
        const musics = responses[1].musics
        const artists = responses[2].artists

        onNewItems({
          albums,
          artists,
          musics
        })
      })
      .catch(firstError => {
        console.log("> cant fetch search with: ", firstError)
        onFetchError(firstError)
      })
      .finally(() => {
        onTogglePending(false)
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
