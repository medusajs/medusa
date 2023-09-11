import React from "react"
import { useInstantSearch } from "react-instantsearch"

type SearchEmptyQueryBoundaryProps = {
  children: React.ReactElement
  fallback: React.ReactElement
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
