import { useInstantSearch } from "react-instantsearch"

type EmptyQueryBoundaryProps = {
  children: React.ReactNode
  fallback: React.ReactNode
}

const EmptyQueryBoundary = ({
  children,
  fallback,
}: EmptyQueryBoundaryProps) => {
  const { indexUiState } = useInstantSearch()

  if (!indexUiState.query) {
    return fallback
  }

  return children
}

export default EmptyQueryBoundary
