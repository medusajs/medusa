import { useInstantSearch } from "react-instantsearch"

type SearchEmptyQueryBoundaryProps = {
  children: React.ReactNode
  fallback: React.ReactNode
}

const SearchEmptyQueryBoundary = ({
  children,
  fallback,
}: SearchEmptyQueryBoundaryProps) => {
  const { indexUiState } = useInstantSearch()

  if (!indexUiState.query) {
    return fallback
  }

  return children
}

export default SearchEmptyQueryBoundary
