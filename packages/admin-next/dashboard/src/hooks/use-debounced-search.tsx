import debounce from "lodash/debounce"
import { useCallback, useEffect, useState } from "react"

/**
 * Hook for debouncing search input
 * @returns searchValue, onSearchValueChange, query
 */
export const useDebouncedSearch = () => {
  const [searchValue, onSearchValueChange] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((query: string) => setDebouncedQuery(query), 300),
    []
  )

  useEffect(() => {
    debouncedUpdate(searchValue)

    return () => debouncedUpdate.cancel()
  }, [searchValue, debouncedUpdate])

  return {
    searchValue,
    onSearchValueChange,
    query: debouncedQuery || undefined,
  }
}
