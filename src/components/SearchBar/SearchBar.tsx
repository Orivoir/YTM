import * as React from "react"
import { View } from "react-native"
import { Searchbar as PaperSearchbar } from "react-native-paper"
import api from "../../api/ytm-api"
import { useAppDispatch } from "../../hooks/redux"
import { createNewResultAlbums, createNewResultArtists, createNewResultMusics, createStartAllPending } from "../../store/actions/searchResultActions"

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => {

  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const onChangeText = (text: string) => {
    setSearchQuery(text)
  }

  const abortSearch = React.useRef<AbortController>(new AbortController())

  React.useEffect(() => {
    abortSearch.current = new AbortController()
    // onNewAbortController(abortSearch.current)
    return () => {
      abortSearch.current.abort()
    }
  }, [])

  const search = (query: string) => {
    // if (!onSubmitSearch(query)) {
    //   return
    // }

    dispatch(createStartAllPending());

    api.searchAlbums(query, { signal: abortSearch.current.signal })
    .then(({albums}) => {
      console.log("> has search fetch albums with success")
      // onNewAlbums(albums);
      dispatch(createNewResultAlbums(albums));
    })
    .catch(error => {
      console.log("> cant fetch search albums with: ", error)
      // onFetchError(error)
    })

    api.searchMusics(query, { signal: abortSearch.current.signal })
    .then(({musics}) => {
      console.log("> has search fetch musics with success")
      dispatch(createNewResultMusics(musics))
      // onNewMusics(musics);
    })
    .catch(error => {
      console.log("> cant fetch search musics with: ", error)
      // onFetchError(error)
    })

    api.searchArtists(query, { signal: abortSearch.current.signal })
    .then(({artists}) => {
      console.log("> has search fetch artists with success")
      dispatch(createNewResultArtists(artists));
    })
    .catch(error => {
      console.log("> cant fetch search artists with: ", error)
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
