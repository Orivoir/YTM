import * as React from "react"
import { View, DeviceEventEmitter } from "react-native"
import { Searchbar as PaperSearchbar } from "react-native-paper"
import api from "../../api/ytm-api"
import { EVENT_SEARCH_EXEC } from "../../constant"
import { useAppDispatch } from "../../hooks/redux"
import { createNewResultAlbums, createNewResultArtists, createNewResultMusics, createStartAllPending } from "../../store/actions/searchResultActions"

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => {

  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const isPendingSearchRef = React.useRef<boolean>(false);
  const countStepSearchRef = React.useRef<number>(0);

  const onChangeText = (text: string) => {
    setSearchQuery(text)
  }

  const abortSearch = React.useRef<AbortController>(new AbortController())

  React.useEffect(() => {
    abortSearch.current = new AbortController()

    const subscription = DeviceEventEmitter.addListener(EVENT_SEARCH_EXEC, onTriggerSearch);

    return () => {
      subscription.remove();
      abortSearch.current.abort()
    }
  }, [])

  const nextStepSearch = () => {
    if(++countStepSearchRef.current >= 3) {
      countStepSearchRef.current = 0;
      isPendingSearchRef.current = false;
    }
  }

  const onTriggerSearch = (params: {query: string}) => {
    search(params.query);
  }

  const search = (query: string) => {
    if (isPendingSearchRef.current) {
      return
    }

    isPendingSearchRef.current = true;
    dispatch(createStartAllPending());

    api.searchAlbums(query, { signal: abortSearch.current.signal })
    .then(({albums}) => {
      console.log("> has search fetch albums with success")
      dispatch(createNewResultAlbums(albums));
    })
    .catch(error => {
      console.log("> cant fetch search albums with: ", error)
      // onFetchError(error)
    })
    .finally(() => {
      nextStepSearch();
    })

    api.searchMusics(query, { signal: abortSearch.current.signal })
    .then(({musics}) => {
      console.log("> has search fetch musics with success")
      dispatch(createNewResultMusics(musics));
    })
    .catch(error => {
      console.log("> cant fetch search musics with: ", error)
      // onFetchError(error)
    })
    .finally(() => {
      nextStepSearch();
    })

    api.searchArtists(query, { signal: abortSearch.current.signal })
    .then(({artists}) => {
      console.log("> has search fetch artists with success")
      dispatch(createNewResultArtists(artists));
    })
    .catch(error => {
      console.log("> cant fetch search artists with: ", error)
    })
    .finally(() => {
      nextStepSearch();
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
